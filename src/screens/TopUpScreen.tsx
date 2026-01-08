import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, ScrollView, Alert } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { TransactionContext } from '../context/TransactionContext';
import BottomNavigation from '../components/BottomNavigation';

const TopUpScreen = () => {
    const navigation = useNavigation();
    const [amount, setAmount] = useState('');
    const context = useContext(TransactionContext);

    const handleConfirm = () => {
        const numAmount = parseFloat(amount || '0');
        if (numAmount <= 0) {
            Alert.alert('Error', 'Please enter a valid amount');
            return;
        }

        if (context) {
            const newTransaction = {
                id: Date.now().toString(),
                title: 'Wallet Top Up',
                category: 'Top Up',
                date: 'Just now',
                amount: `+$${amount}`,
                type: 'income' as const,
                icon: 'wallet-plus',
                iconColor: '#4CAF50',
                iconBg: '#E8F5E9'
            };
            context.addTransaction(newTransaction);
            context.updateBalance(numAmount);
        }
        navigation.navigate('Success' as never, { amount: amount, contact: { name: 'My Wallet' } } as never);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialIcon name="chevron-left" size={32} color="#666" />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Top Up Wallet</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.amountContainer}>
                    <Text style={styles.currencySymbol}>$</Text>
                    <TextInput
                        style={styles.amountInput}
                        value={amount}
                        onChangeText={setAmount}
                        placeholder="0"
                        placeholderTextColor="#E0E0E0"
                        keyboardType="numeric"
                        autoFocus
                    />
                    <View style={styles.amountControls}>
                        <TouchableOpacity onPress={() => {
                            const current = parseFloat(amount || '0');
                            setAmount((current + 1).toFixed(0));
                        }}>
                            <MaterialIcon name="arrow-drop-up" size={24} color="#999" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            const current = parseFloat(amount || '0');
                            const newVal = Math.max(0, current - 1);
                            setAmount(newVal > 0 ? newVal.toFixed(0) : '');
                        }}>
                            <MaterialIcon name="arrow-drop-down" size={24} color="#999" />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleConfirm}
                >
                    <Text style={styles.confirmButtonText}>Confirm Top Up</Text>
                </TouchableOpacity>

            </ScrollView>

            <BottomNavigation activeTab="Wallet" />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        marginBottom: 40,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: -8,
        marginRight: 20,
    },
    backText: {
        fontSize: 16,
        color: '#666',
        marginLeft: -4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#4CAF50', // Green for income/topup
        borderRadius: 4,
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: '100%',
        marginBottom: 30,
        height: 70,
    },
    currencySymbol: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#E0E0E0',
        marginRight: 5,
    },
    amountInput: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        padding: 0,
    },
    amountControls: {
        position: 'absolute',
        right: 5,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
    },
    confirmButton: {
        width: '100%',
        backgroundColor: '#4CAF50', // Green
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    confirmButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default TopUpScreen;
