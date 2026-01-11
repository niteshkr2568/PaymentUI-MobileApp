import { ChatOllama } from "@langchain/ollama";
import { AIMessage, BaseMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatResult } from "@langchain/core/outputs";
import { Message } from "ollama";

export class CustomChatOllama extends ChatOllama {
    async _generate(
        messages: BaseMessage[],
        options: this["ParsedCallOptions"],
        runManager?: any
    ): Promise<ChatResult> {
        // Prepare parameters
        const params = this.invocationParams(options);

        // Handle tools manually if the model doesn't support them (generic fix for small models)
        // We assume any usage of this class with tools implies we want this manual handling 
        // if the native call fails or if we strictly want to avoid the error.
        // For now, let's detect if tools are present and strip them from the API call, 
        // injecting them into the prompt instead.

        let ollamaMessages: Message[] = messages.map((msg) => {
            let role = 'user';
            const type = msg._getType();
            if (type === 'ai') role = 'assistant';
            else if (type === 'system') role = 'system';
            else if (type === 'tool') role = 'tool';

            return {
                role,
                content: msg.content as string,
            };
        });

        const tools = options.tools;
        // If tools are provided, we need to:
        // 1. Remove them from the params to avoid "does not support tools" error.
        // 2. Inject their schema into the System Prompt.
        // 3. Instruct the model to output JSON.

        if (tools && tools.length > 0) {
            // Remove tools from native params
            // @ts-ignore
            delete params.tools;

            // Constuct Tool Descriptions
            const toolDescriptions = tools.map((t: any) => {
                const func = t.function || t;
                // Simplified schema description for 1B model
                let paramsDesc = "No parameters";
                if (func.parameters && func.parameters.properties) {
                    paramsDesc = Object.entries(func.parameters.properties)
                        .map(([key, prop]: [string, any]) => {
                            return `- ${key} (${prop.type}): ${prop.description || ''}`;
                        }).join('\n');
                    if (func.parameters.required && func.parameters.required.length > 0) {
                        paramsDesc += `\nRequired: ${func.parameters.required.join(', ')}`;
                    }
                }
                return `Tool: ${func.name}\nDescription: ${func.description}\nParameters:\n${paramsDesc}`;
            }).join('\n\n');

            const toolSystemInstruction = `
You have access to the following tools:
${toolDescriptions}

To use a tool, you MUST respond with ONLY a valid JSON object in this format:
{
  "tool": "tool_name",
  "args": { 
      "arg_name": value 
  }
}

Examples:

1. Navigation:
- "Go to settings" -> { "tool": "navigateToScreen", "args": { "screen": "Settings" } }
- "Open history" -> { "tool": "navigateToScreen", "args": { "screen": "History" } }
- "Back to home" -> { "tool": "navigateToScreen", "args": { "screen": "Home" } }

2. Transactions:
- "Send $50 to Mom" -> { "tool": "sendMoney", "args": { "amount": 50, "recipient": "Mom" } }
- "Pay Mike 20 dollars" -> { "tool": "sendMoney", "args": { "amount": 20, "recipient": "Mike" } }
- "Transfer 100 to savings" -> { "tool": "sendMoney", "args": { "amount": 100, "recipient": "Savings" } }

3. History/Data:
- "Check my balance" -> { "tool": "checkBalance", "args": {} }
- "How much money do I have?" -> { "tool": "checkBalance", "args": {} }
- "Show recent transactions" -> { "tool": "getRecentTransactions", "args": { "limit": 5 } }
- "Show my last 3 expenses" -> { "tool": "getRecentTransactions", "args": { "limit": 3, "filter": "expense" } }
- "Have I received any money recently?" -> { "tool": "getRecentTransactions", "args": { "limit": 5, "filter": "income" } }

If no tool is needed, just respond with natural language.
`;

            // Inject into the last System message, or prepend a new one
            const systemMsgIndex = ollamaMessages.findIndex(m => m.role === 'system');
            if (systemMsgIndex >= 0) {
                ollamaMessages[systemMsgIndex].content += `\n\n${toolSystemInstruction}`;
            } else {
                ollamaMessages.unshift({
                    role: 'system',
                    content: toolSystemInstruction
                });
            }
        }

        // @ts-ignore - Accessing protected/private client
        const response = await this.client.chat({
            ...params,
            messages: ollamaMessages,
            stream: false, // Force non-streaming
        });

        let content = response.message.content;
        const toolCalls: any[] = [];

        // Attempt to parse JSON tool calls
        if (tools && tools.length > 0) {
            try {
                // Heuristic: Try to find JSON block if mixed with text
                const jsonMatch = content.match(/\{[\s\S]*\}/);
                const candidate = jsonMatch ? jsonMatch[0] : content;

                const parsed = JSON.parse(candidate);
                if (parsed.tool && parsed.args) {
                    toolCalls.push({
                        name: parsed.tool,
                        args: parsed.args,
                        id: `call_${Math.random().toString(36).substring(7)}`,
                        type: "tool_call"
                    });
                    // If successfully parsed as tool call, we might want to clear content or keep it?
                    // Usually tool calls usually have empty content in LangChain unless it's a "thought"
                    // But for now, let's keep content empty if it was a pure JSON tool call
                    if (candidate === content.trim()) {
                        content = "";
                    }
                }
            } catch (e) {
                // Not JSON, assume normal text response
            }
        }

        const aiMessage = new AIMessage({
            content: content,
            tool_calls: toolCalls,
            response_metadata: {
                model: response.model,
                created_at: response.created_at,
                done: response.done,
                done_reason: response.done_reason,
                total_duration: response.total_duration,
                load_duration: response.load_duration,
                prompt_eval_count: response.prompt_eval_count,
                prompt_eval_duration: response.prompt_eval_duration,
                eval_count: response.eval_count,
                eval_duration: response.eval_duration,
            },
            usage_metadata: {
                input_tokens: response.prompt_eval_count ?? 0,
                output_tokens: response.eval_count ?? 0,
                total_tokens: (response.prompt_eval_count ?? 0) + (response.eval_count ?? 0),
            },
        });

        return {
            generations: [
                {
                    text: content,
                    message: aiMessage,
                },
            ],
        };
    }
}
