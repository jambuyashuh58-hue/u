import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Header, Card, Button, ProgressRing } from '@components';
import { theme } from '@constants/theme';
import { useSupplementStore } from '@store';

const { width } = Dimensions.get('window');

interface Supplement {
  id: string;
  name: string;
  dosage: string;
  instructions: string;
  timeOfDay: 'morning' | 'noon' | 'night';
  scheduledTime: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
  taken: boolean;
  weekNumber: number;
}

interface TimeBlock {
  id: 'morning' | 'noon' | 'night';
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  timeRange: string;
}

const TIME_BLOCKS: TimeBlock[] = [
  { id: 'morning', label: 'Morning', icon: 'wb-sunny', timeRange: '7:00 - 9:00 AM' },
  { id: 'noon', label: 'Afternoon', icon: 'wb-twilight', timeRange: '12:00 - 2:00 PM' },
  { id: 'night', label: 'Evening', icon: 'nightlight-round', timeRange: '8:00 - 10:00 PM' },
];

// Sample supplement data - organized by week
const SUPPLEMENTS_BY_WEEK: Record<number, Supplement[]> = {
  1: [
    { id: '1', name: 'Vitamin D3', dosage: '5000 IU', instructions: 'Take with fatty food', timeOfDay: 'morning', scheduledTime: '8:00 AM', icon: 'wb-sunny', color: '#FFD54F', taken: false, weekNumber: 1 },
    { id: '2', name: 'Omega-3 Fish Oil', dosage: '2000mg', instructions: 'With breakfast', timeOfDay: 'morning', scheduledTime: '8:00 AM', icon: 'water-drop', color: '#4FC3F7', taken: true, weekNumber: 1 },
    { id: '3', name: 'Magnesium Glycinate', dosage: '400mg', instructions: 'For relaxation & sleep', timeOfDay: 'night', scheduledTime: '9:00 PM', icon: 'bedtime', color: '#B39DDB', taken: false, weekNumber: 1 },
    { id: '4', name: 'Probiotics', dosage: '50B CFU', instructions: 'On empty stomach', timeOfDay: 'morning', scheduledTime: '7:00 AM', icon: 'spa', color: '#81C784', taken: true, weekNumber: 1 },
  ],
  2: [
    { id: '5', name: 'B-Complex', dosage: '100mg', instructions: 'With food', timeOfDay: 'morning', scheduledTime: '8:00 AM', icon: 'bolt', color: '#FF8A65', taken: false, weekNumber: 2 },
    { id: '6', name: 'L-Theanine', dosage: '200mg', instructions: 'For calm focus', timeOfDay: 'noon', scheduledTime: '1:00 PM', icon: 'self-improvement', color: '#7986CB', taken: false, weekNumber: 2 },
    { id: '1', name: 'Vitamin D3', dosage: '5000 IU', instructions: 'Take with fatty food', timeOfDay: 'morning', scheduledTime: '8:00 AM', icon: 'wb-sunny', color: '#FFD54F', taken: false, weekNumber: 2 },
    { id: '3', name: 'Magnesium Glycinate', dosage: '400mg', instructions: 'For relaxation & sleep', timeOfDay: 'night', scheduledTime: '9:00 PM', icon: 'bedtime', color: '#B39DDB', taken: false, weekNumber: 2 },
  ],
};

