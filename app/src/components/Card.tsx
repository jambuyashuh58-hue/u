import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import { Colors, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useThemeStore } from '@/store';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  fillColor?: string;
  onPress?: () => void;
  padding?: keyof typeof Spacing | number;
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'default',
  fillColor,
  onPress,
  padding = 'lg',
}) => {
  const { isDarkMode } = useThemeStore();

  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: BorderRadius.xl,
      padding: typeof padding === 'string' ? Spacing[padding] : padding,
      backgroundColor: isDarkMode ? Colors.cardDark : Colors.cardLight,
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyle,
          ...Shadows.md,
        };
      case 'outlined':
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: isDarkMode ? Colors.borderDark : Colors.borderLight,
        };
      case 'filled':
        return {
          ...baseStyle,
          backgroundColor: fillColor || Colors.primaryFaded,
        };
      default:
        return {
          ...baseStyle,
          borderWidth: 1,
          borderColor: isDarkMode ? Colors.borderDark : Colors.borderLight,
        };
    }
  };

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={[getCardStyle(), style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[getCardStyle(), style]}>{children}</View>;
};

export default Card;
