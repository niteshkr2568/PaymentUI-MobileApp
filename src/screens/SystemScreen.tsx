import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { AgentContext } from '../context/AgentContext';
import { PipelineVisualizer } from '../components/PipelineVisualizer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SystemScreen = () => {
    const context = useContext(AgentContext);
    const { agentLogs, lastAgentResponse, activeNode } = context || {};

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.headerTitle}>System Internals</Text>

            {/* Pipeline Visualizer */}
            <PipelineVisualizer />

            {/* Live Logs */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Icon name="console-line" size={18} color="#10B981" />
                    <Text style={styles.sectionTitle}>LIVE TRACE</Text>
                </View>
                <View style={styles.logsContainer}>
                    {agentLogs && agentLogs.length === 0 && (
                        <Text style={styles.logTextDim}>Waiting for input...</Text>
                    )}
                    {agentLogs && agentLogs.map((log, index) => (
                        <Text key={index} style={styles.logText}>
                            <Text style={styles.timestamp}>[{log.time}]</Text> {log.text}
                        </Text>
                    ))}
                </View>
            </View>

            {/* Last JSON Response */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Icon name="code-json" size={18} color="#60A5FA" />
                    <Text style={[styles.sectionTitle, { color: '#60A5FA' }]}>LAST AGENT RESPONSE</Text>
                </View>
                <View style={styles.jsonContainer}>
                    {lastAgentResponse ? (
                        <Text style={styles.jsonText}>
                            {JSON.stringify(lastAgentResponse, null, 2)}
                        </Text>
                    ) : (
                        <Text style={styles.logTextDim}>No agent interactions yet.</Text>
                    )}
                </View>
            </View>

            <View style={styles.infoSection}>
                <Text style={styles.infoTitle}>Architecture Info</Text>
                <Text style={styles.infoText}>
                    <Text style={{ color: '#A78BFA', fontWeight: 'bold' }}>Orchestrator:</Text> Powered by Gemini. Routes intents dynamically.
                </Text>
                <Text style={styles.infoText}>
                    <Text style={{ color: '#EF4444', fontWeight: 'bold' }}>Transaction Agent:</Text> Handles write operations with balance checks.
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        padding: 16
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 16
    },
    section: {
        marginBottom: 20
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#10B981',
        letterSpacing: 1
    },
    logsContainer: {
        backgroundColor: '#0F172A',
        padding: 12,
        borderRadius: 8,
        height: 150
    },
    logText: {
        color: '#E5E7EB',
        fontFamily: 'monospace',
        fontSize: 12,
        marginBottom: 4
    },
    logTextDim: {
        color: '#6B7280',
        fontFamily: 'monospace',
        fontSize: 12
    },
    timestamp: {
        color: '#6B7280'
    },
    jsonContainer: {
        backgroundColor: '#1E293B',
        padding: 12,
        borderRadius: 8,
        minHeight: 100
    },
    jsonText: {
        color: '#93C5FD',
        fontFamily: 'monospace',
        fontSize: 10
    },
    infoSection: {
        padding: 16,
        backgroundColor: '#E5E7EB',
        borderRadius: 12,
        marginBottom: 40
    },
    infoTitle: {
        fontWeight: 'bold',
        color: '#374151',
        marginBottom: 8
    },
    infoText: {
        fontSize: 12,
        color: '#4B5563',
        marginBottom: 4,
        lineHeight: 18
    }
});

export default SystemScreen;
