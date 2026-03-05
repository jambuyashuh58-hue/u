import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeContainer, Card, ProgressRing, Header } from '@/components';
import { useProgramStore, useThemeStore } from '@/store';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius, Shadows } from '@/constants/theme';

interface DashboardScreenProps {
  navigation: any;
}

interface WeekData {
  weekNumber: number;
  title: string;
  isActive: boolean;
  isCompleted: boolean;
  isLocked: boolean;
  progress?: number;
}

const WEEKS: WeekData[] = [
  { weekNumber: 1, title: 'Foundations', isActive: false, isCompleted: true, isLocked: false },
  { weekNumber: 2, title: 'Nutrition & Gut', isActive: true, isCompleted: false, isLocked: false, progress: 50 },
  { weekNumber: 3, title: 'Hormones', isActive: false, isCompleted: false, isLocked: true },
  { weekNumber: 4, title: 'Detox', isActive: false, isCompleted: false, isLocked: true },
  { weekNumber: 5, title: 'Integration', isActive: false, isCompleted: false, isLocked: true },
  { weekNumber: 6, title: 'Maintenance', isActive: false, isCompleted: false, isLocked: true },
];

const QUICK_ACTIONS = [
  {
    id: 'morning',
    title: 'Morning Check-In',
    subtitle: 'Log your sleep and mood',
    icon: 'wb-sunny',
    bgColor: Colors.sage,
    iconColor: '#16a34a',
    route: 'MorningCheckIn',
  },
  {
    id: 'supplements',
    title: 'Supplement Tracker',
    subtitle: '4 of 6 supplements taken',
    icon: 'medication',
    bgColor: Colors.softBlue,
    iconColor: '#2563eb',
    route: 'SupplementPlanner',
  },
  {
    id: 'mindfulness',
    title: 'Mindfulness Timer',
    subtitle: 'Daily 10-min breathwork',
    icon: 'timer',
    bgColor: '#f1f5f9',
    iconColor: Colors.primary,
    route: 'MindTraining',
  },
];

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { dailyProgress } = useProgramStore();
  const { isDarkMode } = useThemeStore();

  const renderWeekCard = ({ item }: { item: WeekData }) => {
    if (item.isActive) {
      return (
        <LinearGradient
          colors={[Colors.primary, Colors.primaryLight]}
          style={styles.weekCardActive}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.weekLabelActive}>WEEK {item.weekNumber} • ACTIVE</Text>
          <Text style={styles.weekTitleActive}>{item.title}</Text>
          <View style={styles.weekProgressBar}>
            <View style={[styles.weekProgressFill, { width: `${item.progress}%` }]} />
          </View>
        </LinearGradient>
      );
    }

    return (
      <View style={[styles.weekCard, item.isCompleted && styles.weekCardCompleted]}>
        <Text style={styles.weekLabel}>WEEK {item.weekNumber}</Text>
        <Text style={styles.weekTitle}>{item.title}</Text>
        <View style={styles.weekStatus}>
          {item.isCompleted ? (
            <MaterialIcons name="check-circle" size={24} color={Colors.success} />
          ) : item.isLocked ? (
            <MaterialIcons name="lock" size={24} color={Colors.textMuted} />
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <SafeContainer style={styles.container} withBottomNav>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoCircle}>
            <MaterialIcons name="psychology" size={24} color={Colors.primary} />
          </View>
          <Text style={styles.headerTitle}>UltraMind Dashboard</Text>
        </View>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <MaterialIcons name="settings" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Daily Routine Card */}
        <Card variant="elevated" style={styles.routineCard}>
          <View style={styles.routineHeader}>
            <View>
              <Text style={styles.routineTitle}>Daily Routine</Text>
              <Text style={styles.routineSubtitle}>Mind & Body optimization</Text>
            </View>
            <ProgressRing
              progress={dailyProgress}
              size={72}
              strokeWidth={6}
            />
          </View>
          <View style={styles.routineAlert}>
            <MaterialIcons name="info" size={16} color={Colors.primary} />
            <Text style={styles.routineAlertText}>
              You're on track! Complete your meditation to hit 80%.
            </Text>
          </View>
        </Card>

        {/* 6-Week Program */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6-Week Program</Text>
          <FlatList
            data={WEEKS}
            renderItem={renderWeekCard}
            keyExtractor={(item) => `week-${item.weekNumber}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.weeksList}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={[styles.actionCard, { backgroundColor: action.bgColor }]}
              onPress={() => navigation.navigate(action.route)}
              activeOpacity={0.8}
            >
              <View style={styles.actionIconContainer}>
                <MaterialIcons name={action.icon as any} size={24} color={action.iconColor} />
              </View>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
              </View>
              <View style={[styles.actionButton, { backgroundColor: action.iconColor }]}>
                <MaterialIcons
                  name={action.id === 'supplements' ? 'add' : action.id === 'mindfulness' ? 'play-arrow' : 'chevron-right'}
                  size={24}
                  color={Colors.textLight}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Daily Insight */}
        <View style={styles.insightCard}>
          <LinearGradient
            colors={[Colors.backgroundDark, '#1e3a4c']}
            style={styles.insightGradient}
          >
            <View style={styles.insightBadge}>
              <Text style={styles.insightBadgeText}>DAILY INSIGHT</Text>
            </View>
            <Text style={styles.insightQuote}>
              "The brain is the most metabolically active organ in the body."
            </Text>
            <Text style={styles.insightAuthor}>— Mark Hyman, MD</Text>
          </LinearGradient>
        </View>
      </ScrollView>
    </SafeContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.primaryMuted,
  },
  headerTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  settingsButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    gap: Spacing.xl,
  },
  routineCard: {
    padding: Spacing.xl,
  },
  routineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  routineTitle: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  routineSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  routineAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primaryFaded,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  routineAlertText: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: FontWeights.medium,
  },
  section: {
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginLeft: Spacing.xs,
  },
  weeksList: {
    gap: Spacing.md,
    paddingRight: Spacing.lg,
  },
  weekCard: {
    width: 128,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  weekCardCompleted: {
    opacity: 0.6,
  },
  weekCardActive: {
    width: 160,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    ...Shadows.primary,
  },
  weekLabel: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  weekLabelActive: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  weekTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
    marginTop: Spacing.xs,
  },
  weekTitleActive: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textLight,
    marginTop: Spacing.xs,
  },
  weekStatus: {
    marginTop: Spacing.md,
    alignItems: 'center',
  },
  weekProgressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    marginTop: Spacing.md,
    overflow: 'hidden',
  },
  weekProgressFill: {
    height: '100%',
    backgroundColor: Colors.textLight,
    borderRadius: 3,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    gap: Spacing.lg,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  actionSubtitle: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightCard: {
    borderRadius: BorderRadius.xxl,
    overflow: 'hidden',
  },
  insightGradient: {
    padding: Spacing.xl,
    minHeight: 160,
    justifyContent: 'flex-end',
  },
  insightBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    marginBottom: Spacing.md,
  },
  insightBadgeText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
    color: Colors.textLight,
    letterSpacing: 0.5,
  },
  insightQuote: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    color: Colors.textLight,
    lineHeight: 28,
  },
  insightAuthor: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    marginTop: Spacing.md,
  },
});

export default DashboardScreen;
