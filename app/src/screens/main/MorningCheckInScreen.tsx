import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeContainer, Button, Card, Header, Slider, Toggle } from '@/components';
import { useCheckInStore } from '@/store';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';

interface MorningCheckInScreenProps {
  navigation: any;
}

const DAILY_ACTIONS = [
  { id: 'nutrition', label: 'UltraMind Nutrition', icon: 'restaurant' },
  { id: 'sleep', label: '8 Hours Sleep', icon: 'nightlight-round' },
  { id: 'supplements', label: 'Core Supplements', icon: 'medication' },
  { id: 'movement', label: 'Rhythm & Movement', icon: 'directions-run' },
  { id: 'mindfulness', label: 'Mindfulness Session', icon: 'self-improvement' },
];

export const MorningCheckInScreen: React.FC<MorningCheckInScreenProps> = ({ navigation }) => {
  const {
    energyLevel,
    mood,
    brainClarity,
    completedActions,
    setEnergyLevel,
    setMood,
    setBrainClarity,
    toggleAction,
  } = useCheckInStore();

  const handleSubmit = () => {
    // Submit check-in data
    navigation.goBack();
  };

  return (
    <SafeContainer style={styles.container}>
      <Header
        title="Morning Check-In"
        leftIcon="close"
        onLeftPress={() => navigation.goBack()}
        rightIcon="settings"
        onRightPress={() => {}}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Question Section */}
        <View style={styles.questionSection}>
          <Text style={styles.question}>How's your brain today?</Text>
          <Text style={styles.subtitle}>
            Assess your mental and physical state based on the UltraMind protocols.
          </Text>
        </View>

        {/* Energy Level */}
        <Card variant="outlined" style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <View style={styles.metricIcon}>
              <MaterialIcons name="bolt" size={24} color={Colors.warning} />
            </View>
            <Text style={styles.metricLabel}>Energy Level</Text>
            <Text style={styles.metricValue}>{energyLevel}/10</Text>
          </View>
          <Slider
            value={energyLevel}
            onValueChange={setEnergyLevel}
            minValue={1}
            maxValue={10}
            leftLabel="Drained"
            rightLabel="Radiant"
            showValue={false}
            activeColor={Colors.primary}
          />
        </Card>

        {/* Mood */}
        <Card variant="outlined" style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <View style={styles.metricIcon}>
              <MaterialIcons name="mood" size={24} color={Colors.chartMood} />
            </View>
            <Text style={styles.metricLabel}>Mood</Text>
            <Text style={styles.metricValue}>{mood}/10</Text>
          </View>
          <Slider
            value={mood}
            onValueChange={setMood}
            minValue={1}
            maxValue={10}
            leftLabel="Low"
            rightLabel="Elevated"
            showValue={false}
            activeColor={Colors.chartMood}
          />
        </Card>

        {/* Brain Clarity */}
        <Card variant="outlined" style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <View style={styles.metricIcon}>
              <MaterialIcons name="psychology" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.metricLabel}>Brain Clarity</Text>
            <Text style={styles.metricValue}>{brainClarity}/10</Text>
          </View>
          <Slider
            value={brainClarity}
            onValueChange={setBrainClarity}
            minValue={1}
            maxValue={10}
            leftLabel="Foggy"
            rightLabel="Sharp"
            showValue={false}
            activeColor={Colors.primary}
          />
        </Card>

        {/* Daily Actions Checklist */}
        <View style={styles.checklistSection}>
          <Text style={styles.checklistTitle}>Daily Actions Checklist</Text>
          {DAILY_ACTIONS.map((action) => {
            const isCompleted = completedActions.includes(action.id);
            return (
              <TouchableOpacity
                key={action.id}
                style={styles.actionItem}
                onPress={() => toggleAction(action.id)}
                activeOpacity={0.7}
              >
                <View style={styles.actionLeft}>
                  <View style={[styles.actionIcon, isCompleted && styles.actionIconCompleted]}>
                    <MaterialIcons
                      name={action.icon as any}
                      size={20}
                      color={isCompleted ? Colors.primary : Colors.textMuted}
                    />
                  </View>
                  <Text style={[styles.actionLabel, isCompleted && styles.actionLabelCompleted]}>
                    {action.label}
                  </Text>
                </View>
                <Toggle
                  enabled={isCompleted}
                  onToggle={() => toggleAction(action.id)}
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Submit Button */}
      <View style={styles.bottomAction}>
        <Button
          title="Complete Check-In"
          onPress={handleSubmit}
          size="large"
          icon={<MaterialIcons name="check" size={20} color={Colors.textLight} />}
        />
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
    paddingBottom: Spacing.xxxl,
  },
  questionSection: {
    marginBottom: Spacing.xxl,
    marginTop: Spacing.lg,
  },
  question: {
    fontSize: FontSizes.title,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  metricCard: {
    marginBottom: Spacing.lg,
    padding: Spacing.xl,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  metricIcon: {
    marginRight: Spacing.md,
  },
  metricLabel: {
    flex: 1,
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
  },
  metricValue: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.primary,
  },
  checklistSection: {
    marginTop: Spacing.lg,
  },
  checklistTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIconCompleted: {
    backgroundColor: Colors.primaryFaded,
  },
  actionLabel: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.textPrimary,
  },
  actionLabelCompleted: {
    color: Colors.primary,
  },
  bottomAction: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    paddingBottom: Spacing.xxxl,
    backgroundColor: Colors.backgroundLight,
  },
});

export default MorningCheckInScreen;
