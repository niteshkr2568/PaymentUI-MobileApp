import { ChatOllama } from "@langchain/ollama";

async function testConnection() {
    console.log("Testing Ollama connection on Host...");
    try {
        const model = new ChatOllama({
            model: "gemma3:1b",
            baseUrl: "http://localhost:11434",
            temperature: 0,
        });

        const response = await model.invoke("Hello, are you there?");
        console.log("Success! Response:", response.content);
    } catch (error) {
        console.error("Error connecting to Ollama:", error);
    }
}

testConnection();
