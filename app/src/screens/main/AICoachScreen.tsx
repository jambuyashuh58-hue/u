import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeContainer, Header, Card, Button } from '@/components';
import { useCoachStore } from '@/store';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius, Shadows } from '@/constants/theme';
import type { CoachMessage, CoachAction } from '@/types';

interface AICoachScreenProps {
  navigation: any;
}

// Sample initial messages based on the design
const INITIAL_MESSAGES: CoachMessage[] = [
  {
    id: '1',
    role: 'assistant',
    content: "Good morning! I've been reviewing your data from the past week.",
    timestamp: new Date(),
  },
  {
    id: '2',
    role: 'assistant',
    content: "I've noticed your **energy peaks** right after your morning meditation. However, your food logs suggest a potential **sensitivity to dairy**—I see a dip in clarity 2 hours post-ingestion.",
    timestamp: new Date(),
    actions: [
      {
        id: 'action-1',
        type: 'insight',
        title: 'Dairy-Free Clarity Week',
        description: 'Try replacing cow\'s milk with almond or macadamia milk this week. It may significantly reduce systemic inflammation.',
        imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200',
        ctaText: 'Set Reminder',
      },
    ],
  },
];

export const AICoachScreen: React.FC<AICoachScreenProps> = ({ navigation }) => {
  const { messages, setMessages, addMessage, isTyping } = useCoachStore();
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Initialize with sample messages
    if (messages.length === 0) {
      setMessages(INITIAL_MESSAGES);
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom on new messages
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim()) {
      const newMessage: CoachMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: inputText.trim(),
        timestamp: new Date(),
      };
      addMessage(newMessage);
      setInputText('');
      
      // Simulate AI response (in real app, call API)
      setTimeout(() => {
        const response: CoachMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: "That's a great observation! Let me analyze that pattern for you and suggest some adjustments to your protocol.",
          timestamp: new Date(),
        };
        addMessage(response);
      }, 1500);
    }
  };

  const renderMessage = (message: CoachMessage) => {
    const isAssistant = message.role === 'assistant';

    return (
      <View
        key={message.id}
        style={[
          styles.messageContainer,
          isAssistant ? styles.assistantMessage : styles.userMessage,
        ]}
      >
        {isAssistant && (
          <View style={styles.assistantAvatar}>
            <MaterialIcons name="psychology" size={20} color={Colors.primary} />
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            isAssistant ? styles.assistantBubble : styles.userBubble,
          ]}
        >
          <Text style={[
            styles.messageText,
            isAssistant ? styles.assistantText : styles.userText,
          ]}>
            {message.content}
          </Text>
          
          {/* Action Cards */}
          {message.actions?.map((action) => (
            <View key={action.id} style={styles.actionCard}>
              <View style={styles.actionHeader}>
                <MaterialIcons name="eco" size={20} color={Colors.primary} />
                <Text style={styles.actionTitle}>{action.title}</Text>
              </View>
              {action.imageUrl && (
                <Image
                  source={{ uri: action.imageUrl }}
                  style={styles.actionImage}
                  resizeMode="cover"
                />
              )}
              <Text style={styles.actionDescription}>{action.description}</Text>
              <View style={styles.actionButtons}>
                <Button
                  title={action.ctaText || 'Learn More'}
                  onPress={() => {}}
                  size="medium"
                  icon={<MaterialIcons name="notifications" size={18} color={Colors.textLight} />}
                  iconPosition="left"
                  style={styles.actionButton}
                />
                <TouchableOpacity style={styles.shareButton}>
                  <MaterialIcons name="share" size={20} color={Colors.textMuted} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeContainer style={styles.container}>
      <Header
        title="AI Coach"
        subtitle="ULTRAMIND GUIDE"
        leftIcon="arrow_back"
        onLeftPress={() => navigation.goBack()}
        rightIcon="more_vert"
      />

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        {/* Messages List */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Timestamp */}
          <Text style={styles.timestamp}>UltraMind Guide • 09:41 AM</Text>
          
          {messages.map(renderMessage)}
          
          {isTyping && (
            <View style={styles.typingIndicator}>
              <View style={styles.assistantAvatar}>
                <MaterialIcons name="psychology" size={20} color={Colors.primary} />
              </View>
              <View style={styles.typingBubble}>
                <Text style={styles.typingText}>Typing...</Text>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Suggested Actions */}
        <View style={styles.suggestedSection}>
          <Text style={styles.suggestedLabel}>SUGGESTED MICRO-SHIFTS</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickActionButton}>
            <MaterialIcons name="self-improvement" size={20} color={Colors.primary} />
            <Text style={styles.quickActionText}>Start Deep Reflection</Text>
            <MaterialIcons name="chevron-right" size={20} color={Colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <MaterialIcons name="refresh" size={20} color={Colors.primary} />
            <Text style={styles.quickActionText}>Help with Reframe</Text>
            <MaterialIcons name="chevron-right" size={20} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Reply to your guide..."
            placeholderTextColor={Colors.textMuted}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              inputText.trim() && styles.sendButtonActive,
            ]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <MaterialIcons
              name="arrow-upward"
              size={24}
              color={inputText.trim() ? Colors.textLight : Colors.textMuted}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  keyboardAvoid: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  timestamp: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
  },
  assistantMessage: {
    alignItems: 'flex-start',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  assistantAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
    marginTop: 4,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
  },
  assistantBubble: {
    backgroundColor: Colors.surfaceLight,
    borderBottomLeftRadius: BorderRadius.sm,
    ...Shadows.sm,
  },
  userBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: BorderRadius.sm,
  },
  messageText: {
    fontSize: FontSizes.md,
    lineHeight: 22,
  },
  assistantText: {
    color: Colors.textPrimary,
  },
  userText: {
    color: Colors.textLight,
  },
  actionCard: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  actionTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  actionImage: {
    width: '100%',
    height: 100,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  actionDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  shareButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  typingBubble: {
    backgroundColor: Colors.surfaceLight,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.xl,
    borderBottomLeftRadius: BorderRadius.sm,
  },
  typingText: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  suggestedSection: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  suggestedLabel: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.semibold,
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  quickActions: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: Spacing.md,
  },
  quickActionText: {
    flex: 1,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.primary,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
    gap: Spacing.md,
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: Colors.primary,
  },
});

export default AICoachScreen;
