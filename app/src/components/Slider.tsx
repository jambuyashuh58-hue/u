import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Dimensions,
  ViewStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';

interface SliderProps {
  value: number;
  onValueChange: (value: number) => void;
  minValue?: number;
  maxValue?: number;
  step?: number;
  label?: string;
  leftLabel?: string;
  rightLabel?: string;
  showValue?: boolean;
  trackHeight?: number;
  thumbSize?: number;
  activeColor?: string;
  inactiveColor?: string;
  style?: ViewStyle;
}

const SCREEN_WIDTH = Dimensions.get('window').width;

export const Slider: React.FC<SliderProps> = ({
  value,
  onValueChange,
  minValue = 1,
  maxValue = 10,
  step = 1,
  label,
  leftLabel,
  rightLabel,
  showValue = true,
  trackHeight = 8,
  thumbSize = 24,
  activeColor = Colors.primary,
  inactiveColor = Colors.primaryMuted,
  style,
}) => {
  const [trackWidth, setTrackWidth] = useState(SCREEN_WIDTH - Spacing.xl * 2);
  
  const normalizedValue = (value - minValue) / (maxValue - minValue);
  const thumbPosition = normalizedValue * (trackWidth - thumbSize);

  const translateX = useSharedValue(thumbPosition);

  const handleLayout = useCallback((event: any) => {
    const { width } = event.nativeEvent.layout;
    setTrackWidth(width);
    translateX.value = normalizedValue * (width - thumbSize);
  }, [normalizedValue, thumbSize]);

  const updateValue = useCallback((x: number) => {
    const clampedX = Math.max(0, Math.min(x, trackWidth - thumbSize));
    const newNormalizedValue = clampedX / (trackWidth - thumbSize);
    const newValue = minValue + newNormalizedValue * (maxValue - minValue);
    const steppedValue = Math.round(newValue / step) * step;
    const finalValue = Math.max(minValue, Math.min(maxValue, steppedValue));
    
    if (finalValue !== value) {
      Haptics.selectionAsync();
      onValueChange(finalValue);
    }
  }, [trackWidth, thumbSize, minValue, maxValue, step, value, onValueChange]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (_, gestureState) => {
      translateX.value = gestureState.x0 - thumbSize / 2;
    },
    onPanResponderMove: (_, gestureState) => {
      const newX = gestureState.moveX - thumbSize / 2;
      translateX.value = Math.max(0, Math.min(newX - Spacing.xl, trackWidth - thumbSize));
      runOnJS(updateValue)(translateX.value);
    },
    onPanResponderRelease: () => {
      translateX.value = withSpring(translateX.value);
    },
  });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const progressWidth = (value - minValue) / (maxValue - minValue) * 100;

  return (
    <View style={[styles.container, style]}>
      {(label || showValue) && (
        <View style={styles.header}>
          {label && <Text style={styles.label}>{label}</Text>}
          {showValue && (
            <Text style={styles.value}>
              {value}/{maxValue}
            </Text>
          )}
        </View>
      )}

      <View
        style={[styles.trackContainer, { height: trackHeight + thumbSize }]}
        onLayout={handleLayout}
        {...panResponder.panHandlers}
      >
        <View style={[styles.track, { height: trackHeight, backgroundColor: inactiveColor }]}>
          <View
            style={[
              styles.progress,
              {
                width: `${progressWidth}%`,
                height: trackHeight,
                backgroundColor: activeColor,
              },
            ]}
          />
        </View>
        <Animated.View
          style={[
            styles.thumb,
            {
              width: thumbSize,
              height: thumbSize,
              borderRadius: thumbSize / 2,
              backgroundColor: activeColor,
            },
            thumbStyle,
          ]}
        />
      </View>

      {(leftLabel || rightLabel) && (
        <View style={styles.labels}>
          <Text style={styles.endLabel}>{leftLabel}</Text>
          <Text style={styles.endLabel}>{rightLabel}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
  },
  value: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.primary,
  },
  trackContainer: {
    justifyContent: 'center',
    position: 'relative',
  },
  track: {
    width: '100%',
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
  },
  progress: {
    borderRadius: BorderRadius.full,
  },
  thumb: {
    position: 'absolute',
    top: '50%',
    marginTop: -12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  endLabel: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
  },
});

export default Slider;
