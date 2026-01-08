import 'react-native-get-random-values';
import { AgentContext, AgentResponse } from '../types';
import { createAgentGraph } from '../langgraph';
import { HumanMessage } from '@langchain/core/messages';

class AgentGatewayService {
    private graph: any = null;

    async processRequest(input: string, context: AgentContext): Promise<AgentResponse> {
        // 1. Initialize Graph with Context
        // We recreate it to ensure context (navigation, state) is fresh
        this.graph = createAgentGraph(context);

        if (context.setActiveNode) context.setActiveNode('ui');
        if (context.addLog) context.addLog(`Frontend: Sending "${input}"`);

        try {
            // 2. Invoke Graph
            // Simulating Orchestrator Visualization
            if (context.setActiveNode) context.setActiveNode('orch');

            const result = await this.graph.invoke({
                messages: [new HumanMessage(input)],
            });

            const messages = result.messages;
            const lastMessage = messages[messages.length - 1];

            // Visualization Cleanup
            setTimeout(() => {
                if (context.setActiveNode) context.setActiveNode(null);
            }, 1000);

            // 3. Map Result
            return {
                text: lastMessage.content as string,
                source: 'Gemini', // or 'Ollama'
                status: 'complete'
            };

        } catch (error: any) {
            console.error("LangGraph Error:", error);
            if (context.addLog) context.addLog(`Error: ${error}`);

            const errorMessage = error.message || error.toString();
            return {
                text: `I'm having trouble connecting to the brain. Please ensure Ollama is running.\n\nDebug Info: ${errorMessage}`,
                source: 'Orchestrator',
                status: 'complete'
            };
        }
    }
}

export const AgentGateway = new AgentGatewayService();