export const SupplementPlannerScreen: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState(2);
  const [supplements, setSupplements] = useState(SUPPLEMENTS_BY_WEEK[currentWeek] || []);

  const toggleSupplement = useCallback((id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSupplements(prev => 
      prev.map(s => s.id === id ? { ...s, taken: !s.taken } : s)
    );
  }, []);

  const getSupplementsByTime = (timeOfDay: 'morning' | 'noon' | 'night') => {
    return supplements.filter(s => s.timeOfDay === timeOfDay);
  };

  const completedCount = supplements.filter(s => s.taken).length;
  const completionRate = Math.round((completedCount / supplements.length) * 100);

  return (
    <LinearGradient
      colors={['#0a1628', '#0d1f3c', '#0a1628']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <Header title="Supplements" subtitle={`Week ${currentWeek} Protocol`} showBack />

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Progress Card */}
          <Card variant="elevated" style={styles.progressCard}>
            <View style={styles.progressContent}>
              <ProgressRing 
                progress={completionRate / 100} 
                size={80} 
                strokeWidth={6}
                color={theme.colors.primary}
              />
              <View style={styles.progressInfo}>
                <Text style={styles.progressLabel}>Today's Progress</Text>
                <Text style={styles.progressValue}>{completedCount} of {supplements.length}</Text>
                <Text style={styles.progressSubtext}>
                  {completionRate === 100 
                    ? '🎉 All done! Great job!' 
                    : `${supplements.length - completedCount} remaining`}
                </Text>
              </View>
            </View>
          </Card>

          {/* Week Selector */}
          <View style={styles.weekSelector}>
            {[1, 2, 3, 4, 5, 6].map((week) => (
              <Pressable
                key={week}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setCurrentWeek(week);
                  setSupplements(SUPPLEMENTS_BY_WEEK[week] || SUPPLEMENTS_BY_WEEK[1]);
                }}
                style={[
                  styles.weekButton,
                  currentWeek === week && styles.weekButtonActive,
                  week > 2 && styles.weekButtonLocked,
                ]}
              >
                <Text style={[
                  styles.weekText,
                  currentWeek === week && styles.weekTextActive,
                ]}>
                  {week}
                </Text>
                {week > 2 && (
                  <MaterialIcons 
                    name="lock" 
                    size={10} 
                    color={theme.colors.textMuted} 
                    style={styles.lockIcon}
                  />
                )}
              </Pressable>
            ))}
          </View>

          {/* Time Block Sections */}
          {TIME_BLOCKS.map((block) => {
            const blockSupplements = getSupplementsByTime(block.id);
            if (blockSupplements.length === 0) return null;

            const blockCompleted = blockSupplements.filter(s => s.taken).length;
            const allDone = blockCompleted === blockSupplements.length;

            return (
              <View key={block.id} style={styles.timeBlockSection}>
                {/* Time Header */}
                <View style={styles.timeHeader}>
                  <View style={styles.timeHeaderLeft}>
                    <View style={[styles.timeIcon, allDone && styles.timeIconComplete]}>
                      <MaterialIcons 
                        name={allDone ? 'check-circle' : block.icon} 
                        size={20} 
                        color={allDone ? theme.colors.semantic.success : theme.colors.primary} 
                      />
                    </View>
                    <View>
                      <Text style={styles.timeLabel}>{block.label}</Text>
                      <Text style={styles.timeRange}>{block.timeRange}</Text>
                    </View>
                  </View>
                  <Text style={styles.timeCount}>
                    {blockCompleted}/{blockSupplements.length}
                  </Text>
                </View>

                {/* Supplement Cards */}
                {blockSupplements.map((supplement) => (
                  <Pressable
                    key={supplement.id}
                    onPress={() => toggleSupplement(supplement.id)}
                    style={[
                      styles.supplementCard,
                      supplement.taken && styles.supplementCardTaken,
                    ]}
                  >
                    <View style={[
                      styles.supplementIcon,
                      { backgroundColor: `${supplement.color}20` },
                    ]}>
                      <MaterialIcons 
                        name={supplement.icon} 
                        size={24} 
                        color={supplement.taken ? theme.colors.textMuted : supplement.color} 
                      />
                    </View>
                    <View style={styles.supplementInfo}>
                      <Text style={[
                        styles.supplementName,
                        supplement.taken && styles.supplementNameTaken,
                      ]}>
                        {supplement.name}
                      </Text>
                      <Text style={styles.supplementDosage}>{supplement.dosage}</Text>
                      <Text style={styles.supplementInstructions}>
                        {supplement.instructions}
                      </Text>
                    </View>
                    <View style={styles.supplementRight}>
                      <Text style={styles.supplementTime}>{supplement.scheduledTime}</Text>
                      <View style={[
                        styles.checkbox,
                        supplement.taken && styles.checkboxChecked,
                      ]}>
                        {supplement.taken && (
                          <MaterialIcons name="check" size={16} color={theme.colors.background} />
                        )}
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>
            );
          })}

          {/* Info Section */}
          <Card variant="filled" style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <MaterialIcons name="info" size={20} color={theme.colors.primary} />
              <Text style={styles.infoTitle}>Week {currentWeek} Focus</Text>
            </View>
            <Text style={styles.infoText}>
              {currentWeek === 1 
                ? 'Building your foundational stack: gut health, inflammation, and key vitamins.'
                : currentWeek === 2
                ? 'Adding cognitive support with B-Complex and L-Theanine for mental clarity.'
                : 'Advanced protocol unlocks as you progress through the program.'}
            </Text>
          </Card>

          {/* Quick Tips */}
          <Card variant="outlined" style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>💡 Quick Tips</Text>
            <View style={styles.tipItem}>
              <MaterialIcons name="schedule" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.tipText}>Set reminders for consistent timing</Text>
            </View>
            <View style={styles.tipItem}>
              <MaterialIcons name="restaurant" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.tipText}>Take fat-soluble vitamins with meals</Text>
            </View>
            <View style={styles.tipItem}>
              <MaterialIcons name="water-drop" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.tipText}>Drink a full glass of water with supplements</Text>
            </View>
          </Card>
        </ScrollView>
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  progressCard: {
    marginBottom: theme.spacing.lg,
  },
  progressContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
  progressInfo: {
    flex: 1,
  },
  progressLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontFamily: 'Lexend-Regular',
  },
  progressValue: {
    fontSize: 28,
    fontFamily: 'Lexend-Bold',
    color: theme.colors.text,
    marginVertical: 4,
  },
  progressSubtext: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontFamily: 'Lexend-Regular',
  },
  weekSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  weekButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  weekButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  weekButtonLocked: {
    opacity: 0.5,
  },
  weekText: {
    fontSize: 16,
    fontFamily: 'Lexend-SemiBold',
    color: theme.colors.textSecondary,
  },
  weekTextActive: {
    color: theme.colors.text,
  },
  lockIcon: {
    position: 'absolute',
    bottom: 2,
    right: 6,
  },
  timeBlockSection: {
    marginBottom: theme.spacing.lg,
  },
  timeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  timeHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  timeIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(19, 164, 236, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeIconComplete: {
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
  },
  timeLabel: {
    fontSize: 16,
    fontFamily: 'Lexend-SemiBold',
    color: theme.colors.text,
  },
  timeRange: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontFamily: 'Lexend-Regular',
  },
  timeCount: {
    fontSize: 14,
    fontFamily: 'Lexend-Medium',
    color: theme.colors.textSecondary,
  },
  supplementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  supplementCardTaken: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  supplementIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  supplementInfo: {
    flex: 1,
  },
  supplementName: {
    fontSize: 15,
    fontFamily: 'Lexend-SemiBold',
    color: theme.colors.text,
  },
  supplementNameTaken: {
    color: theme.colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  supplementDosage: {
    fontSize: 13,
    color: theme.colors.primary,
    fontFamily: 'Lexend-Medium',
    marginTop: 2,
  },
  supplementInstructions: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontFamily: 'Lexend-Regular',
    marginTop: 2,
  },
  supplementRight: {
    alignItems: 'flex-end',
    gap: theme.spacing.sm,
  },
  supplementTime: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontFamily: 'Lexend-Medium',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: theme.colors.semantic.success,
    borderColor: theme.colors.semantic.success,
  },
  infoCard: {
    marginBottom: theme.spacing.md,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  infoTitle: {
    fontSize: 14,
    fontFamily: 'Lexend-SemiBold',
    color: theme.colors.text,
  },
  infoText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontFamily: 'Lexend-Regular',
    lineHeight: 20,
  },
  tipsCard: {
    marginBottom: theme.spacing.lg,
  },
  tipsTitle: {
    fontSize: 14,
    fontFamily: 'Lexend-SemiBold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  tipText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontFamily: 'Lexend-Regular',
    flex: 1,
  },
});

export default SupplementPlannerScreen;
