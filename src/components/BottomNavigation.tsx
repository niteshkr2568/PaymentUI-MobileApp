import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import FinAIAssistant from './FinAIAssistant';

interface BottomNavigationProps {
    activeTab: 'Home' | 'Wallet' | 'History' | 'Profile' | 'SendDiff' | string;
    openAgentOnMount?: boolean;
}

const BottomNavigation = ({ activeTab, openAgentOnMount = false }: BottomNavigationProps) => {
    const navigation = useNavigation();
    const [isAgentVisible, setIsAgentVisible] = useState(openAgentOnMount);

    const tabs = [
        { name: 'Dashboard', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
        { name: 'Wallet', label: 'Wallet', icon: 'wallet-outline', activeIcon: 'wallet' },
        // FAB is handled separately in render
        { name: 'History', label: 'History', icon: 'clock-outline', activeIcon: 'clock' },
        { name: 'Profile', label: 'Profile', icon: 'account-outline', activeIcon: 'account' },
    ];

    const NavIcon = ({ name, label, icon, activeIcon, target }: { name: string, label: string, icon: string, activeIcon: string, target: string }) => {
        const isActive = activeTab === label;
        return (
            <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate(target as never)}>
                <Icon name={isActive ? activeIcon : icon} size={24} color={isActive ? '#6200EE' : '#999'} />
                <Text style={[styles.navLabel, { color: isActive ? '#6200EE' : '#999' }]}>{label}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.bottomNav}>
            <NavIcon name="Home" label="Home" icon="home-outline" activeIcon="home" target="Dashboard" />
            <NavIcon name="Wallet" label="Wallet" icon="wallet-outline" activeIcon="wallet" target="Wallet" />

            {/* Center FAB */}
            <View style={styles.fabContainer}>
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => {
                        if (activeTab === 'SendDiff') {
                            setIsAgentVisible(true);
                        } else {
                            navigation.navigate('SendMoney' as never, { openAgent: true } as never);
                        }
                    }}
                >
                    <Icon name="send-outline" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <NavIcon name="History" label="History" icon="clock-outline" activeIcon="clock" target="History" />
            <NavIcon name="Profile" label="Profile" icon="account-outline" activeIcon="account" target="Profile" />

            <FinAIAssistant visible={isAgentVisible} onClose={() => setIsAgentVisible(false)} />
        </View>
    );
};

const styles = StyleSheet.create({
    bottomNav: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        paddingBottom: 20,
        borderTopWidth: 1,
        borderTopColor: '#f1f1f1',
    },
    navItem: {
        alignItems: 'center',
    },
    navLabel: {
        fontSize: 10,
        marginTop: 4,
    },
    fabContainer: {
        marginTop: -40,
    },
    fab: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#6200EE',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#6200EE',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    }
});

export default BottomNavigation;
