import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { SafeContainer, Button, Header } from '@/components';
import { useOnboardingStore } from '@/store';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';
import type { UserChallenge } from '@/types';

interface ChallengeSelectionScreenProps {
  navigation: any;
}

const CHALLENGES: { id: UserChallenge; title: string; icon: string; color: string }[] = [
  { id: 'brain_fog', title: 'Brain Fog', icon: 'cloud', color: '#9ca3af' },
  { id: 'low_energy', title: 'Low Energy', icon: 'battery-low', color: '#f59e0b' },
  { id: 'mood_swings', title: 'Mood Swings', icon: 'mood', color: '#8b5cf6' },
  { id: 'sleep_issues', title: 'Sleep Issues', icon: 'nightlight-round', color: '#3b82f6' },
  { id: 'digestive_problems', title: 'Digestive Problems', icon: 'health-and-safety', color: '#10b981' },
  { id: 'stress', title: 'Stress', icon: 'psychology', color: '#ef4444' },
];

export const ChallengeSelectionScreen: React.FC<ChallengeSelectionScreenProps> = ({ navigation }) => {
  const { selectedChallenges, toggleChallenge, setStep } = useOnboardingStore();

  React.useEffect(() => {
    setStep(2);
  }, []);

  const handleContinue = () => {
    if (selectedChallenges.length > 0) {
      navigation.navigate('BaselineAssessment');
    }
  };

  const handleToggle = (id: UserChallenge) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleChallenge(id);
  };

  return (
    <SafeContainer style={styles.container}>
      <Header
        title="Identify Your Challenges"
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
            <Text style={styles.progressLabel}>Onboarding Progress</Text>
            <Text style={styles.progressStep}>2 of 5</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '40%' }]} />
          </View>
        </View>

        {/* Question */}
        <View style={styles.questionSection}>
          <Text style={styles.question}>
            What are you struggling with?
          </Text>
          <Text style={styles.subtitle}>
            Select all that apply to personalize your UltraMind journey.
          </Text>
        </View>

        {/* Challenge Options */}
        <View style={styles.options}>
          {CHALLENGES.map((challenge) => {
            const isSelected = selectedChallenges.includes(challenge.id);
            return (
              <TouchableOpacity
                key={challenge.id}
                style={[
                  styles.challengeCard,
                  isSelected && styles.challengeCardSelected,
                ]}
                onPress={() => handleToggle(challenge.id)}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: `${challenge.color}20` },
                  ]}
                >
                  <MaterialIcons
                    name={challenge.icon as any}
                    size={24}
                    color={challenge.color}
                  />
                </View>
                <Text style={styles.challengeTitle}>{challenge.title}</Text>
                <View
                  style={[
                    styles.checkbox,
                    isSelected && styles.checkboxSelected,
                  ]}
                >
                  {isSelected && (
                    <MaterialIcons name="check" size={16} color={Colors.textLight} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomAction}>
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={selectedChallenges.length === 0}
          size="large"
        />
        <Text style={styles.footerNote}>
          Step 2 of 5: Personalized Discovery
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
    fontWeight: FontWeights.medium,
    color: Colors.textSecondary,
  },
  progressStep: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.primary,
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
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  options: {
    gap: Spacing.md,
  },
  challengeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: Spacing.lg,
  },
  challengeCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryFaded,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  challengeTitle: {
    flex: 1,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  bottomAction: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxxl,
    backgroundColor: Colors.backgroundLight,
  },
  footerNote: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
});

export default ChallengeSelectionScreen;
