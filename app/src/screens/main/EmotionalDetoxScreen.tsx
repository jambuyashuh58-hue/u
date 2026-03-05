import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Header, Card, Button } from '@components';
import { theme } from '@constants/theme';

const { width } = Dimensions.get('window');

interface Emotion {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface CognitiveDistortion {
  id: string;
  name: string;
  description: string;
  example: string;
}

const EMOTIONS: Emotion[] = [
  { id: 'anxious', name: 'Anxious', icon: '😰', color: '#FF7043' },
  { id: 'frustrated', name: 'Frustrated', icon: '😤', color: '#EF5350' },
  { id: 'sad', name: 'Sad', icon: '😢', color: '#5C6BC0' },
  { id: 'overwhelmed', name: 'Overwhelmed', icon: '😵', color: '#AB47BC' },
  { id: 'angry', name: 'Angry', icon: '😠', color: '#F44336' },
  { id: 'lonely', name: 'Lonely', icon: '😔', color: '#78909C' },
  { id: 'stressed', name: 'Stressed', icon: '😣', color: '#FF9800' },
  { id: 'fearful', name: 'Fearful', icon: '😨', color: '#7E57C2' },
];

const COGNITIVE_DISTORTIONS: CognitiveDistortion[] = [
  { 
    id: 'all_or_nothing', 
    name: 'All-or-Nothing', 
    description: 'Seeing things in black or white categories',
    example: '"I failed completely" vs "I made some mistakes"'
  },
  { 
    id: 'catastrophizing', 
    name: 'Catastrophizing', 
    description: 'Expecting the worst possible outcome',
    example: '"This will ruin everything"'
  },
  { 
    id: 'mind_reading', 
    name: 'Mind Reading', 
    description: 'Assuming you know what others think',
    example: '"They think I\'m incompetent"'
  },
  { 
    id: 'should_statements', 
    name: 'Should Statements', 
    description: 'Using "should" or "must" rigidly',
    example: '"I should never make mistakes"'
  },
  { 
    id: 'personalization', 
    name: 'Personalization', 
    description: 'Blaming yourself for things outside your control',
    example: '"It\'s all my fault"'
  },
  { 
    id: 'filtering', 
    name: 'Mental Filtering', 
    description: 'Focusing only on negatives',
    example: 'Ignoring 9 compliments, fixating on 1 criticism'
  },
];

type Step = 'trigger' | 'emotion' | 'intensity' | 'distortion' | 'reframe' | 'complete';

export const EmotionalDetoxScreen: React.FC = () => {
  const [step, setStep] = useState<Step>('trigger');
  const [trigger, setTrigger] = useState('');
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [intensity, setIntensity] = useState(5);
  const [selectedDistortion, setSelectedDistortion] = useState<string | null>(null);
  const [reframedThought, setReframedThought] = useState('');
  const [fadeAnim] = useState(new Animated.Value(1));

  const animateTransition = useCallback((nextStep: Step) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    setTimeout(() => setStep(nextStep), 150);
  }, [fadeAnim]);

