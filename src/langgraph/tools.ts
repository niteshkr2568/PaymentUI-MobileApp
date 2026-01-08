import { tool } from "@langchain/core/tools";
import { z } from "zod";

// We'll pass the context in the 'config' or closure when creating tools
// For now, let's define the tool schemas and functions that expect the context to be passed in.

export const createTools = (context: any) => {
    const { transactionContext, navigation, addLog } = context;

    const checkBalance = tool(async () => {
        addLog?.("Checking balance...");
        const balance = transactionContext?.balance || 0;
        return `Current balance: $${balance.toFixed(2)}`;
    }, {
        name: "checkBalance",
        description: "Check the current account balance.",
        schema: z.object({})
    });

    const getRecentTransactions = tool(async ({ limit = 5, filter }) => {
        addLog?.("Fetching transactions...");
        const transactions = transactionContext?.transactions || [];
        let result = transactions;
        if (filter) {
            result = result.filter((t: any) => t.type === filter.toLowerCase());
        }
        return JSON.stringify(result.slice(0, limit));
    }, {
        name: "getRecentTransactions",
        description: "Get recent transactions from history.",
        schema: z.object({
            limit: z.number().optional().describe("Number of transactions to return"),
            filter: z.enum(['income', 'expense']).optional().describe("Filter by transaction type")
        })
    });

    const sendMoney = tool(async ({ amount, recipient }) => {
        addLog?.(`Sending $${amount} to ${recipient}...`);

        // Validation
        const currentBalance = transactionContext?.balance || 0;
        if (amount > currentBalance) {
            return `Failed: Insufficient funds. Current balance is $${currentBalance}.`;
        }

        // Execute
        transactionContext?.updateBalance(-amount);
        transactionContext?.addTransaction({
            id: Date.now().toString(),
            title: `Transfer to ${recipient}`,
            category: 'Transfer',
            date: 'Just now',
            amount: `-$${amount.toFixed(2)}`,
            type: 'expense',
            icon: 'bank-transfer',
            iconColor: '#6200EE',
            iconBg: '#F3E5F5'
        });

        return `Successfully sent $${amount} to ${recipient}. New balance is $${(currentBalance - amount).toFixed(2)}.`;
    }, {
        name: "sendMoney",
        description: "Send money to a recipient.",
        schema: z.object({
            amount: z.number().describe("The amount of money to send"),
            recipient: z.string().describe("The name of the recipient")
        })
    });

    const navigateToScreen = tool(async ({ screen }) => {
        addLog?.(`Navigating to ${screen}...`);
        try {
            // Mapping for safety
            const routeMap: Record<string, string> = {
                'home': 'Dashboard',
                'dashboard': 'Dashboard',
                'history': 'History',
                'wallet': 'Wallet',
                'profile': 'Profile',
                'settings': 'Profile', // Settings is likely in Profile
                'send': 'SendMoney'
            };

            const target = routeMap[screen.toLowerCase()] || screen;
            navigation.navigate(target);
            return `Navigated to ${target}.`;
        } catch (error) {
            return `Failed to navigate to ${screen}.`;
        }
    }, {
        name: "navigateToScreen",
        description: "Navigate to a specific screen in the app.",
        schema: z.object({
            screen: z.string().describe("The name of the screen to navigate to (e.g., Home, History, Profile)")
        })
    });

    return [checkBalance, getRecentTransactions, sendMoney, navigateToScreen];
};
