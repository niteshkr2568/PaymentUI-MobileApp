import React, { createContext, useState, ReactNode } from 'react';

export interface Transaction {
    id: string;
    title: string;
    category: string;
    date: string;
    amount: string;
    type: 'income' | 'expense';
    icon: string;
    iconColor: string;
    iconBg: string;
}

interface TransactionContextType {
    transactions: Transaction[];
    addTransaction: (transaction: Transaction) => void;
    balance: number;
    updateBalance: (amount: number) => void;
}

export const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider = ({ children }: { children: ReactNode }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([
        { id: '1', title: 'Netflix Subscription', category: 'Entertainment', date: 'Today, 10:23 AM', amount: '-$14.99', type: 'expense', icon: 'netflix', iconColor: '#E50914', iconBg: '#FFEBEE' },
        { id: '2', title: 'Salary Deposit', category: 'Salary', date: 'Yesterday, 9:00 AM', amount: '+$4500.00', type: 'income', icon: 'cash-check', iconColor: '#2E7D32', iconBg: '#E8F5E9' },
        { id: '3', title: 'Uber Eats', category: 'Food', date: 'Yesterday, 8:15 PM', amount: '-$24.50', type: 'expense', icon: 'food', iconColor: '#F57C00', iconBg: '#FFF3E0' },
        { id: '4', title: 'Apple Store', category: 'Electronics', date: 'Oct 24, 2:30 PM', amount: '-$999.00', type: 'expense', icon: 'cellphone', iconColor: '#000', iconBg: '#F5F5F5' },
        { id: '5', title: 'Transfer to Sarah', category: 'Transfer', date: 'Oct 22, 11:45 AM', amount: '-$150.00', type: 'expense', icon: 'bank-transfer', iconColor: '#6200EE', iconBg: '#F3E5F5' },
    ]);

    const [balance, setBalance] = useState(12450.75);

    const addTransaction = (transaction: Transaction) => {
        setTransactions(prev => [transaction, ...prev]);
    };

    const updateBalance = (amount: number) => {
        setBalance(prev => prev + amount);
    };

    return (
        <TransactionContext.Provider value={{ transactions, addTransaction, balance, updateBalance }}>
            {children}
        </TransactionContext.Provider>
    );
};
