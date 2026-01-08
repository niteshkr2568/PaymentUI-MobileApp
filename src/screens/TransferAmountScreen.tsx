import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';
import BottomNavigation from '../components/BottomNavigation';

const TransferAmountScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { contact } = route.params as { contact: any } || {};

    // Default to Sarah J. if no contact passed (for testing/default behaivour as per prompt)
    const recipient = contact || { name: 'Sarah J.', initials: 'SJ', color: '#E1BEE7', textColor: '#8E24AA' };

    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');

    const context = useContext(TransactionContext);

    const handleConfirm = () => {
        const numAmount = parseFloat(amount || '0');
        if (context && numAmount > context.balance) {
            Alert.alert('Error', 'Insufficient balance');
            return;
        }

        if (context) {
            const newTransaction = {
                id: Date.now().toString(),
                title: `Transfer to ${recipient.name}`,
                category: 'Transfer',
                date: 'Just now',
                amount: `-$${amount || '0.00'}`,
                type: 'expense' as const,
                icon: 'bank-transfer',
                iconColor: '#6200EE',
                iconBg: '#F3E5F5'
            };
            context.addTransaction(newTransaction);
            context.updateBalance(-parseFloat(amount || '0'));
        }
        navigation.navigate('Success' as never, { amount: amount || '0.00', contact: recipient } as never);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialIcon name="chevron-left" size={32} color="#666" />
                    <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.recipientContainer}>
                    <View style={[styles.avatar, { backgroundColor: recipient.color }]}>
                        <Text style={[styles.avatarText, { color: recipient.textColor }]}>{recipient.initials}</Text>
                    </View>
                    <Text style={styles.sendingToLabel}>Sending to</Text>
                    <Text style={styles.recipientName}>{recipient.name}</Text>
                </View>

                <View style={styles.amountContainer}>
                    <Text style={styles.currencySymbol}>$</Text>
                    <TextInput
                        style={styles.amountInput}
                        value={amount}
                        onChangeText={setAmount}
                        placeholder="0.00"
                        placeholderTextColor="#E0E0E0"
                        keyboardType="numeric"
                        autoFocus
                    />
                    {/* Arrows controls for mockup visual - functional in a real app these might increment/decrement */}
                    <View style={styles.amountControls}>
                        <TouchableOpacity onPress={() => {
                            const current = parseFloat(amount || '0');
                            setAmount((current + 1).toFixed(0)); // Increment by 1
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

                <View style={styles.noteContainer}>
                    <TextInput
                        style={styles.noteInput}
                        value={note}
                        onChangeText={setNote}
                        placeholder="Add a note (optional)"
                        placeholderTextColor="#999"
                    />
                </View>

                <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleConfirm}
                >
                    <Text style={styles.confirmButtonText}>Confirm Transfer</Text>
                </TouchableOpacity>

            </ScrollView>

            <BottomNavigation activeTab="SendDiff" />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: -8,
    },
    backText: {
        fontSize: 16,
        color: '#666',
        marginLeft: -4,
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    recipientContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    sendingToLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    recipientName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#3F51B5', // Blue border as per design
        borderRadius: 4, // Sharp corners/slight radius like design
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: '100%',
        marginBottom: 30,
        height: 70, // Fixed height specifically for the look
    },
    currencySymbol: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#E0E0E0', // Light grey for the dollar sign placeholder look
        marginRight: 5,
    },
    amountInput: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#333', // Or light grey if placeholder
        // width: 100, // flexible
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
    noteContainer: {
        width: '100%',
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        marginBottom: 30,
    },
    noteInput: {
        padding: 16,
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
    },
    confirmButton: {
        width: '100%',
        backgroundColor: '#536DFE', // Indigo/Purple
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#536DFE',
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

export default TransferAmountScreen;
