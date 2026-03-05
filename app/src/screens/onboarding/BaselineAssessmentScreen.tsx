import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Button, ProgressRing } from '@components';
import { theme } from '@constants/theme';
import { useOnboardingStore } from '@store';

const { width } = Dimensions.get('window');

interface Question {
  id: string;
  category: string;
  question: string;
  options: { value: number; label: string }[];
}

const ASSESSMENT_QUESTIONS: Question[] = [
  // Nutrition Category
  {
    id: 'nutrition_1',
    category: 'Nutrition',
    question: 'How often do you eat processed or fast foods?',
    options: [
      { value: 1, label: 'Daily' },
      { value: 3, label: '3-5 times/week' },
      { value: 6, label: '1-2 times/week' },
      { value: 9, label: 'Rarely/Never' },
    ],
  },
  {
    id: 'nutrition_2',
    category: 'Nutrition',
    question: 'How many servings of vegetables do you eat daily?',
    options: [
      { value: 2, label: '0-1 servings' },
      { value: 5, label: '2-3 servings' },
      { value: 8, label: '4-5 servings' },
      { value: 10, label: '6+ servings' },
    ],
  },
  // Stress Category
  {
    id: 'stress_1',
    category: 'Stress',
    question: 'How often do you feel overwhelmed or anxious?',
    options: [
      { value: 2, label: 'Constantly' },
      { value: 4, label: 'Often' },
      { value: 7, label: 'Sometimes' },
      { value: 10, label: 'Rarely' },
    ],
  },
  {
    id: 'stress_2',
    category: 'Stress',
    question: 'Do you have regular stress management practices?',
    options: [
      { value: 2, label: 'No practices' },
      { value: 5, label: 'Occasional' },
      { value: 8, label: 'Weekly' },
      { value: 10, label: 'Daily practice' },
    ],
  },
  // Sleep Category
  {
    id: 'sleep_1',
    category: 'Sleep',
    question: 'How would you rate your sleep quality?',
    options: [
      { value: 2, label: 'Very poor' },
      { value: 4, label: 'Poor' },
      { value: 7, label: 'Good' },
      { value: 10, label: 'Excellent' },
    ],
  },
  {
    id: 'sleep_2',
    category: 'Sleep',
    question: 'How many hours of sleep do you typically get?',
    options: [
      { value: 2, label: 'Less than 5' },
      { value: 5, label: '5-6 hours' },
      { value: 8, label: '7-8 hours' },
      { value: 10, label: '8+ hours' },
    ],
  },
  // Exercise Category
  {
    id: 'exercise_1',
    category: 'Exercise',
    question: 'How often do you exercise?',
    options: [
      { value: 2, label: 'Never' },
      { value: 4, label: '1-2x/week' },
      { value: 7, label: '3-4x/week' },
      { value: 10, label: '5+x/week' },
    ],
  },
  // Brain/Cognitive Category
  {
    id: 'brain_1',
    category: 'Brain',
    question: 'How often do you experience brain fog or difficulty concentrating?',
    options: [
      { value: 2, label: 'Constantly' },
      { value: 4, label: 'Daily' },
      { value: 7, label: 'Occasionally' },
      { value: 10, label: 'Rarely' },
    ],
  },
  {
    id: 'brain_2',
    category: 'Brain',
    question: 'How would you rate your memory and mental clarity?',
    options: [
      { value: 2, label: 'Very poor' },
      { value: 5, label: 'Below average' },
      { value: 7, label: 'Good' },
      { value: 10, label: 'Sharp and clear' },
    ],
  },
  // Mindset Category
  {
    id: 'mindset_1',
    category: 'Mindset',
    question: 'How often do you practice gratitude or positive thinking?',
    options: [
      { value: 2, label: 'Never' },
      { value: 5, label: 'Occasionally' },
      { value: 8, label: 'Often' },
      { value: 10, label: 'Daily' },
    ],
  },
];

const CATEGORY_ICONS: Record<string, keyof typeof MaterialIcons.glyphMap> = {
  Nutrition: 'restaurant',
  Stress: 'self-improvement',
  Sleep: 'bedtime',
  Exercise: 'fitness-center',
  Brain: 'psychology',
  Mindset: 'emoji-objects',
};

