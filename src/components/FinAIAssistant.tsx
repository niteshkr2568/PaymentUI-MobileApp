import React, { useState, useRef, useEffect, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Modal,
    Animated,
    Dimensions,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { AgentGateway } from '../services/AgentGateway';
import { TransactionContext } from '../context/TransactionContext';
import { UserContext } from '../context/UserContext';
import { AgentContext, Message } from '../context/AgentContext';

interface FinAIAssistantProps {
    visible: boolean;
    onClose: () => void;
}

const FinAIAssistant = ({ visible, onClose }: FinAIAssistantProps) => {
    const navigation = useNavigation();
    const transactionContext = useContext(TransactionContext);
    const userContext = useContext(UserContext);
    const agentContext = useContext(AgentContext);

    const {
        messages,
        addMessage,
        clearMessages,
        addLog,
        setActiveNode,
        setLastAgentResponse
    } = agentContext || {
        messages: [],
        addMessage: () => { },
        clearMessages: () => { },
        addLog: () => { },
        setActiveNode: () => { },
        setLastAgentResponse: () => { }
    };

    const [inputText, setInputText] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const handleClearChat = () => {
        clearMessages();
    };

    const quickActions = [
        { label: '"Send $50 to Mom"', action: () => handleSendMoney() },
        { label: '"Show expense history"', action: () => handleNavigate('History') },
        { label: '"Clear chat"', action: () => handleClearChat() },
    ];

    useEffect(() => {
        if (visible) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), text: inputText, sender: 'user' };
        addMessage(userMsg);
        setInputText('');
        setIsThinking(true);

        try {
            const context = {
                navigation: navigation,
                transactionContext: transactionContext,
                userContext: userContext,
                addLog,
                setActiveNode,
                setLastAgentResponse
            };

            const response = await AgentGateway.processRequest(inputText, context);
            setIsThinking(false);

            const agentMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: response.text,
                sender: 'agent'
            };
            addMessage(agentMsg);

            if (response.action) {
                if (response.action.type === 'NAVIGATE') {
                    setTimeout(() => {
                        onClose();
                        (navigation as any).navigate(response.action?.payload.screen);
                    }, 1500);
                } else if (response.action.type === 'TRANSACTION' && response.action.payload.status === 'success') {
                    // Link to Success UI
                    setTimeout(() => {
                        onClose();
                        (navigation as any).navigate('Success', {
                            amount: response.action?.payload.amount.toFixed(2),
                            contact: { name: response.action?.payload.recipient }
                        });
                    }, 1500);
                }
            }

        } catch (error) {
            setIsThinking(false);
            const errorMsg: Message = { id: (Date.now() + 1).toString(), text: "Sorry, I had trouble processing that request.", sender: 'agent' };
            addMessage(errorMsg);
        }
    };

    const handleSendMoney = () => {
        const text = 'Send $50 to Mom';
        const userMsg: Message = { id: Date.now().toString(), text: text, sender: 'user' };
        addMessage(userMsg);

        setIsThinking(true);

        setTimeout(async () => {
            try {
                const context = {
                    navigation,
                    transactionContext,
                    userContext,
                    addLog,
                    setActiveNode,
                    setLastAgentResponse
                };
                const response = await AgentGateway.processRequest(text, context);
                setIsThinking(false);

                const agentMsg: Message = { id: (Date.now() + 1).toString(), text: response.text, sender: 'agent' };
                addMessage(agentMsg);

                if (response.action) {
                    if (response.action.type === 'TRANSACTION' && response.action.payload.status === 'success') {
                        // Link to Success UI
                        setTimeout(() => {
                            onClose();
                            (navigation as any).navigate('Success', {
                                amount: response.action?.payload.amount.toFixed(2),
                                contact: { name: response.action?.payload.recipient }
                            });
                        }, 1500);
                    }
                }
            } catch (error) {
                setIsThinking(false);
                const errorMsg: Message = { id: (Date.now() + 1).toString(), text: "Sorry, I had trouble processing that request.", sender: 'agent' };
                addMessage(errorMsg);
            }
        }, 500);
    };

    const handleNavigate = (screen: string) => {
        onClose();
        (navigation as any).navigate(screen);
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.overlay}
            >
                <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerIconContainer}>
                            <Icon name="server" size={20} color="#4285F4" />
                        </View>
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.headerTitle}>FinAI Assistant</Text>
                            <Text style={styles.headerSubtitle}>ONLINE (GEMINI)</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Icon name="close" size={20} color="#666" />
                        </TouchableOpacity>
                    </View>

                    {/* Chat Area */}
                    <ScrollView
                        style={styles.chatArea}
                        contentContainerStyle={styles.chatContent}
                        ref={scrollViewRef}
                        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                    >
                        {messages.map(msg => (
                            <View key={msg.id} style={[
                                styles.messageBubble,
                                msg.sender === 'user' ? styles.userBubble : styles.agentBubble
                            ]}>
                                <Text style={[
                                    styles.messageText,
                                    msg.sender === 'user' ? styles.userMessageText : styles.agentMessageText
                                ]}>{msg.text}</Text>
                            </View>
                        ))}
                        {isThinking && (
                            <View style={[styles.messageBubble, styles.agentBubble]}>
                                <Text style={[styles.messageText, styles.agentMessageText, { fontStyle: 'italic', color: '#666' }]}>
                                    Thinking...
                                </Text>
                            </View>
                        )}
                    </ScrollView>

                    {/* Input Area */}
                    <View style={styles.footer}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Ask me anything..."
                                placeholderTextColor="#999"
                                value={inputText}
                                onChangeText={setInputText}
                                onSubmitEditing={handleSend}
                            />
                            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                                <Icon name="send" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        {/* Quick Actions */}
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsContainer}>
                            {quickActions.map((action, index) => (
                                <TouchableOpacity key={index} style={styles.chip} onPress={action.action}>
                                    <Text style={styles.chipText}>{action.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </Animated.View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: '#F5F5F3',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: '60%', // Occupy bottom 60% of screen
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#E8F0FE', // Light blue bg for icon
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    headerTextContainer: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#202124',
    },
    headerSubtitle: {
        fontSize: 10,
        color: '#4285F4',
        fontWeight: '600',
    },
    closeButton: {
        padding: 5,
    },
    chatArea: {
        flex: 1,
        padding: 16,
    },
    chatContent: {
        paddingBottom: 20,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
        marginBottom: 12,
    },
    agentBubble: {
        backgroundColor: '#fff',
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 4,
    },
    userBubble: {
        backgroundColor: '#4285F4', // Google Blue
        alignSelf: 'flex-end',
        borderBottomRightRadius: 4,
    },
    messageText: {
        fontSize: 14,
        lineHeight: 20,
    },
    agentMessageText: {
        color: '#202124',
    },
    userMessageText: {
        color: '#fff',
    },
    footer: {
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#202124',
        padding: 0, // Reset default padding
    },
    sendButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#2962FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    chipsContainer: {
        flexDirection: 'row',
    },
    chip: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 8,
    },
    chipText: {
        fontSize: 12,
        color: '#5F6368',
    },
});

export default FinAIAssistant;
