import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import { UserContext } from '../context/UserContext';
import BottomNavigation from '../components/BottomNavigation';

const { width } = Dimensions.get('window');

const DashboardScreen = () => {
    const navigation = useNavigation();
    const context = useContext(TransactionContext);
    const userContext = useContext(UserContext);
    const { user } = userContext || { user: { name: 'User', avatar: '', email: '' } }; // Fallback

    const [isBalanceVisible, setIsBalanceVisible] = useState(true);

    // Fallback if context is missing (though it shouldn't be due to App.tsx wrapper)
    const { transactions, balance } = context || { transactions: [], balance: 0 };

    const safeBalance = typeof balance === 'number' && !isNaN(balance) ? balance : 0;
    const formattedBalance = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(safeBalance);

    const { totalIncome, totalExpense } = React.useMemo(() => {
        if (!transactions) return { totalIncome: 0, totalExpense: 0 };
        return transactions.reduce(
            (acc, curr) => {
                if (!curr.amount) return acc;
                // Remove everything except numbers and dots
                const cleanAmount = curr.amount.replace(/[^0-9.]/g, '');
                const val = parseFloat(cleanAmount);

                // Safety check for NaN
                if (isNaN(val)) return acc;

                if (curr.type === 'income') {
                    acc.totalIncome += val;
                } else {
                    acc.totalExpense += val;
                }
                return acc;
            },
            { totalIncome: 0, totalExpense: 0 }
        );
    }, [transactions]);

    const formatCurrency = (amount: number) => {
        if (typeof amount !== 'number' || isNaN(amount)) return '$0';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 2,
        }).format(amount);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.userInfo}>
                        <Image
                            source={typeof user.avatar === 'string' ? { uri: user.avatar } : user.avatar}
                            style={styles.avatar}
                        />
                        <View>
                            <Text style={styles.greeting}>Welcome back,</Text>
                            <Text style={styles.userName}>{user.name}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.bellButton}>
                        <MaterialIcon name="notifications-none" size={24} color="#333" />
                    </TouchableOpacity>
                </View>

                {/* Balance Card - Refined Gradient Logic handled by style */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View>
                            <Text style={styles.cardLabel}>Total Balance</Text>
                            <Text style={styles.balanceAmount}>
                                {isBalanceVisible ? formattedBalance : '••••••••'}
                            </Text>
                        </View>
                        <View style={styles.cardIconContainer}>
                            <MaterialIcon name="credit-card" size={24} color="#fff" />
                        </View>
                    </View>

                    <View style={styles.cardActions}>
                        <TouchableOpacity style={styles.transferBtn} onPress={() => navigation.navigate('SendMoney' as never)}>
                            <Icon name="send" size={16} color="#fff" />
                            <Text style={styles.btnText}>Transfer</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.historyBtn} onPress={() => navigation.navigate('History' as never)}>
                            <Icon name="history" size={16} color="#fff" />
                            <Text style={styles.btnText}>History</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Income & Expense */}
                <View style={styles.statsContainer}>
                    <View style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
                        <View style={[styles.statIcon, { backgroundColor: '#C8E6C9' }]}>
                            <Icon name="arrow-bottom-left" size={20} color="#2E7D32" />
                        </View>
                        <Text style={[styles.statLabel, { color: '#2E7D32' }]}>Income</Text>
                        <Text style={styles.statAmount}>+{formatCurrency(totalIncome)}</Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: '#FFEBEE' }]}>
                        <View style={[styles.statIcon, { backgroundColor: '#FFCDD2' }]}>
                            <Icon name="arrow-top-right" size={20} color="#C62828" />
                        </View>
                        <Text style={[styles.statLabel, { color: '#C62828' }]}>Expense</Text>
                        <Text style={styles.statAmount}>-{formatCurrency(totalExpense)}</Text>
                    </View>
                </View>

                {/* Transactions */}
                <View style={styles.transactionsHeader}>
                    <Text style={styles.sectionTitle}>Recent Activity</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('History' as never)}>
                        <Text style={styles.seeAllText}>See All</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.transactionList}>
                    {transactions.slice(0, 5).map((item, index) => (
                        <View key={item.id} style={styles.transactionItem}>
                            <View style={[styles.transactionIcon, { backgroundColor: item.iconBg || '#F5F5F5' }]}>
                                <Icon name={item.icon} size={24} color={item.iconColor || '#333'} />
                            </View>
                            <View style={styles.transactionDetails}>
                                <Text style={styles.transactionTitle}>{item.title}</Text>
                                <Text style={styles.transactionCategory}>{item.category}</Text>
                            </View>
                            <View style={styles.transactionRight}>
                                <Text style={[styles.transactionAmount, { color: item.type === 'income' ? '#2E7D32' : '#333' }]}>
                                    {item.amount}
                                </Text>
                                <Text style={styles.transactionDate}>{item.date}</Text>
                            </View>
                        </View>
                    ))}
                </View>

            </ScrollView>

            {/* Content End */}
            <BottomNavigation activeTab="Home" />
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContent: {
        paddingBottom: 100,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        marginBottom: 20,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        backgroundColor: '#ddd',
    },
    greeting: {
        fontSize: 12,
        color: '#666',
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    bellButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#6200EE',
        borderRadius: 24,
        marginHorizontal: 20,
        padding: 24,
        shadowColor: '#6200EE',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        marginBottom: 25,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    cardLabel: {
        color: '#E0E0E0',
        fontSize: 14,
    },
    cardIconContainer: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 8,
        borderRadius: 10
    },
    balanceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
    },
    balanceAmount: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12
    },
    transferBtn: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.2)', // Glass effect
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8
    },
    historyBtn: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.1)',
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8
    },
    btnText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 25,
    },
    statCard: {
        flex: 0.47,
        padding: 16,
        borderRadius: 20,
    },
    statIcon: {
        width: 32,
        height: 32,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 4,
    },
    statAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    transactionsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    seeAllText: {
        color: '#6200EE',
        fontWeight: '600',
    },
    transactionList: {
        paddingHorizontal: 20,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    transactionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    transactionDetails: {
        flex: 1,
    },
    transactionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    transactionCategory: {
        fontSize: 12,
        color: '#999',
    },
    transactionRight: {
        alignItems: 'flex-end',
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    transactionDate: {
        fontSize: 11,
        color: '#999',
    },
});

export default DashboardScreen;
