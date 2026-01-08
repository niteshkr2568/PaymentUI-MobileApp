import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import BottomNavigation from '../components/BottomNavigation';

const { width } = Dimensions.get('window');

const WalletScreen = () => {
    const navigation = useNavigation();
    const [isFrozen, setIsFrozen] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Cards</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Card Carousel */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.carouselContent}
                    decelerationRate="fast"
                    snapToInterval={width * 0.85 + 20}
                >
                    {/* Primary Dark Card */}
                    <View style={styles.cardContainer}>
                        <View style={styles.card}>
                            <View style={styles.cardTop}>
                                <Text style={styles.cardBrand}>VISA</Text>
                                <Text style={styles.cardType}>DEBIT</Text>
                            </View>

                            <View style={styles.cardBalanceContainer}>
                                <Text style={styles.cardBalanceLabel}>Card Balance</Text>
                                <Text style={styles.cardBalance}>$12,450.75</Text>
                            </View>

                            <View style={styles.cardBottom}>
                                <Text style={styles.cardNumber}>**** 8892</Text>
                                <Text style={styles.cardExpiry}>12/26</Text>
                            </View>

                            {/* Decorative Circle */}
                            <View style={styles.decorativeCircle} />
                        </View>
                    </View>

                    {/* Secondary Purple Card relative to the first one */}
                    <View style={styles.cardContainer}>
                        <View style={[styles.card, styles.purpleCard]}>
                            <View style={styles.cardTop}>
                                {/* Master Card Circles */}
                                <View style={styles.masterCardLogo}>
                                    <View style={[styles.mcCircle, { backgroundColor: '#EB001B', left: 0 }]} />
                                    <View style={[styles.mcCircle, { backgroundColor: '#F79E1B', left: 20 }]} />
                                </View>
                                <Text style={styles.cardType}>CREDIT</Text>
                            </View>

                            <View style={styles.cardBalanceContainer}>
                                <Text style={[styles.cardBalanceLabel, { color: 'rgba(255,255,255,0.8)' }]}>Available Limit</Text>
                                <Text style={styles.cardBalance}>$4,500.00</Text>
                            </View>

                            <View style={styles.cardBottom}>
                                <Text style={styles.cardNumber}>**** 4211</Text>
                                <Text style={styles.cardExpiry}>09/25</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>


                {/* Card Settings Header */}
                <View style={styles.settingsContainer}>
                    <Text style={styles.sectionHeader}>CARD SETTINGS</Text>

                    <View style={styles.settingsCard}>
                        {/* Security Center */}
                        <TouchableOpacity style={styles.settingItem}>
                            <View style={[styles.iconBox, { backgroundColor: '#E8EAF6' }]}>
                                <Icon name="shield-check" size={24} color="#3F51B5" />
                            </View>
                            <View style={styles.settingContent}>
                                <Text style={styles.settingTitle}>Security Center</Text>
                                <Text style={styles.settingSubtitle}>Manage your card security</Text>
                            </View>
                            <MaterialIcon name="chevron-right" size={24} color="#ccc" />
                        </TouchableOpacity>

                        {/* Add to Apple Wallet */}
                        <TouchableOpacity style={styles.settingItem}>
                            <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
                                <Icon name="cellphone" size={24} color="#2196F3" />
                            </View>
                            <View style={styles.settingContent}>
                                <Text style={styles.settingTitle}>Add to Apple Wallet</Text>
                                <Text style={styles.settingSubtitle}>Pay with your phone</Text>
                            </View>
                            <MaterialIcon name="chevron-right" size={24} color="#ccc" />
                        </TouchableOpacity>

                        {/* Freeze Card - Custom Item with Switch */}
                        <View style={[styles.settingItem, styles.lastItem]}>
                            <View style={[styles.iconBox, { backgroundColor: '#F3E5F5' }]}>
                                <Icon name="login" size={24} color="#7B1FA2" style={{ transform: [{ rotate: '180deg' }] }} />
                                {/* Login icon rotated looks like logout/freeze somewhat, finding better match */}
                                {/* Using logout variant or login rotated for 'arrow out' look */}
                            </View>
                            <View style={styles.settingContent}>
                                <Text style={styles.settingTitle}>Freeze Card</Text>
                                <Text style={styles.settingSubtitle}>Temporarily disable this card</Text>
                            </View>
                            <Switch
                                trackColor={{ false: "#E0E0E0", true: "#C8E6C9" }}
                                thumbColor={isFrozen ? "#4CAF50" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() => setIsFrozen(!isFrozen)}
                                value={isFrozen}
                            />
                        </View>
                    </View>
                </View>

            </ScrollView>

            <BottomNavigation activeTab="Wallet" />
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
        backgroundColor: '#F7F9FC',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    scrollContent: {
        paddingBottom: 100,
    },
    carouselContent: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    cardContainer: {
        width: width * 0.85,
        marginRight: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    card: {
        backgroundColor: '#111827', // Dark navy/black
        borderRadius: 24,
        padding: 24,
        height: 220,
        justifyContent: 'space-between',
        overflow: 'hidden',
        position: 'relative',
    },
    purpleCard: {
        backgroundColor: '#D04BF6', // Lighter purple to match design
    },
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardBrand: {
        color: '#fff',
        fontSize: 20,
        fontStyle: 'italic',
        fontWeight: 'bold',
    },
    cardType: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        letterSpacing: 1,
    },
    cardBalanceContainer: {
        marginTop: 10,
    },
    cardBalanceLabel: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
        marginBottom: 5,
    },
    cardBalance: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
    },
    cardBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    cardNumber: {
        color: '#fff',
        fontSize: 18,
        letterSpacing: 2,
    },
    cardExpiry: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
    },
    decorativeCircle: {
        position: 'absolute',
        top: -50,
        right: -50,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    masterCardLogo: {
        width: 44,
        height: 28, // approx
        position: 'relative',
    },
    mcCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        position: 'absolute',
        opacity: 0.8,
    },
    settingsContainer: {
        paddingHorizontal: 20,
    },
    sectionHeader: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#999',
        marginBottom: 15,
        letterSpacing: 1,
        textTransform: 'uppercase',
    },
    settingsCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
    },
    lastItem: {
        borderBottomWidth: 0,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    settingContent: {
        flex: 1,
    },
    settingTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    settingSubtitle: {
        fontSize: 13,
        color: '#888',
    },
});

export default WalletScreen;
