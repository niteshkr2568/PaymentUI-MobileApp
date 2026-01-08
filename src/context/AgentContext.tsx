import React, { createContext, useState, ReactNode } from 'react';

export interface Message {
    id: string;
    text: string;
    sender: 'user' | 'agent';
}

export interface Log {
    time: string;
    text: string;
}

interface AgentContextType {
    messages: Message[];
    addMessage: (msg: Message) => void;
    clearMessages: () => void;
    // Visualization State
    agentLogs: Log[];
    addLog: (text: string) => void;
    activeNode: string | null;
    setActiveNode: (node: string | null) => void;
    lastAgentResponse: any;
    setLastAgentResponse: (response: any) => void;
}

export const AgentContext = createContext<AgentContextType | undefined>(undefined);

export const AgentProvider = ({ children }: { children: ReactNode }) => {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: 'Hello! I am FinAI, powered by Gemini. Ask me to send money, check spending, or navigate.', sender: 'agent' }
    ]);

    // Visualization State
    const [agentLogs, setAgentLogs] = useState<Log[]>([]);
    const [activeNode, setActiveNode] = useState<string | null>(null);
    const [lastAgentResponse, setLastAgentResponse] = useState<any>(null);

    const addMessage = (msg: Message) => {
        setMessages(prev => [...prev, msg]);
    };

    const clearMessages = () => {
        setMessages([
            { id: Date.now().toString(), text: 'Chat history cleared. How can I help you?', sender: 'agent' }
        ]);
        setAgentLogs([]);
        setActiveNode(null);
        setLastAgentResponse(null);
    };

    const addLog = (text: string) => {
        setAgentLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), text }]);
    };

    return (
        <AgentContext.Provider value={{
            messages,
            addMessage,
            clearMessages,
            agentLogs,
            addLog,
            activeNode,
            setActiveNode,
            lastAgentResponse,
            setLastAgentResponse
        }}>
            {children}
        </AgentContext.Provider>
    );
};
