import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import BottomNavigation from '../components/BottomNavigation';

const SendMoneyScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { openAgent } = (route.params as any) || {};

    const quickContacts = [
        { id: '1', name: 'Sarah J.', initials: 'SJ', color: '#E1BEE7', textColor: '#8E24AA' },
        { id: '2', name: 'Mike T.', initials: 'MT', color: '#BBDEFB', textColor: '#1976D2' },
        { id: '3', name: 'Mom', initials: 'M', color: '#F8BBD0', textColor: '#C2185B' },
        { id: '4', name: 'Landlord', initials: 'L', color: '#C8E6C9', textColor: '#388E3C' },
        { id: '5', name: 'Gym', initials: 'G', color: '#FFE0B2', textColor: '#F57C00' },
    ];

    const recentRecipients = [
        { id: '1', name: 'Unsaved Number', detail: '*** 9928' },
        { id: '2', name: 'Unsaved Number', detail: '*** 9928' },
        { id: '3', name: 'Unsaved Number', detail: '*** 9928' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Send Money</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Icon name="magnify" size={20} color="#999" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Name, email, or tag"
                        placeholderTextColor="#999"
                    />
                </View>

                {/* Quick Contacts */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Contacts</Text>
                    <View style={styles.quickContactsGrid}>
                        {/* Add New Button */}
                        <TouchableOpacity style={styles.contactItem}>
                            <View style={styles.addContactCircle}>
                                <Icon name="plus" size={24} color="#999" />
                            </View>
                            <Text style={styles.contactName}>Add New</Text>
                        </TouchableOpacity>

                        {quickContacts.map(contact => (
                            <TouchableOpacity
                                key={contact.id}
                                style={styles.contactItem}
                                onPress={() => navigation.navigate('TransferAmount' as never, { contact } as never)}
                            >
                                <View style={[styles.contactCircle, { backgroundColor: contact.color }]}>
                                    <Text style={[styles.contactInitials, { color: contact.textColor }]}>{contact.initials}</Text>
                                </View>
                                <Text style={styles.contactName}>{contact.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Recent Recipients */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Recent Recipients</Text>
                    <View style={styles.recipientsList}>
                        {recentRecipients.map(recipient => (
                            <TouchableOpacity key={recipient.id} style={styles.recipientItem}>
                                <View style={styles.recipientAvatar}>
                                    {/* Placeholder grey circle */}
                                </View>
                                <View style={styles.recipientInfo}>
                                    <Text style={styles.recipientName}>{recipient.name}</Text>
                                    <Text style={styles.recipientDetail}>{recipient.detail}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>

            <BottomNavigation activeTab="SendDiff" openAgentOnMount={openAgent} />
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
        paddingTop: 20,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    scrollContent: {
        paddingBottom: 100,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        marginHorizontal: 20,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 30,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        padding: 0,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 20,
    },
    quickContactsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    contactItem: {
        alignItems: 'center',
        width: '25%', // 4 items per row approximately
        marginBottom: 20,
    },
    addContactCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    contactCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    contactInitials: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    contactName: {
        fontSize: 12,
        color: '#333',
        textAlign: 'center',
    },
    recipientsList: {

    },
    recipientItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    recipientAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#E0E0E0',
        marginRight: 16,
    },
    recipientInfo: {
        justifyContent: 'center',
    },
    recipientName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1A1A1A',
        marginBottom: 4,
    },
    recipientDetail: {
        fontSize: 14,
        color: '#999',
    },
});

export default SendMoneyScreen;
