import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import PaymentScreen from './screens/PaymentScreen';
import DashboardScreen from './screens/DashboardScreen';
import SuccessScreen from './screens/SuccessScreen';
import ProfileScreen from './screens/ProfileScreen';
import WalletScreen from './screens/WalletScreen';
import HistoryScreen from './screens/HistoryScreen';
import SendMoneyScreen from './screens/SendMoneyScreen';
import TransferAmountScreen from './screens/TransferAmountScreen';
import TopUpScreen from './screens/TopUpScreen';
import SystemScreen from './screens/SystemScreen';
import { TransactionProvider } from './context/TransactionContext';
import { UserProvider } from './context/UserContext';
import { AgentProvider } from './context/AgentContext';
const Stack = createNativeStackNavigator();

function App(): JSX.Element {
    return (
        <PaperProvider>
            <UserProvider>
                <TransactionProvider>
                    <AgentProvider>
                        <NavigationContainer>
                            <Stack.Navigator initialRouteName="Dashboard" screenOptions={{ headerShown: false }}>
                                <Stack.Screen name="Dashboard" component={DashboardScreen} />
                                <Stack.Screen name="Payment" component={PaymentScreen} />
                                <Stack.Screen name="Success" component={SuccessScreen} />
                                <Stack.Screen name="Profile" component={ProfileScreen} />
                                <Stack.Screen name="Wallet" component={WalletScreen} />
                                <Stack.Screen name="History" component={HistoryScreen} />
                                <Stack.Screen name="SendMoney" component={SendMoneyScreen} />
                                <Stack.Screen name="TransferAmount" component={TransferAmountScreen} />
                                <Stack.Screen name="TopUp" component={TopUpScreen} />
                                <Stack.Screen name="System" component={SystemScreen} />
                            </Stack.Navigator>
                        </NavigationContainer>
                    </AgentProvider>
                </TransactionProvider>
            </UserProvider>
        </PaperProvider>
    );
}

export default App;