export const BaselineAssessmentScreen: React.FC = () => {
  const navigation = useNavigation();
  const { setBaselineScores, setOnboardingStep } = useOnboardingStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [fadeAnim] = useState(new Animated.Value(1));

  const currentQuestion = ASSESSMENT_QUESTIONS[currentIndex];
  const progress = (currentIndex + 1) / ASSESSMENT_QUESTIONS.length;
  const isLastQuestion = currentIndex === ASSESSMENT_QUESTIONS.length - 1;

  const animateTransition = useCallback((direction: 'next' | 'prev') => {
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
  }, [fadeAnim]);

  const handleAnswer = useCallback((value: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  }, [currentQuestion.id]);

  const handleNext = useCallback(() => {
    if (!answers[currentQuestion.id]) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (isLastQuestion) {
      // Calculate category scores
      const categoryScores: Record<string, number[]> = {};
      
      ASSESSMENT_QUESTIONS.forEach((q) => {
        const answer = answers[q.id];
        if (answer !== undefined) {
          if (!categoryScores[q.category]) {
            categoryScores[q.category] = [];
          }
          categoryScores[q.category].push(answer);
        }
      });

      // Average scores by category
      const finalScores = {
        nutritionScore: Math.round(
          categoryScores.Nutrition?.reduce((a, b) => a + b, 0) / categoryScores.Nutrition?.length || 5
        ),
        stressScore: Math.round(
          categoryScores.Stress?.reduce((a, b) => a + b, 0) / categoryScores.Stress?.length || 5
        ),
        sleepScore: Math.round(
          categoryScores.Sleep?.reduce((a, b) => a + b, 0) / categoryScores.Sleep?.length || 5
        ),
        exerciseScore: Math.round(
          categoryScores.Exercise?.reduce((a, b) => a + b, 0) / categoryScores.Exercise?.length || 5
        ),
        brainScore: Math.round(
          categoryScores.Brain?.reduce((a, b) => a + b, 0) / categoryScores.Brain?.length || 5
        ),
        mindsetScore: Math.round(
          categoryScores.Mindset?.reduce((a, b) => a + b, 0) / categoryScores.Mindset?.length || 5
        ),
      };

      setBaselineScores(finalScores);
      setOnboardingStep(5);
      navigation.navigate('YourPath' as never);
    } else {
      animateTransition('next');
      setTimeout(() => setCurrentIndex(prev => prev + 1), 150);
    }
  }, [answers, currentQuestion.id, isLastQuestion, navigation, setBaselineScores, setOnboardingStep, animateTransition]);

  const handleBack = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (currentIndex > 0) {
      animateTransition('prev');
      setTimeout(() => setCurrentIndex(prev => prev - 1), 150);
    } else {
      navigation.goBack();
    }
  }, [currentIndex, navigation, animateTransition]);

  const selectedValue = answers[currentQuestion.id];

  return (
    <LinearGradient
      colors={['#0a1628', '#0d1f3c', '#0a1628']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={handleBack} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={theme.colors.text} />
          </Pressable>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              Question {currentIndex + 1} of {ASSESSMENT_QUESTIONS.length}
            </Text>
            <View style={styles.progressBar}>
              <Animated.View 
                style={[
                  styles.progressFill, 
                  { width: `${progress * 100}%` }
                ]} 
              />
            </View>
          </View>
          <View style={styles.placeholderButton} />
        </View>

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ opacity: fadeAnim }}>
            {/* Category Badge */}
            <View style={styles.categoryBadge}>
              <MaterialIcons 
                name={CATEGORY_ICONS[currentQuestion.category] || 'help'} 
                size={18} 
                color={theme.colors.primary} 
              />
              <Text style={styles.categoryText}>{currentQuestion.category}</Text>
            </View>

            {/* Question */}
            <Text style={styles.question}>{currentQuestion.question}</Text>

            {/* Options */}
            <View style={styles.optionsContainer}>
              {currentQuestion.options.map((option) => {
                const isSelected = selectedValue === option.value;
                return (
                  <Pressable
                    key={option.value}
                    onPress={() => handleAnswer(option.value)}
                    style={[
                      styles.optionCard,
                      isSelected && styles.optionCardSelected,
                    ]}
                  >
                    <View style={[
                      styles.optionRadio,
                      isSelected && styles.optionRadioSelected,
                    ]}>
                      {isSelected && (
                        <View style={styles.optionRadioInner} />
                      )}
                    </View>
                    <Text style={[
                      styles.optionText,
                      isSelected && styles.optionTextSelected,
                    ]}>
                      {option.label}
                    </Text>
                    {isSelected && (
                      <MaterialIcons 
                        name="check-circle" 
                        size={24} 
                        color={theme.colors.primary} 
                        style={styles.checkIcon}
                      />
                    )}
                  </Pressable>
                );
              })}
            </View>
          </Animated.View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Button
            title={isLastQuestion ? "Complete Assessment" : "Continue"}
            onPress={handleNext}
            disabled={!selectedValue}
            fullWidth
            icon={isLastQuestion ? "check-circle" : "arrow-forward"}
            iconPosition="right"
          />
        </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderButton: {
    width: 40,
  },
  progressContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  progressText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 6,
    fontFamily: 'Lexend-Medium',
  },
  progressBar: {
    width: '100%',
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
    paddingTop: theme.spacing.xl,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(19, 164, 236, 0.15)',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    alignSelf: 'flex-start',
    marginBottom: theme.spacing.lg,
  },
  categoryText: {
    fontSize: 14,
    color: theme.colors.primary,
    marginLeft: 8,
    fontFamily: 'Lexend-Medium',
  },
  question: {
    fontSize: 24,
    fontFamily: 'Lexend-SemiBold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
    lineHeight: 32,
  },
  optionsContainer: {
    gap: theme.spacing.md,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  optionCardSelected: {
    backgroundColor: 'rgba(19, 164, 236, 0.1)',
    borderColor: theme.colors.primary,
  },
  optionRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  optionRadioSelected: {
    borderColor: theme.colors.primary,
  },
  optionRadioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    fontFamily: 'Lexend-Regular',
  },
  optionTextSelected: {
    color: theme.colors.text,
    fontFamily: 'Lexend-Medium',
  },
  checkIcon: {
    marginLeft: theme.spacing.sm,
  },
  footer: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
});

export default BaselineAssessmentScreen;
