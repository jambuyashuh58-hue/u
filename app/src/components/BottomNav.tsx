import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { useThemeStore } from '@/store';

export interface NavItem {
  key: string;
  label: string;
  icon: string;
  filledIcon?: string;
}

interface BottomNavProps {
  items: NavItem[];
  activeKey: string;
  onItemPress: (key: string) => void;
  showLabels?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  items,
  activeKey,
  onItemPress,
  showLabels = true,
}) => {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useThemeStore();

  const handlePress = (key: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onItemPress(key);
  };

  return (
    <BlurView
      intensity={isDarkMode ? 40 : 80}
      tint={isDarkMode ? 'dark' : 'light'}
      style={[
        styles.container,
        {
          paddingBottom: Math.max(insets.bottom, Spacing.md),
          borderTopColor: isDarkMode ? Colors.borderDark : Colors.borderLight,
        },
      ]}
    >
      <View style={styles.content}>
        {items.map((item) => {
          const isActive = activeKey === item.key;
          return (
            <TouchableOpacity
              key={item.key}
              onPress={() => handlePress(item.key)}
              style={styles.item}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name={(isActive && item.filledIcon ? item.filledIcon : item.icon) as any}
                size={24}
                color={isActive ? Colors.primary : Colors.textMuted}
              />
              {showLabels && (
                <Text
                  style={[
                    styles.label,
                    { color: isActive ? Colors.primary : Colors.textMuted },
                  ]}
                >
                  {item.label}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xs,
    gap: 4,
  },
  label: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    letterSpacing: 0.2,
  },
});

export default BottomNav;
