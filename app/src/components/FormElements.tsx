import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';

// =============== Checkbox Component ===============
interface CheckboxProps {
  checked: boolean;
  onToggle: () => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onToggle,
  label,
  description,
  disabled = false,
  size = 'medium',
  style,
}) => {
  const handlePress = () => {
    if (!disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onToggle();
    }
  };

  const getSize = () => {
    switch (size) {
      case 'small':
        return 20;
      case 'large':
        return 28;
      default:
        return 24;
    }
  };

  const boxSize = getSize();

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={disabled}
      style={[styles.checkboxContainer, disabled && styles.disabled, style]}
    >
      <View
        style={[
          styles.checkbox,
          {
            width: boxSize,
            height: boxSize,
            borderRadius: BorderRadius.sm,
            backgroundColor: checked ? Colors.primary : 'transparent',
            borderColor: checked ? Colors.primary : Colors.borderLight,
          },
        ]}
      >
        {checked && (
          <MaterialIcons name="check" size={boxSize - 6} color={Colors.textLight} />
        )}
      </View>
      {(label || description) && (
        <View style={styles.labelContainer}>
          {label && <Text style={styles.checkboxLabel}>{label}</Text>}
          {description && (
            <Text style={styles.checkboxDescription}>{description}</Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

// =============== Toggle/Switch Component ===============
interface ToggleProps {
  enabled: boolean;
  onToggle: () => void;
  label?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

export const Toggle: React.FC<ToggleProps> = ({
  enabled,
  onToggle,
  label,
  disabled = false,
  style,
}) => {
  const translateX = useSharedValue(enabled ? 20 : 0);

  React.useEffect(() => {
    translateX.value = withSpring(enabled ? 20 : 0, {
      damping: 15,
      stiffness: 200,
    });
  }, [enabled]);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handlePress = () => {
    if (!disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onToggle();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      disabled={disabled}
      style={[styles.toggleContainer, disabled && styles.disabled, style]}
    >
      {label && <Text style={styles.toggleLabel}>{label}</Text>}
      <View
        style={[
          styles.toggleTrack,
          { backgroundColor: enabled ? Colors.primary : Colors.borderLight },
        ]}
      >
        <Animated.View style={[styles.toggleThumb, thumbStyle]} />
      </View>
    </TouchableOpacity>
  );
};

// =============== Radio Button Component ===============
interface RadioButtonProps {
  selected: boolean;
  onSelect: () => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

export const RadioButton: React.FC<RadioButtonProps> = ({
  selected,
  onSelect,
  label,
  description,
  disabled = false,
  style,
}) => {
  const handlePress = () => {
    if (!disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onSelect();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={disabled}
      style={[styles.radioContainer, disabled && styles.disabled, style]}
    >
      <View
        style={[
          styles.radio,
          {
            borderColor: selected ? Colors.primary : Colors.borderLight,
          },
        ]}
      >
        {selected && <View style={styles.radioInner} />}
      </View>
      {(label || description) && (
        <View style={styles.labelContainer}>
          {label && <Text style={styles.radioLabel}>{label}</Text>}
          {description && (
            <Text style={styles.radioDescription}>{description}</Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

// =============== Selection Card Component ===============
interface SelectionCardProps {
  selected: boolean;
  onSelect: () => void;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  variant?: 'checkbox' | 'radio';
  style?: ViewStyle;
}

export const SelectionCard: React.FC<SelectionCardProps> = ({
  selected,
  onSelect,
  title,
  description,
  icon,
  disabled = false,
  variant = 'radio',
  style,
}) => {
  const handlePress = () => {
    if (!disabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onSelect();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={disabled}
      style={[
        styles.selectionCard,
        selected && styles.selectionCardSelected,
        disabled && styles.disabled,
        style,
      ]}
    >
      {icon && <View style={styles.selectionIcon}>{icon}</View>}
      <View style={styles.selectionContent}>
        <Text style={[styles.selectionTitle, selected && styles.selectionTitleSelected]}>
          {title}
        </Text>
        {description && (
          <Text style={styles.selectionDescription}>{description}</Text>
        )}
      </View>
      {variant === 'checkbox' ? (
        <View
          style={[
            styles.checkbox,
            {
              width: 24,
              height: 24,
              borderRadius: BorderRadius.sm,
              backgroundColor: selected ? Colors.primary : 'transparent',
              borderColor: selected ? Colors.primary : Colors.borderLight,
            },
          ]}
        >
          {selected && (
            <MaterialIcons name="check" size={18} color={Colors.textLight} />
          )}
        </View>
      ) : (
        <View
          style={[
            styles.radio,
            {
              borderColor: selected ? Colors.primary : Colors.borderLight,
            },
          ]}
        >
          {selected && <View style={styles.radioInner} />}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Checkbox styles
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  checkbox: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelContainer: {
    flex: 1,
  },
  checkboxLabel: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.textPrimary,
  },
  checkboxDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  // Toggle styles
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLabel: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.textPrimary,
  },
  toggleTrack: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 2,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.textLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },

  // Radio styles
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  radioLabel: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.medium,
    color: Colors.textPrimary,
  },
  radioDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  // Selection Card styles
  selectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.xl,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: Spacing.lg,
  },
  selectionCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryFaded,
  },
  selectionIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionContent: {
    flex: 1,
  },
  selectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  selectionTitleSelected: {
    color: Colors.primary,
  },
  selectionDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 20,
  },

  // Common
  disabled: {
    opacity: 0.5,
  },
});

export { Checkbox, Toggle, RadioButton, SelectionCard };
