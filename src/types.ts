export interface AgentResponse {
    text: string;
    source: 'Gemini' | 'Ollama' | 'Orchestrator';
    status: 'complete' | 'incomplete' | 'needs_info';
    action?: {
        type: 'NAVIGATE' | 'TRANSACTION';
        payload: any;
    };
}

export interface Message {
    id: string;
    text: string;
    sender: 'user' | 'agent';
}

export interface AgentContext {
    navigation: any;
    transactionContext: any;
    userContext: any;
    addLog?: (log: string) => void;
    setActiveNode?: (node: string | null) => void;
    setLastAgentResponse?: (response: any) => void;
}
