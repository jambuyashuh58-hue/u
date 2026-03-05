import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeContainer, Button, SelectionCard, Header } from '@/components';
import { useOnboardingStore } from '@/store';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import type { UserGoal } from '@/types';

interface GoalSettingScreenProps {
  navigation: any;
}

const GOALS: { id: UserGoal; title: string; description: string; icon: string }[] = [
  {
    id: 'mental_clarity',
    title: 'Mental Clarity & Focus',
    description: 'Prioritize brain fog elimination and cognitive enhancement through neuro-nutrition.',
    icon: 'psychology',
  },
  {
    id: 'emotional_resilience',
    title: 'Emotional Resilience',
    description: 'Focus on mood stability, anxiety reduction, and stress hormone regulation.',
    icon: 'favorite',
  },
  {
    id: 'physical_energy',
    title: 'Physical Energy Boost',
    description: 'Optimize mitochondrial function and metabolic health for sustained vitality.',
    icon: 'bolt',
  },
  {
    id: 'system_reset',
    title: 'Complete System Reset',
    description: 'A holistic approach to detoxify and repair all body systems simultaneously.',
    icon: 'refresh',
  },
];

export const GoalSettingScreen: React.FC<GoalSettingScreenProps> = ({ navigation }) => {
  const { selectedGoal, setGoal, currentStep, totalSteps } = useOnboardingStore();

  const progress = (currentStep / totalSteps) * 100;

  const handleContinue = () => {
    if (selectedGoal) {
      navigation.navigate('ChallengeSelection');
    }
  };

  return (
    <SafeContainer style={styles.container}>
      <Header
        title="Goal Setting"
        leftIcon="arrow_back"
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Onboarding</Text>
            <Text style={styles.progressStep}>Step {currentStep} of {totalSteps}</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
        </View>

        {/* Question */}
        <View style={styles.questionSection}>
          <Text style={styles.question}>
            What is your primary goal for the next 6 weeks?
          </Text>
          <Text style={styles.subtitle}>
            We'll tailor your UltraMind protocol based on your selection.
          </Text>
        </View>

        {/* Goal Options */}
        <View style={styles.options}>
          {GOALS.map((goal) => (
            <SelectionCard
              key={goal.id}
              selected={selectedGoal === goal.id}
              onSelect={() => setGoal(goal.id)}
              title={goal.title}
              description={goal.description}
              icon={
                <MaterialIcons
                  name={goal.icon as any}
                  size={24}
                  color={selectedGoal === goal.id ? Colors.primary : Colors.textSecondary}
                />
              }
              variant="radio"
            />
          ))}
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomAction}>
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!selectedGoal}
          size="large"
        />
        <Text style={styles.footerNote}>
          You can change your focus area at any time in settings.
        </Text>
      </View>
    </SafeContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xl,
  },
  progressSection: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xxl,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  progressLabel: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
  },
  progressStep: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.primaryMuted,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
  },
  questionSection: {
    marginBottom: Spacing.xxl,
  },
  question: {
    fontSize: FontSizes.title,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    lineHeight: 36,
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  options: {
    gap: Spacing.lg,
  },
  bottomAction: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxxl,
    backgroundColor: Colors.backgroundLight,
  },
  footerNote: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
});

export default GoalSettingScreen;
