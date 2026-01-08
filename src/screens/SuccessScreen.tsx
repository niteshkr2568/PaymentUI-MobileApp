import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import BottomNavigation from '../components/BottomNavigation';

const SuccessScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { amount, contact } = route.params as { amount: string, contact: any } || {};

    // Defaults for testing if accessed directly
    const displayAmount = amount || '0.00';
    const recipientName = contact?.name || 'Sarah J.';

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>

                {/* Success Icon */}
                <View style={styles.successIconContainer}>
                    <Icon name="check" size={48} color="#00C853" />
                </View>

                {/* Title */}
                <Text style={styles.title}>Transfer Successful!</Text>

                {/* Subtitle */}
                <Text style={styles.subtitle}>
                    You sent <Text style={styles.boldText}>${displayAmount}</Text> to {recipientName}
                </Text>

                {/* Transaction Details Box */}
                <View style={styles.detailsBox}>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Ref ID</Text>
                        <Text style={styles.detailValue}>#TRX-66900</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Date</Text>
                        <Text style={styles.detailValue}>Just now</Text>
                    </View>
                </View>

                {/* Done Button */}
                <TouchableOpacity
                    style={styles.doneButton}
                    onPress={() => navigation.navigate('Dashboard' as never)}
                >
                    <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>

            </View>

            <BottomNavigation activeTab="Success" />
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 80, // Push content down
    },
    successIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#E8F5E9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 40,
    },
    boldText: {
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    detailsBox: {
        width: '100%',
        backgroundColor: '#F9F9F9',
        borderRadius: 12,
        padding: 20,
        marginBottom: 40,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    detailLabel: {
        fontSize: 14,
        color: '#999',
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    doneButton: {
        width: '100%',
        backgroundColor: '#111827', // Dark/Black button
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    doneButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default SuccessScreen;
