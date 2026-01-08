import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { UserContext } from '../context/UserContext';
import BottomNavigation from '../components/BottomNavigation';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const { width } = Dimensions.get('window');

const ProfileScreen = () => {
    const navigation = useNavigation();
    const userContext = useContext(UserContext);
    const { user } = userContext || { user: { name: 'User', email: 'email@example.com', avatar: '' } };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Header Profile Section */}
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={typeof user.avatar === 'string' ? { uri: user.avatar } : user.avatar}
                            style={styles.avatar}
                        />
                    </View>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>

                    <View style={styles.badgeContainer}>
                        <View style={[styles.badge, styles.proBadge]}>
                            <Text style={styles.proBadgeText}>Pro Member</Text>
                        </View>
                        <View style={[styles.badge, styles.verifiedBadge]}>
                            <Text style={styles.verifiedBadgeText}>Verified</Text>
                        </View>
                    </View>
                </View>

                {/* Account Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>ACCOUNT</Text>
                    <View style={styles.sectionCard}>
                        <MenuItem label="Personal Info" onPress={() => { }} />
                        <MenuItem label="Bank Accounts" onPress={() => { }} />
                        <MenuItem label="Cards" onPress={() => { }} last />
                    </View>
                </View>

                {/* App Settings Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>APP SETTINGS</Text>
                    <View style={styles.sectionCard}>
                        <MenuItem label="Notifications" onPress={() => { }} />
                        <MenuItem label="Appearance" onPress={() => { }} />
                        <MenuItem label="Language" onPress={() => { }} />
                        <MenuItem label="Privacy & Security" onPress={() => { }} last />
                    </View>
                </View>

                {/* Support Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>SUPPORT</Text>
                    <View style={styles.sectionCard}>
                        <MenuItem label="Help Center" onPress={() => { }} />
                        <MenuItem label="Contact Us" onPress={() => { }} />
                        <MenuItem label="Log Out" onPress={() => { }} last textColor="#F44336" />
                    </View>
                </View>


            </ScrollView>

            <BottomNavigation activeTab="Profile" />
        </SafeAreaView>
    );
};

const MenuItem = ({ label, onPress, last, textColor }: { label: string, onPress: () => void, last?: boolean, textColor?: string }) => (
    <TouchableOpacity style={[styles.menuItem, last && styles.menuItemLast]} onPress={onPress}>
        <Text style={[styles.menuItemLabel, textColor ? { color: textColor } : null]}>{label}</Text>
        <MaterialIcon name="chevron-right" size={24} color="#ccc" />
    </TouchableOpacity>
);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC', // Slightly off-white background
    },
    scrollContent: {
        paddingBottom: 100,
    },
    header: {
        alignItems: 'center',
        paddingVertical: 30,
        backgroundColor: '#fff',
        marginBottom: 20,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        padding: 4,
        borderColor: '#6200EE',
        borderWidth: 2, // Approximate the circle in design
        marginBottom: 15,
        justifyContent: 'center',
        alignItems: 'center',
        // To achieve the double circle look better, we'd need nested views, but this is a simple approx
    },
    avatar: {
        width: 88,
        height: 88,
        borderRadius: 44,
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#222',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
        marginBottom: 15,
    },
    badgeContainer: {
        flexDirection: 'row',
    },
    badge: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
        marginHorizontal: 5,
    },
    proBadge: {
        backgroundColor: '#E8EAF6',
    },
    proBadgeText: {
        color: '#3F51B5',
        fontWeight: 'bold',
        fontSize: 12,
    },
    verifiedBadge: {
        backgroundColor: '#E8F5E9',
    },
    verifiedBadgeText: {
        color: '#2E7D32',
        fontWeight: 'bold',
        fontSize: 12,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    sectionHeader: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#999',
        marginBottom: 10,
        letterSpacing: 1,
    },
    sectionCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingHorizontal: 20,
        // Shadow/Elevation
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    menuItemLast: {
        borderBottomWidth: 0,
    },
    menuItemLabel: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
});

export default ProfileScreen;
