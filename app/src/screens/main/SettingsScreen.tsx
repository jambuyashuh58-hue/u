import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { Header, Card } from '@components';
import { theme } from '@constants/theme';
import { useThemeStore, useAuthStore, useSubscriptionStore } from '@store';

interface SettingItem {
  id: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  subtitle?: string;
  type: 'toggle' | 'link' | 'button';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
  dangerous?: boolean;
}

interface SettingSection {
  title: string;
  items: SettingItem[];
}

export const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const { logout, user } = useAuthStore();
  const { isPremium, plan } = useSubscriptionStore();
  
  const [notifications, setNotifications] = useState({
    morningReminder: true,
    supplementReminder: true,
    mindfulnessReminder: false,
    weeklyReport: true,
    aiInsights: true,
  });
  const [biometrics, setBiometrics] = useState(false);
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [autoSync, setAutoSync] = useState(true);

  const handleLogout = useCallback(() => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: () => logout()
        },
      ]
    );
  }, [logout]);

  const handleDeleteAccount = useCallback(() => {
    Alert.alert(
      'Delete Account',
      'This action is permanent. All your data will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Contact Support', 'Please email support@ultramind.app to delete your account.');
          }
        },
      ]
    );
  }, []);

  const handleExportData = useCallback(() => {
    Alert.alert(
      'Export Data',
      'Your data will be sent to your email within 24 hours.',
      [{ text: 'OK' }]
    );
  }, []);

  const openLink = useCallback((url: string) => {
    Linking.openURL(url).catch(() => Alert.alert('Error', 'Could not open link'));
  }, []);

  const sections: SettingSection[] = [
    {
      title: 'Notifications',
      items: [
        {
          id: 'morning_reminder',
          icon: 'wb-sunny',
          title: 'Morning Check-in',
          subtitle: '8:00 AM daily',
          type: 'toggle',
          value: notifications.morningReminder,
          onToggle: (val) => setNotifications(prev => ({ ...prev, morningReminder: val })),
        },
        {
          id: 'supplement_reminder',
          icon: 'medication',
          title: 'Supplement Reminders',
          type: 'toggle',
          value: notifications.supplementReminder,
          onToggle: (val) => setNotifications(prev => ({ ...prev, supplementReminder: val })),
        },
        {
          id: 'mindfulness_reminder',
          icon: 'self-improvement',
          title: 'Mindfulness Reminder',
          subtitle: '3:00 PM daily',
          type: 'toggle',
          value: notifications.mindfulnessReminder,
          onToggle: (val) => setNotifications(prev => ({ ...prev, mindfulnessReminder: val })),
        },
        {
          id: 'weekly_report',
          icon: 'assessment',
          title: 'Weekly Report',
          subtitle: 'Every Sunday',
          type: 'toggle',
          value: notifications.weeklyReport,
          onToggle: (val) => setNotifications(prev => ({ ...prev, weeklyReport: val })),
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          id: 'dark_mode',
          icon: 'dark-mode',
          title: 'Dark Mode',
          type: 'toggle',
          value: isDarkMode,
          onToggle: toggleDarkMode,
        },
        {
          id: 'haptic',
          icon: 'vibration',
          title: 'Haptic Feedback',
          type: 'toggle',
          value: hapticFeedback,
          onToggle: (val) => {
            setHapticFeedback(val);
            if (val) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          },
        },
        {
          id: 'biometrics',
          icon: 'fingerprint',
          title: 'Biometric Lock',
          type: 'toggle',
          value: biometrics,
          onToggle: setBiometrics,
        },
        {
          id: 'auto_sync',
          icon: 'sync',
          title: 'Auto-sync Data',
          type: 'toggle',
          value: autoSync,
          onToggle: setAutoSync,
        },
      ],
    },
    {
      title: 'Subscription',
      items: [
        {
          id: 'manage_subscription',
          icon: 'credit-card',
          title: 'Manage Subscription',
          subtitle: isPremium ? `${plan || 'Premium'} Plan` : 'Free Plan',
          type: 'link',
          onPress: () => navigation.navigate('Subscription' as never),
        },
        {
          id: 'restore_purchases',
          icon: 'restore',
          title: 'Restore Purchases',
          type: 'button',
          onPress: () => Alert.alert('Restoring...', 'Checking for previous purchases'),
        },
      ],
    },
    {
      title: 'Data & Privacy',
      items: [
        {
          id: 'export_data',
          icon: 'download',
          title: 'Export My Data',
          type: 'button',
          onPress: handleExportData,
        },
        {
          id: 'privacy_policy',
          icon: 'privacy-tip',
          title: 'Privacy Policy',
          type: 'link',
          onPress: () => openLink('https://ultramind.app/privacy'),
        },
        {
          id: 'terms',
          icon: 'description',
          title: 'Terms of Service',
          type: 'link',
          onPress: () => openLink('https://ultramind.app/terms'),
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help_center',
          icon: 'help',
          title: 'Help Center',
          type: 'link',
          onPress: () => openLink('https://ultramind.app/help'),
        },
        {
          id: 'contact_support',
          icon: 'mail',
          title: 'Contact Support',
          type: 'link',
          onPress: () => openLink('mailto:support@ultramind.app'),
        },
        {
          id: 'rate_app',
          icon: 'star',
          title: 'Rate UltraMind',
          type: 'link',
          onPress: () => {},
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          id: 'logout',
          icon: 'logout',
          title: 'Sign Out',
          type: 'button',
          onPress: handleLogout,
        },
        {
          id: 'delete_account',
          icon: 'delete-forever',
          title: 'Delete Account',
          type: 'button',
          dangerous: true,
          onPress: handleDeleteAccount,
        },
      ],
    },
  ];

  const renderItem = (item: SettingItem) => (
    <Pressable
      key={item.id}
      style={styles.settingItem}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        item.onPress?.();
      }}
      disabled={item.type === 'toggle'}
    >
      <View style={[styles.settingIcon, item.dangerous && styles.settingIconDangerous]}>
        <MaterialIcons 
          name={item.icon} 
          size={22} 
          color={item.dangerous ? theme.colors.semantic.error : theme.colors.primary} 
        />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, item.dangerous && styles.settingTitleDangerous]}>
          {item.title}
        </Text>
        {item.subtitle && (
          <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
        )}
      </View>
      {item.type === 'toggle' && (
        <Switch
          value={item.value}
          onValueChange={(val) => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            item.onToggle?.(val);
          }}
          trackColor={{ 
            false: 'rgba(255,255,255,0.1)', 
            true: `${theme.colors.primary}80` 
          }}
          thumbColor={item.value ? theme.colors.primary : '#888'}
        />
      )}
      {item.type === 'link' && (
        <MaterialIcons name="chevron-right" size={24} color={theme.colors.textMuted} />
      )}
    </Pressable>
  );

  return (
    <LinearGradient
      colors={['#0a1628', '#0d1f3c', '#0a1628']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <Header title="Settings" showBack />

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* App Version */}
          <View style={styles.versionHeader}>
            <View style={styles.appIcon}>
              <MaterialIcons name="psychology" size={32} color={theme.colors.primary} />
            </View>
            <Text style={styles.appName}>UltraMind</Text>
            <Text style={styles.versionText}>Version 1.0.0 (Build 1)</Text>
          </View>

          {sections.map((section) => (
            <View key={section.title} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Card variant="filled" style={styles.sectionCard}>
                {section.items.map((item, index) => (
                  <React.Fragment key={item.id}>
                    {renderItem(item)}
                    {index < section.items.length - 1 && <View style={styles.divider} />}
                  </React.Fragment>
                ))}
              </Card>
            </View>
          ))}

          <Text style={styles.footerText}>
            Made with 💙 by UltraMind Team
          </Text>
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
  versionHeader: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  appIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: 'rgba(19, 164, 236, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  appName: {
    fontSize: 20,
    fontFamily: 'Lexend-Bold',
    color: theme.colors.text,
  },
  versionText: {
    fontSize: 13,
    color: theme.colors.textMuted,
    fontFamily: 'Lexend-Regular',
    marginTop: 4,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Lexend-SemiBold',
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: theme.spacing.sm,
    marginLeft: theme.spacing.xs,
  },
  sectionCard: {
    padding: 0,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(19, 164, 236, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  settingIconDangerous: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontFamily: 'Lexend-Medium',
    color: theme.colors.text,
  },
  settingTitleDangerous: {
    color: theme.colors.semantic.error,
  },
  settingSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontFamily: 'Lexend-Regular',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginLeft: 68,
  },
  footerText: {
    fontSize: 13,
    color: theme.colors.textMuted,
    fontFamily: 'Lexend-Regular',
    textAlign: 'center',
    marginTop: theme.spacing.lg,
  },
});

export default SettingsScreen;
