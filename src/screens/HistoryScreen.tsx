import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import { AgentContext } from '../context/AgentContext';
import { AgentGateway } from '../services/AgentGateway';
import BottomNavigation from '../components/BottomNavigation';
import { ActivityIndicator } from 'react-native-paper';

const HistoryScreen = () => {
    const navigation = useNavigation();
    const [filter, setFilter] = useState('All');

    const context = useContext(TransactionContext);
    const agentContext = useContext(AgentContext); // Inject Agent Context

    // Fallback hooks if AgentProvider is missing (shouldn't happen)
    const { addLog, setActiveNode, setLastAgentResponse } = agentContext || {
        addLog: () => { }, setActiveNode: () => { }, setLastAgentResponse: () => { }
    };

    const [insight, setInsight] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    if (!context) {
        return null; // Or loading state
    }

    const { transactions } = context;

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        setInsight(null);

        // Use the Gateway to process 'Analyze my spending'
        // This will trigger the Orchestrator -> GeminiInsightsAgent flow
        try {
            const agentCtx = {
                navigation,
                transactionContext: context,
                addLog,
                setActiveNode,
                setLastAgentResponse
            };

            // Send request
            const response = await AgentGateway.processRequest('Analyze my spending', agentCtx);

            setInsight(response.text);
        } catch (e) {
            console.error(e);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const filteredTransactions = transactions.filter(t => {
        if (filter === 'All') return true;
        if (filter === 'Income') return t.type === 'income';
        if (filter === 'Expense') return t.type === 'expense';
        return true;
    });

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.transactionCard}>
            <View style={[styles.iconContainer, { backgroundColor: item.iconBg }]}>
                <Icon name={item.icon} size={24} color={item.iconColor} />
            </View>
            <View style={styles.detailsContainer}>
                <View style={styles.topRow}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={[styles.amount, item.type === 'income' ? styles.incomeText : styles.expenseText]}>
                        {item.amount}
                    </Text>
                </View>
                <View style={styles.bottomRow}>
                    <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>{item.category}</Text>
                    </View>
                    <Text style={styles.date}>{item.date}</Text>
                </View>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Activity</Text>
            </View>

            {/* Smart Insights (Gemini) */}
            <View style={styles.geminiContainer}>
                <View style={styles.geminiHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Icon name="sparkles" size={16} color="#7C3AED" />
                        <Text style={styles.geminiTitle}>Smart Insights</Text>
                    </View>
                    <TouchableOpacity style={styles.analyzeBtn} onPress={handleAnalyze} disabled={isAnalyzing}>
                        <Text style={styles.analyzeText}>{isAnalyzing ? 'Thinking...' : 'Analyze Spending'}</Text>
                    </TouchableOpacity>
                </View>

                {isAnalyzing && <ActivityIndicator size="small" color="#7C3AED" style={{ marginVertical: 10 }} />}

                {insight ? (
                    <Text style={styles.geminiText}>{insight}</Text>
                ) : (
                    !isAnalyzing && (
                        <Text style={styles.geminiPlaceholder}>
                            Tap analyze to get AI-powered savings tips based on your data.
                        </Text>
                    )
                )}
            </View>

            {/* Filters */}
            <View style={styles.filterContainer}>
                <TouchableOpacity
                    style={[styles.filterChip, filter === 'All' && styles.activeFilterChip]}
                    onPress={() => setFilter('All')}
                >
                    <Text style={[styles.filterText, filter === 'All' && styles.activeFilterText]}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterChip, filter === 'Income' && styles.activeFilterChip]}
                    onPress={() => setFilter('Income')}
                >
                    <Text style={[styles.filterText, filter === 'Income' && styles.activeFilterText]}>Income</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterChip, filter === 'Expense' && styles.activeFilterChip]}
                    onPress={() => setFilter('Expense')}
                >
                    <Text style={[styles.filterText, filter === 'Expense' && styles.activeFilterText]}>Expense</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={filteredTransactions}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />

            <BottomNavigation activeTab="History" />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    filterChip: {
        paddingVertical: 8,
        paddingHorizontal: 24,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginRight: 10,
        backgroundColor: '#fff',
    },
    activeFilterChip: {
        backgroundColor: '#6200EE',
        borderColor: '#6200EE',
    },
    filterText: {
        color: '#666',
        fontWeight: '600',
    },
    activeFilterText: {
        color: '#fff',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    transactionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 16,
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    geminiContainer: {
        marginHorizontal: 20,
        marginBottom: 20,
        backgroundColor: '#F3E8FF', // Light purple
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E9D5FF'
    },
    geminiHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8
    },
    geminiTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#5B21B6'
    },
    analyzeBtn: {
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        shadowColor: '#7C3AED',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2
    },
    analyzeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#7C3AED'
    },
    geminiPlaceholder: {
        fontSize: 12,
        color: '#7C3AED',
        fontStyle: 'italic'
    },
    geminiText: {
        fontSize: 13,
        color: '#4C1D95',
        lineHeight: 18
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    detailsContainer: {
        flex: 1,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'space-between', // Design shows Date next to category? No, Date seems aligned but usually space-between or just generic row
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    amount: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    incomeText: {
        color: '#00C853',
    },
    expenseText: {
        color: '#1A1A1A', // Design shows standard text color for expense usually, or red. Image shows black/dark.
    },
    categoryBadge: {
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginRight: 10,
    },
    categoryText: {
        fontSize: 12,
        color: '#666',
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    date: {
        fontSize: 12,
        color: '#999',
    },
});

export default HistoryScreen;
