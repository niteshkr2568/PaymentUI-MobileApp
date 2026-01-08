import React, { useState, useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import axios from 'axios';
import { TransactionContext } from '../context/TransactionContext';

const PaymentScreen = ({ navigation }: any) => {
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const context = useContext(TransactionContext);

    const handlePay = async () => {
        if (!recipient || !amount) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            Alert.alert('Error', 'Please enter a valid amount');
            return;
        }

        if (context && numAmount > context.balance) {
            Alert.alert('Error', 'Insufficient balance');
            return;
        }

        setLoading(true);
        try {
            // Deduct from balance locally
            if (context) {
                context.updateBalance(-parseFloat(amount));
            }

            // Connects to the agent backend mentioned in user history
            // Ensure the backend is running on port 3000 or 4000
            const response = await axios.post('http://localhost:3000/api/Agent/chat', {
                message: `Pay ${amount} to ${recipient}`,
                threadId: 'payment-session-' + Date.now(),
            });

            console.log('Payment Response:', response.data);
            navigation.navigate('Success', { data: response.data });
        } catch (error) {
            console.error(error);
            Alert.alert('Payment Failed', 'Network request failed. Check backend connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text variant="headlineMedium" style={styles.title}>
                Send Payment
            </Text>

            <TextInput
                label="Recipient"
                value={recipient}
                onChangeText={setRecipient}
                mode="outlined"
                style={styles.input}
            />

            <TextInput
                label="Amount"
                value={amount}
                onChangeText={setAmount}
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
                left={<TextInput.Affix text="$" />}
            />

            <Button
                mode="contained"
                onPress={handlePay}
                loading={loading}
                style={styles.button}
                contentStyle={styles.buttonContent}>
                Pay Now
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    input: {
        marginBottom: 15,
    },
    button: {
        marginTop: 10,
        borderRadius: 8,
    },
    buttonContent: {
        height: 50,
    },
});

export default PaymentScreen;
