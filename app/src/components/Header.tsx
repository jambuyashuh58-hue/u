import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSizes, FontWeights } from '@/constants/theme';
import { useThemeStore } from '@/store';

interface HeaderProps {
  title: string;
  subtitle?: string;
  leftIcon?: 'arrow_back' | 'close' | 'menu' | null;
  rightIcon?: 'settings' | 'more_vert' | 'search' | 'calendar_today' | null;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  rightElement?: React.ReactNode;
  transparent?: boolean;
  centerTitle?: boolean;
  style?: ViewStyle;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  leftIcon = 'arrow_back',
  rightIcon,
  onLeftPress,
  onRightPress,
  rightElement,
  transparent = false,
  centerTitle = true,
  style,
}) => {
  const insets = useSafeAreaInsets();
  const { isDarkMode } = useThemeStore();

  const iconMap: Record<string, string> = {
    arrow_back: 'arrow-back',
    close: 'close',
    menu: 'menu',
    settings: 'settings',
    more_vert: 'more-vert',
    search: 'search',
    calendar_today: 'calendar-today',
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + Spacing.sm,
          backgroundColor: transparent
            ? 'transparent'
            : isDarkMode
            ? Colors.backgroundDark
            : Colors.backgroundLight,
        },
        style,
      ]}
    >
      <View style={styles.content}>
        {/* Left Button */}
        {leftIcon ? (
          <TouchableOpacity
            onPress={onLeftPress}
            style={styles.iconButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons
              name={iconMap[leftIcon] as any}
              size={24}
              color={isDarkMode ? Colors.textLight : Colors.textPrimary}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconPlaceholder} />
        )}

        {/* Title */}
        <View style={[styles.titleContainer, !centerTitle && styles.titleLeft]}>
          <Text
            style={[
              styles.title,
              { color: isDarkMode ? Colors.textLight : Colors.textPrimary },
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.subtitle}>{subtitle}</Text>
          )}
        </View>

        {/* Right Button */}
        {rightElement ? (
          rightElement
        ) : rightIcon ? (
          <TouchableOpacity
            onPress={onRightPress}
            style={styles.iconButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons
              name={iconMap[rightIcon] as any}
              size={24}
              color={isDarkMode ? Colors.textLight : Colors.textPrimary}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconPlaceholder} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleLeft: {
    alignItems: 'flex-start',
    marginLeft: Spacing.sm,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: FontWeights.bold,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSizes.xs,
    color: Colors.primary,
    fontWeight: FontWeights.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 2,
  },
});

export default Header;
