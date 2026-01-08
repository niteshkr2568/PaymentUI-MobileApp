import React, { useContext, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AgentContext } from '../context/AgentContext';

const PIPELINE_NODES = [
    { id: 'user', label: 'User Input', icon: 'account', color: '#4285F4' }, // Blue
    { id: 'ui', label: 'Frontend', icon: 'cellphone', color: '#6366F1' }, // Indigo
    { id: 'orch', label: 'Orchestrator', icon: 'server', color: '#9333EA' }, // Purple
    { id: 'nav_agent', label: 'Nav', icon: 'home-outline', color: '#10B981' }, // Green
    { id: 'trans_agent', label: 'Bank', icon: 'credit-card-outline', color: '#EF4444' }, // Red
    { id: 'data_agent', label: 'Data', icon: 'database', color: '#F59E0B' }, // Yellow
];

// Node Component
const PipelineNode = ({ id, active, def }: { id: string, active: boolean, def: any }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (active) {
            Animated.sequence([
                Animated.timing(scaleAnim, { toValue: 1.2, duration: 150, useNativeDriver: true }),
                Animated.timing(scaleAnim, { toValue: 1.0, duration: 150, useNativeDriver: true })
            ]).start();
        } else {
            scaleAnim.setValue(1);
        }
    }, [active]);

    return (
        <View style={styles.nodeContainer}>
            <Animated.View style={[
                styles.iconContainer,
                { transform: [{ scale: scaleAnim }], backgroundColor: active ? def.color : '#374151' }
            ]}>
                <Icon name={def.icon} size={20} color="#fff" />
            </Animated.View>
            <Text style={[styles.nodeLabel, active && { color: '#fff', fontWeight: 'bold' }]}>{def.label}</Text>
        </View>
    );
};

export const PipelineVisualizer = () => {
    const context = useContext(AgentContext);
    const activeNode = context?.activeNode;

    const getNodeDef = (id: string) => PIPELINE_NODES.find(n => n.id === id);

    return (
        <View style={styles.container}>
            <View style={styles.geminiBadge}>
                <Icon name="sparkles" size={12} color="#A78BFA" />
                <Text style={styles.geminiText}>GEMINI POWERED</Text>
            </View>

            <View style={styles.flowContainer}>
                {/* Level 1 */}
                <View style={styles.row}>
                    <PipelineNode id="user" active={activeNode === 'user'} def={getNodeDef('user')} />
                    <Icon name="arrow-right" size={20} color="#4B5563" />
                    <PipelineNode id="ui" active={activeNode === 'ui'} def={getNodeDef('ui')} />
                </View>

                {/* Level 2 Orchestrator */}
                <View style={styles.colItems}>
                    <View style={[styles.lineV, activeNode === 'orch' ? { backgroundColor: '#9333EA' } : {}]} />
                    <PipelineNode id="orch" active={activeNode === 'orch'} def={getNodeDef('orch')} />
                    <View style={styles.lineV} />
                </View>

                {/* Level 3 Agents */}
                <View style={styles.agentsRow}>
                    {/* Connector */}
                    <View style={styles.connectorBracket} />

                    <View style={styles.agentNodes}>
                        <PipelineNode id="nav_agent" active={activeNode === 'nav_agent' || activeNode === 'Navigation'} def={getNodeDef('nav_agent')} />
                        <PipelineNode id="trans_agent" active={activeNode === 'trans_agent' || activeNode === 'Transaction'} def={getNodeDef('trans_agent')} />
                        <PipelineNode id="data_agent" active={activeNode === 'data_agent' || activeNode === 'Data'} def={getNodeDef('data_agent')} />
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#0F172A', // Slate 900
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        position: 'relative',
        overflow: 'hidden'
    },
    geminiBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
    },
    geminiText: {
        color: '#A78BFA',
        fontSize: 10,
        fontWeight: 'bold'
    },
    flowContainer: {
        alignItems: 'center',
        marginTop: 16
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16
    },
    colItems: {
        alignItems: 'center'
    },
    nodeContainer: {
        alignItems: 'center',
        width: 60
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3
    },
    nodeLabel: {
        color: '#6B7280',
        fontSize: 10,
        textAlign: 'center'
    },
    lineV: {
        width: 2,
        height: 20,
        backgroundColor: '#374151',
    },
    agentsRow: {
        alignItems: 'center',
        width: '100%'
    },
    connectorBracket: {
        width: 140, // Span across 3 agents
        height: 10,
        borderTopWidth: 2,
        borderTopColor: '#374151',
        borderLeftWidth: 2,
        borderLeftColor: '#374151',
        borderRightWidth: 2,
        borderRightColor: '#374151',
        marginBottom: -4, // Hides the top part of node containers
    },
    agentNodes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 200,
        marginTop: 10
    }
});
