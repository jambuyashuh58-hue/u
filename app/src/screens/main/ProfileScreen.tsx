import React, { useMemo } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { Header, Card, Button, ProgressRing } from '@components';
import { theme } from '@constants/theme';
import { useAuthStore, useSubscriptionStore, useProgramStore } from '@store';

const { width } = Dimensions.get('window');

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
  earned: boolean;
  progress?: number;
}

interface QuickAction {
  id: string;
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  screen: string;
}

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const { isPremium, plan } = useSubscriptionStore();
  const { currentWeek } = useProgramStore();

  const stats = [
    { label: 'Current Week', value: currentWeek || 2, icon: 'calendar-today' },
    { label: 'Day Streak', value: 12, icon: 'local-fire-department' },
    { label: 'Check-ins', value: 24, icon: 'check-circle' },
    { label: 'Sessions', value: 18, icon: 'self-improvement' },
  ];

  const achievements: Achievement[] = [
    { id: '1', title: 'First Check-in', description: 'Complete your first morning check-in', icon: 'wb-sunny', color: '#FFD54F', earned: true },
    { id: '2', title: '7-Day Streak', description: 'Maintain a 7-day check-in streak', icon: 'local-fire-department', color: '#FF7043', earned: true },
    { id: '3', title: 'Mind Master', description: 'Complete 10 breathing sessions', icon: 'self-improvement', color: '#7986CB', earned: true, progress: 100 },
    { id: '4', title: 'Week 1 Graduate', description: 'Complete Week 1 of the program', icon: 'school', color: '#4FC3F7', earned: true },
    { id: '5', title: '30-Day Champion', description: 'Complete a 30-day streak', icon: 'emoji-events', color: '#FFD700', earned: false, progress: 40 },
    { id: '6', title: 'Supplement Pro', description: '100% supplement compliance for 7 days', icon: 'medication', color: '#81C784', earned: false, progress: 71 },
  ];

  const quickActions: QuickAction[] = [
    { id: '1', title: 'Progress', icon: 'insights', screen: 'ProgressAnalytics' },
    { id: '2', title: 'Settings', icon: 'settings', screen: 'Settings' },
    { id: '3', title: 'Subscription', icon: 'star', screen: 'Subscription' },
    { id: '4', title: 'Help', icon: 'help', screen: 'Help' },
  ];

  const handleQuickAction = (screen: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate(screen as never);
  };

  const earnedCount = achievements.filter(a => a.earned).length;

  return (
    <LinearGradient
      colors={['#0a1628', '#0d1f3c', '#0a1628']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <Header title="Profile" />

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Header */}
          <Card variant="elevated" style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                <LinearGradient
                  colors={[theme.colors.primary, '#0a84ff']}
                  style={styles.avatar}
                >
                  <Text style={styles.avatarText}>
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </Text>
                </LinearGradient>
                {isPremium && (
                  <View style={styles.premiumBadge}>
                    <MaterialIcons name="star" size={12} color={theme.colors.accent.gold} />
                  </View>
                )}
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user?.name || 'User'}</Text>
                <Text style={styles.profileEmail}>{user?.email || 'user@example.com'}</Text>
                <View style={styles.planBadge}>
                  <Text style={styles.planText}>
                    {isPremium ? `${plan || 'Premium'} Member` : 'Free Plan'}
                  </Text>
                </View>
              </View>
              <Pressable 
                style={styles.editButton}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <MaterialIcons name="edit" size={20} color={theme.colors.primary} />
              </Pressable>
            </View>
          </Card>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <Card key={index} variant="filled" style={styles.statCard}>
                <MaterialIcons name={stat.icon as any} size={24} color={theme.colors.primary} />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </Card>
            ))}
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            {quickActions.map((action) => (
              <Pressable
                key={action.id}
                style={styles.quickAction}
                onPress={() => handleQuickAction(action.screen)}
              >
                <View style={styles.quickActionIcon}>
                  <MaterialIcons name={action.icon} size={22} color={theme.colors.primary} />
                </View>
                <Text style={styles.quickActionText}>{action.title}</Text>
              </Pressable>
            ))}
          </View>

          {/* Program Progress */}
          <Card variant="elevated" style={styles.programCard}>
            <View style={styles.programHeader}>
              <Text style={styles.sectionTitle}>Program Progress</Text>
              <Text style={styles.programWeek}>Week {currentWeek || 2} of 6</Text>
            </View>
            <View style={styles.programProgress}>
              <ProgressRing 
                progress={(currentWeek || 2) / 6} 
                size={80} 
                strokeWidth={6}
                color={theme.colors.primary}
              />
              <View style={styles.programInfo}>
                <Text style={styles.programPercent}>{Math.round(((currentWeek || 2) / 6) * 100)}%</Text>
                <Text style={styles.programLabel}>Complete</Text>
                <Button
                  title="View Details"
                  variant="outline"
                  size="small"
                  onPress={() => navigation.navigate('Program' as never)}
                  style={styles.programButton}
                />
              </View>
            </View>
          </Card>

          {/* Achievements */}
          <View style={styles.achievementsSection}>
            <View style={styles.achievementsHeader}>
              <Text style={styles.sectionTitle}>Achievements</Text>
              <Text style={styles.achievementCount}>{earnedCount}/{achievements.length}</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.achievementsList}>
                {achievements.map((achievement) => (
                  <View
                    key={achievement.id}
                    style={[
                      styles.achievementCard,
                      !achievement.earned && styles.achievementCardLocked,
                    ]}
                  >
                    <View style={[
                      styles.achievementIcon,
                      { backgroundColor: `${achievement.color}20` },
                      !achievement.earned && styles.achievementIconLocked,
                    ]}>
                      <MaterialIcons 
                        name={achievement.icon} 
                        size={28} 
                        color={achievement.earned ? achievement.color : theme.colors.textMuted} 
                      />
                    </View>
                    <Text style={[
                      styles.achievementTitle,
                      !achievement.earned && styles.achievementTitleLocked,
                    ]}>
                      {achievement.title}
                    </Text>
                    {!achievement.earned && achievement.progress !== undefined && (
                      <View style={styles.achievementProgress}>
                        <View style={styles.achievementProgressBar}>
                          <View 
                            style={[
                              styles.achievementProgressFill,
                              { width: `${achievement.progress}%` }
                            ]} 
                          />
                        </View>
                        <Text style={styles.achievementProgressText}>{achievement.progress}%</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Upgrade CTA for free users */}
          {!isPremium && (
            <Card variant="elevated" style={styles.upgradeCard}>
              <LinearGradient
                colors={['rgba(19, 164, 236, 0.2)', 'rgba(19, 164, 236, 0.05)']}
                style={styles.upgradeGradient}
              >
                <MaterialIcons name="workspace-premium" size={32} color={theme.colors.accent.gold} />
                <Text style={styles.upgradeTitle}>Unlock Full Access</Text>
                <Text style={styles.upgradeText}>
                  Get AI coaching, advanced analytics, and the complete 6-week program.
                </Text>
                <Button
                  title="Upgrade to Premium"
                  onPress={() => navigation.navigate('Subscription' as never)}
                  fullWidth
                  icon="star"
                />
              </LinearGradient>
            </Card>
          )}
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
  profileCard: {
    marginBottom: theme.spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontFamily: 'Lexend-Bold',
    color: theme.colors.text,
  },
  premiumBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.accent.gold,
  },
  profileInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  profileName: {
    fontSize: 20,
    fontFamily: 'Lexend-Bold',
    color: theme.colors.text,
  },
  profileEmail: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontFamily: 'Lexend-Regular',
    marginTop: 2,
  },
  planBadge: {
    backgroundColor: 'rgba(19, 164, 236, 0.15)',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
    alignSelf: 'flex-start',
    marginTop: theme.spacing.xs,
  },
  planText: {
    fontSize: 11,
    color: theme.colors.primary,
    fontFamily: 'Lexend-Medium',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(19, 164, 236, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    width: (width - 48 - theme.spacing.sm) / 2,
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Lexend-Bold',
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontFamily: 'Lexend-Regular',
    marginTop: 2,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  quickAction: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  quickActionText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontFamily: 'Lexend-Medium',
  },
  programCard: {
    marginBottom: theme.spacing.lg,
  },
  programHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Lexend-SemiBold',
    color: theme.colors.text,
  },
  programWeek: {
    fontSize: 13,
    color: theme.colors.primary,
    fontFamily: 'Lexend-Medium',
  },
  programProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
  programInfo: {
    flex: 1,
  },
  programPercent: {
    fontSize: 32,
    fontFamily: 'Lexend-Bold',
    color: theme.colors.text,
  },
  programLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontFamily: 'Lexend-Regular',
    marginBottom: theme.spacing.sm,
  },
  programButton: {
    marginTop: theme.spacing.xs,
  },
  achievementsSection: {
    marginBottom: theme.spacing.lg,
  },
  achievementsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.xs,
  },
  achievementCount: {
    fontSize: 14,
    color: theme.colors.primary,
    fontFamily: 'Lexend-Medium',
  },
  achievementsList: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  achievementCard: {
    width: 120,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
  },
  achievementCardLocked: {
    opacity: 0.7,
  },
  achievementIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  achievementIconLocked: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  achievementTitle: {
    fontSize: 12,
    fontFamily: 'Lexend-Medium',
    color: theme.colors.text,
    textAlign: 'center',
  },
  achievementTitleLocked: {
    color: theme.colors.textSecondary,
  },
  achievementProgress: {
    width: '100%',
    marginTop: theme.spacing.sm,
  },
  achievementProgressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  achievementProgressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
  achievementProgressText: {
    fontSize: 10,
    color: theme.colors.textMuted,
    fontFamily: 'Lexend-Regular',
    textAlign: 'center',
    marginTop: 4,
  },
  upgradeCard: {
    overflow: 'hidden',
    padding: 0,
  },
  upgradeGradient: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  upgradeTitle: {
    fontSize: 18,
    fontFamily: 'Lexend-Bold',
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  upgradeText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontFamily: 'Lexend-Regular',
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    lineHeight: 20,
  },
});

export default ProfileScreen;