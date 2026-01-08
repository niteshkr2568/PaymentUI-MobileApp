import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/dist/prebuilt/index";
import { ChatOllama } from "@langchain/ollama";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { createTools } from "./tools";

// Define the state
const State = MessagesAnnotation;

export const createAgentGraph = (context: any) => {
    // 1. Create Tools
    const tools = createTools(context);

    // Split tools for specific agents
    const navigationTools = tools.filter(t => t.name.includes('navigate'));
    const transactionTools = tools.filter(t => t.name.includes('sendMoney'));
    const historyTools = tools.filter(t => t.name.includes('checkBalance') || t.name.includes('getRecentTransactions'));

    // 2. Models (Ollama)
    // We can use the same model instance or different ones.

    // START_CONFIG
    // Generic Network: "http://localhost:11434" (iOS Simulator / Desktop Only)
    // Android Emulator: "http://10.0.2.2:11434" (Loopback to Host)
    // Physical Device: "http://<YOUR_PC_IP>:11434" (REQUIRED for Real Device, e.g. "http://192.168.1.5:11434")
    // CHECK YOUR PC IP with `ifconfig` (Mac/Linux) or `ipconfig` (Windows)
    const OLLAMA_BASE_URL = "http://192.168.1.5:11434"; // Auto-detected LAN IP
    // END_CONFIG

    const model = new ChatOllama({
        model: "gemma3:1b", // User asked to use Ollama
        baseUrl: OLLAMA_BASE_URL,
        temperature: 0,
    });

    // 3. Nodes

    // --- Orchestrator Node ---
    // Decides which agent to call.
    const orchestratorNode = async (state: typeof State.State) => {
        const { messages } = state;
        const systemPrompt = new SystemMessage(
            "You are an Orchestrator. Your job is to classify the user's intent into one of the following categories: 'NAVIGATION', 'TRANSACTION', 'HISTORY', or 'GENERAL'.\n" +
            "Do not answer the user's question directly. Just output the category name."
        );

        // We only want the last message for classification, plus maybe context?
        // For simplicity, just send the full history + system prompt.
        const response = await model.invoke([systemPrompt, ...messages]);

        // We return a message, but we'll use the content in the conditional edge.
        // To avoid polluting the chat history with internal routing "thoughts", we might filter this.
        // But LangGraph expects state updates. Let's return a "routing" message.
        return { messages: [response] };
    };

    // --- Specialized Agents ---

    const runAgent = async (state: typeof State.State, agentTools: any[], systemPromptText: string) => {
        const { messages } = state;
        const toolNode = new ToolNode(agentTools);
        const agentModel = model.bindTools(agentTools);

        const systemMessage = new SystemMessage(systemPromptText);
        // Invoke model with system prompt + history
        const response = await agentModel.invoke([systemMessage, ...messages]);

        // Returns the response (which might include tool calls)
        return { messages: [response] };
    };

    const navigationAgent = (state: typeof State.State) =>
        runAgent(state, navigationTools, "You are a Navigation Agent. Help the user navigate using the available tools.");

    const transactionAgent = (state: typeof State.State) =>
        runAgent(state, transactionTools, "You are a Transaction Agent. Help the user send money using the available tools.");

    const historyAgent = (state: typeof State.State) =>
        runAgent(state, historyTools, "You are a History/Data Agent. Help the user check balance or transactions.");

    const generalAgent = async (state: typeof State.State) => {
        const { messages } = state;
        const response = await model.invoke([
            new SystemMessage("You are a helpful assistant. Answer the user's likely general question."),
            ...messages
        ]);
        return { messages: [response] };
    };

    // --- Tool Nodes ---
    // We can have a shared tool node or specific ones. 
    // Since we filtered tools, we can create a generic tool node that handles ALL tools, 
    // or specific ones. The ToolNode from prebuilt handles any tool call in the message.
    const toolNode = new ToolNode(tools);

    // 4. Edges

    const routerEdge = (state: typeof State.State) => {
        const { messages } = state;
        const lastMessage = messages[messages.length - 1];
        const content = (lastMessage.content as string).toUpperCase();

        if (content.includes('NAVIGATION')) return "navigation_agent";
        if (content.includes('TRANSACTION')) return "transaction_agent";
        if (content.includes('HISTORY') || content.includes('BALANCE')) return "history_agent";
        return "general_agent";
    };

    const shouldContinue = (state: typeof State.State) => {
        const { messages } = state;
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.tool_calls?.length) return "tools";
        return "__end__";
    };

    // 5. Build Graph
    const workflow = new StateGraph(State)
        .addNode("orchestrator", orchestratorNode)
        .addNode("navigation_agent", navigationAgent)
        .addNode("transaction_agent", transactionAgent)
        .addNode("history_agent", historyAgent)
        .addNode("general_agent", generalAgent)
        .addNode("tools", toolNode)

        .addEdge("__start__", "orchestrator")

        .addConditionalEdges("orchestrator", routerEdge, {
            navigation_agent: "navigation_agent",
            transaction_agent: "transaction_agent",
            history_agent: "history_agent",
            general_agent: "general_agent"
        })

        .addEdge("navigation_agent", "tools") // Simplified: Assume 1 tool call -> done? No, need loop.
        .addEdge("transaction_agent", "tools")
        .addEdge("history_agent", "tools")

        // After tools, we typically go back to the agent to summarize. 
        // But getting back to the *specific* agent requires remembering who called it.
        // For simplicity in this graph structure: 
        // Tools -> End (if tool output is enough) OR Tools -> General Agent to summarize?
        // Let's loop back to the *specific* agent? 
        // StateGraph doesn't easily store "sender". 
        // Let's allow Tools to go to __end__ for now, assuming the Tool output (string) is displayed?
        // Or better: Tools -> General Agent (to format result).
        .addEdge("tools", "__end__")

        .addEdge("general_agent", "__end__");

    // Fix: specialized agents should use conditional edge to determine if they need to call tools or end
    // But for this simple implementation, let's assume they *might* call tools.
    // We need a conditional edge from Agent -> Tools or End.
    // Redefining edges for agents:

    workflow.addConditionalEdges("navigation_agent", shouldContinue, { tools: "tools", __end__: "__end__" });
    workflow.addConditionalEdges("transaction_agent", shouldContinue, { tools: "tools", __end__: "__end__" });
    workflow.addConditionalEdges("history_agent", shouldContinue, { tools: "tools", __end__: "__end__" });

    // Compile
    return workflow.compile();
};