  const handleNext = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const steps: Step[] = ['trigger', 'emotion', 'intensity', 'distortion', 'reframe', 'complete'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex < steps.length - 1) {
      animateTransition(steps[currentIndex + 1]);
    }
  }, [step, animateTransition]);

  const handleBack = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const steps: Step[] = ['trigger', 'emotion', 'intensity', 'distortion', 'reframe', 'complete'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      animateTransition(steps[currentIndex - 1]);
    }
  }, [step, animateTransition]);

  const handleReset = useCallback(() => {
    setTrigger('');
    setSelectedEmotion(null);
    setIntensity(5);
    setSelectedDistortion(null);
    setReframedThought('');
    animateTransition('trigger');
  }, [animateTransition]);

  const canProceed = useCallback((): boolean => {
    switch (step) {
      case 'trigger': return trigger.length > 10;
      case 'emotion': return selectedEmotion !== null;
      case 'intensity': return true;
      case 'distortion': return selectedDistortion !== null;
      case 'reframe': return reframedThought.length > 10;
      default: return false;
    }
  }, [step, trigger, selectedEmotion, selectedDistortion, reframedThought]);

  const getStepNumber = (s: Step) => {
    const steps: Step[] = ['trigger', 'emotion', 'intensity', 'distortion', 'reframe'];
    return steps.indexOf(s) + 1;
  };

  const renderStep = () => {
    switch (step) {
      case 'trigger':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>What triggered this emotion?</Text>
            <Text style={styles.stepSubtitle}>
              Describe the situation, event, or thought that led to how you're feeling.
            </Text>
            <TextInput
              style={styles.textArea}
              value={trigger}
              onChangeText={setTrigger}
              placeholder="I was feeling anxious when..."
              placeholderTextColor={theme.colors.textMuted}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>{trigger.length}/500</Text>
          </View>
        );

      case 'emotion':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>How are you feeling?</Text>
            <Text style={styles.stepSubtitle}>
              Select the emotion that best describes your current state.
            </Text>
            <View style={styles.emotionsGrid}>
              {EMOTIONS.map((emotion) => (
                <Pressable
                  key={emotion.id}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedEmotion(emotion.id);
                  }}
                  style={[
                    styles.emotionCard,
                    selectedEmotion === emotion.id && styles.emotionCardSelected,
                    { borderColor: selectedEmotion === emotion.id ? emotion.color : 'rgba(255,255,255,0.1)' },
                  ]}
                >
                  <Text style={styles.emotionIcon}>{emotion.icon}</Text>
                  <Text style={[
                    styles.emotionName,
                    selectedEmotion === emotion.id && { color: emotion.color },
                  ]}>
                    {emotion.name}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        );

      case 'intensity':
        const selectedEmotionData = EMOTIONS.find(e => e.id === selectedEmotion);
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>
              How intense is this {selectedEmotionData?.name.toLowerCase()}?
            </Text>
            <Text style={styles.stepSubtitle}>
              Rate the intensity from 1 (mild) to 10 (overwhelming).
            </Text>
            <View style={styles.intensityContainer}>
              <Text style={[styles.intensityValue, { color: selectedEmotionData?.color }]}>
                {intensity}
              </Text>
              <Text style={styles.intensityLabel}>
                {intensity <= 3 ? 'Mild' : intensity <= 6 ? 'Moderate' : intensity <= 8 ? 'Strong' : 'Overwhelming'}
              </Text>
              <View style={styles.intensityButtons}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
                  <Pressable
                    key={val}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setIntensity(val);
                    }}
                    style={[
                      styles.intensityButton,
                      intensity === val && { backgroundColor: selectedEmotionData?.color },
                    ]}
                  >
                    <Text style={[
                      styles.intensityButtonText,
                      intensity === val && styles.intensityButtonTextSelected,
                    ]}>
                      {val}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        );

      case 'distortion':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Identify the thought pattern</Text>
            <Text style={styles.stepSubtitle}>
              Which cognitive distortion might be influencing your thinking?
            </Text>
            <ScrollView 
              style={styles.distortionsList}
              showsVerticalScrollIndicator={false}
            >
              {COGNITIVE_DISTORTIONS.map((distortion) => (
                <Pressable
                  key={distortion.id}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSelectedDistortion(distortion.id);
                  }}
                  style={[
                    styles.distortionCard,
                    selectedDistortion === distortion.id && styles.distortionCardSelected,
                  ]}
                >
                  <View style={styles.distortionHeader}>
                    <View style={[
                      styles.distortionRadio,
                      selectedDistortion === distortion.id && styles.distortionRadioSelected,
                    ]}>
                      {selectedDistortion === distortion.id && (
                        <View style={styles.distortionRadioInner} />
                      )}
                    </View>
                    <Text style={styles.distortionName}>{distortion.name}</Text>
                  </View>
                  <Text style={styles.distortionDescription}>{distortion.description}</Text>
                  <Text style={styles.distortionExample}>{distortion.example}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        );

      case 'reframe':
        const distortionData = COGNITIVE_DISTORTIONS.find(d => d.id === selectedDistortion);
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Reframe your thought</Text>
            <Text style={styles.stepSubtitle}>
              Now, try to think of a more balanced, realistic perspective.
            </Text>
            <Card variant="filled" style={styles.contextCard}>
              <Text style={styles.contextLabel}>You identified:</Text>
              <Text style={styles.contextValue}>{distortionData?.name}</Text>
              <Text style={styles.contextTip}>
                💡 Try replacing extreme words like "always", "never", "must" with more balanced language.
              </Text>
            </Card>
            <TextInput
              style={styles.textArea}
              value={reframedThought}
              onChangeText={setReframedThought}
              placeholder="A more balanced way to see this situation is..."
              placeholderTextColor={theme.colors.textMuted}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
          </View>
        );

      case 'complete':
        return (
          <View style={styles.completeContent}>
            <View style={styles.completeIcon}>
              <MaterialIcons name="check-circle" size={64} color={theme.colors.semantic.success} />
            </View>
            <Text style={styles.completeTitle}>Great Work! 🌟</Text>
            <Text style={styles.completeSubtitle}>
              You've successfully processed this emotion. Remember, this practice gets easier with time.
            </Text>
            
            <Card variant="elevated" style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Session Summary</Text>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Emotion:</Text>
                <Text style={styles.summaryValue}>
                  {EMOTIONS.find(e => e.id === selectedEmotion)?.icon} {EMOTIONS.find(e => e.id === selectedEmotion)?.name}
                </Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Intensity:</Text>
                <Text style={styles.summaryValue}>{intensity}/10</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Pattern:</Text>
                <Text style={styles.summaryValue}>
                  {COGNITIVE_DISTORTIONS.find(d => d.id === selectedDistortion)?.name}
                </Text>
              </View>
            </Card>

            <Button
              title="Start New Entry"
              onPress={handleReset}
              variant="outline"
              fullWidth
              icon="refresh"
            />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <LinearGradient
      colors={['#0a1628', '#0d1f3c', '#0a1628']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <Header 
          title="Emotional Detox" 
          subtitle={step !== 'complete' ? `Step ${getStepNumber(step)} of 5` : undefined}
          showBack 
        />

        <KeyboardAvoidingView 
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* Progress Bar */}
          {step !== 'complete' && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${(getStepNumber(step) / 5) * 100}%` }
                  ]} 
                />
              </View>
            </View>
          )}

          <ScrollView 
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View style={{ opacity: fadeAnim }}>
              {renderStep()}
            </Animated.View>
          </ScrollView>

          {/* Footer Navigation */}
          {step !== 'complete' && (
            <View style={styles.footer}>
              {step !== 'trigger' && (
                <Button
                  title="Back"
                  onPress={handleBack}
                  variant="ghost"
                  icon="arrow-back"
                  style={styles.backButton}
                />
              )}
              <Button
                title={step === 'reframe' ? 'Complete' : 'Continue'}
                onPress={handleNext}
                disabled={!canProceed()}
                style={styles.nextButton}
                icon={step === 'reframe' ? 'check' : 'arrow-forward'}
                iconPosition="right"
              />
            </View>
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  progressContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 24,
    fontFamily: 'Lexend-SemiBold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  stepSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontFamily: 'Lexend-Regular',
    marginBottom: theme.spacing.lg,
    lineHeight: 20,
  },
  textArea: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    color: theme.colors.text,
    fontFamily: 'Lexend-Regular',
    fontSize: 16,
    minHeight: 150,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  charCount: {
    fontSize: 12,
    color: theme.colors.textMuted,
    textAlign: 'right',
    marginTop: theme.spacing.xs,
  },
  emotionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  emotionCard: {
    width: (width - 64) / 4 - 6,
    aspectRatio: 0.85,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  emotionCardSelected: {
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  emotionIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  emotionName: {
    fontSize: 11,
    fontFamily: 'Lexend-Medium',
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  intensityContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  intensityValue: {
    fontSize: 72,
    fontFamily: 'Lexend-Bold',
    marginBottom: theme.spacing.xs,
  },
  intensityLabel: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    fontFamily: 'Lexend-Medium',
    marginBottom: theme.spacing.xl,
  },
  intensityButtons: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  intensityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  intensityButtonText: {
    fontSize: 13,
    fontFamily: 'Lexend-Medium',
    color: theme.colors.textSecondary,
  },
  intensityButtonTextSelected: {
    color: theme.colors.text,
  },
  distortionsList: {
    flex: 1,
    maxHeight: 350,
  },
  distortionCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  distortionCardSelected: {
    backgroundColor: 'rgba(19, 164, 236, 0.1)',
    borderColor: theme.colors.primary,
  },
  distortionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  distortionRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  distortionRadioSelected: {
    borderColor: theme.colors.primary,
  },
  distortionRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.primary,
  },
  distortionName: {
    fontSize: 15,
    fontFamily: 'Lexend-SemiBold',
    color: theme.colors.text,
  },
  distortionDescription: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontFamily: 'Lexend-Regular',
    marginBottom: 4,
    marginLeft: 28,
  },
  distortionExample: {
    fontSize: 12,
    color: theme.colors.textMuted,
    fontFamily: 'Lexend-Regular',
    fontStyle: 'italic',
    marginLeft: 28,
  },
  contextCard: {
    marginBottom: theme.spacing.md,
  },
  contextLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontFamily: 'Lexend-Regular',
  },
  contextValue: {
    fontSize: 16,
    color: theme.colors.primary,
    fontFamily: 'Lexend-SemiBold',
    marginBottom: theme.spacing.sm,
  },
  contextTip: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontFamily: 'Lexend-Regular',
    lineHeight: 18,
  },
  completeContent: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  completeIcon: {
    marginBottom: theme.spacing.lg,
  },
  completeTitle: {
    fontSize: 28,
    fontFamily: 'Lexend-Bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  completeSubtitle: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    fontFamily: 'Lexend-Regular',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing.xl,
  },
  summaryCard: {
    width: '100%',
    marginBottom: theme.spacing.lg,
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: 'Lexend-SemiBold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  summaryLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontFamily: 'Lexend-Regular',
  },
  summaryValue: {
    fontSize: 14,
    color: theme.colors.text,
    fontFamily: 'Lexend-Medium',
  },
  footer: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  backButton: {
    flex: 0.4,
  },
  nextButton: {
    flex: 1,
  },
});

export default EmotionalDetoxScreen;
