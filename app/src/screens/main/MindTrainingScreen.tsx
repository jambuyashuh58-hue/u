import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { SafeContainer, Header, Toggle } from '@/components';
import { useMindTrainingStore } from '@/store';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';

interface MindTrainingScreenProps {
  navigation: any;
}

export const MindTrainingScreen: React.FC<MindTrainingScreenProps> = ({ navigation }) => {
  const {
    isSessionActive,
    currentPhase,
    remainingTime,
    cyclesCompleted,
    totalCycles,
    binauralBeatsEnabled,
    startSession,
    setPhase,
    setRemainingTime,
    completeCycle,
    endSession,
    toggleBinauralBeats,
  } = useMindTrainingStore();

  const [isPaused, setIsPaused] = useState(true);
  const breathAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const breathTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Breath timing (4-second inhale, 4-second exhale)
  const INHALE_DURATION = 4000;
  const EXHALE_DURATION = 4000;
  const BREATH_CYCLE = INHALE_DURATION + EXHALE_DURATION;

  useEffect(() => {
    startSession(12);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (breathTimerRef.current) clearTimeout(breathTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isPaused) {
      // Start breath animation
      startBreathCycle();
      
      // Start countdown timer
      timerRef.current = setInterval(() => {
        setRemainingTime(Math.max(0, remainingTime - 1));
      }, 1000);
    } else {
      // Stop animations
      breathAnim.stopAnimation();
      if (timerRef.current) clearInterval(timerRef.current);
      if (breathTimerRef.current) clearTimeout(breathTimerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (breathTimerRef.current) clearTimeout(breathTimerRef.current);
    };
  }, [isPaused]);

  const startBreathCycle = () => {
    // Inhale animation
    setPhase('inhale');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    Animated.timing(breathAnim, {
      toValue: 1,
      duration: INHALE_DURATION,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(() => {
      if (!isPaused) {
        // Exhale animation
        setPhase('exhale');
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        
        Animated.timing(breathAnim, {
          toValue: 0,
          duration: EXHALE_DURATION,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }).start(() => {
          if (!isPaused) {
            completeCycle();
            startBreathCycle();
          }
        });
      }
    });
  };

  const togglePause = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsPaused(!isPaused);
  };

  const handleEnd = () => {
    endSession();
    navigation.goBack();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const circleScale = breathAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.6, 1],
  });

  const circleOpacity = breathAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.6, 0.8],
  });

  const cyclesLeft = totalCycles - cyclesCompleted;

  return (
    <SafeContainer style={styles.container} backgroundColor="#f0f9ff">
      <Header
        title="Mind-Training"
        leftIcon="arrow_back"
        onLeftPress={handleEnd}
        rightIcon="more_vert"
      />

      <View style={styles.content}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>UltraMind Centering Exercise</Text>
          <Text style={styles.subtitle}>Coherent Breathing: 6 breaths/min</Text>
        </View>

        {/* Breathing Circle */}
        <View style={styles.breathContainer}>
          {/* Outer rings */}
          <View style={styles.outerRing3} />
          <View style={styles.outerRing2} />
          <View style={styles.outerRing1} />
          
          {/* Main animated circle */}
          <Animated.View
            style={[
              styles.breathCircle,
              {
                transform: [{ scale: circleScale }],
                opacity: circleOpacity,
              },
            ]}
          >
            <LinearGradient
              colors={['rgba(19, 164, 236, 0.2)', 'rgba(19, 164, 236, 0.05)']}
              style={styles.circleGradient}
            />
          </Animated.View>
          
          {/* Center text */}
          <View style={styles.breathText}>
            <Text style={styles.phaseText}>
              {currentPhase === 'inhale' ? 'Inhale' : 'Exhale'}
            </Text>
            <Text style={styles.secondsText}>4 SECONDS</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{formatTime(remainingTime)}</Text>
            <Text style={styles.statLabel}>REMAINING</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{cyclesLeft}</Text>
            <Text style={styles.statLabel}>CYCLES LEFT</Text>
          </View>
        </View>

        {/* Binaural Beats Control */}
        <View style={styles.binauralSection}>
          <View style={styles.binauralContent}>
            <MaterialIcons name="headphones" size={24} color={Colors.primary} />
            <View style={styles.binauralText}>
              <Text style={styles.binauralTitle}>Binaural Beats</Text>
              <Text style={styles.binauralSubtitle}>Alpha-Theta Entrainment</Text>
            </View>
          </View>
          <Toggle enabled={binauralBeatsEnabled} onToggle={toggleBinauralBeats} />
        </View>

        {/* Progress Slider */}
        <View style={styles.progressSection}>
          <View style={styles.progressTrack}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((600 - remainingTime) / 600) * 100}%` }
              ]} 
            />
            <View 
              style={[
                styles.progressThumb,
                { left: `${((600 - remainingTime) / 600) * 100}%` }
              ]}
            />
          </View>
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity style={styles.skipButton}>
            <MaterialIcons name="replay-10" size={28} color={Colors.textMuted} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.playButton}
            onPress={togglePause}
          >
            <MaterialIcons 
              name={isPaused ? 'play-arrow' : 'pause'} 
              size={36} 
              color={Colors.textLight} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.skipButton}>
            <MaterialIcons name="forward-10" size={28} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Tip */}
        <View style={styles.tipSection}>
          <MaterialIcons name="info-outline" size={16} color={Colors.textMuted} />
          <Text style={styles.tipText}>Synchronize breath with circle expansion</Text>
        </View>
      </View>
    </SafeContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    alignItems: 'center',
  },
  titleSection: {
    alignItems: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.xxl,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
  },
  breathContainer: {
    width: 280,
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.xxl,
  },
  outerRing1: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 2,
    borderColor: 'rgba(19, 164, 236, 0.2)',
  },
  outerRing2: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 1,
    borderColor: 'rgba(19, 164, 236, 0.1)',
  },
  outerRing3: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 1,
    borderColor: 'rgba(19, 164, 236, 0.05)',
  },
  breathCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  circleGradient: {
    flex: 1,
  },
  breathText: {
    position: 'absolute',
    alignItems: 'center',
  },
  phaseText: {
    fontSize: FontSizes.title,
    fontWeight: FontWeights.semibold,
    color: Colors.primary,
  },
  secondsText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    color: Colors.textMuted,
    letterSpacing: 1,
    marginTop: Spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.lg,
    marginBottom: Spacing.xxl,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.medium,
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginTop: Spacing.xs,
  },
  binauralSection: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceLight,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.xl,
  },
  binauralContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  binauralText: {
    gap: 2,
  },
  binauralTitle: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.textPrimary,
  },
  binauralSubtitle: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
  },
  progressSection: {
    width: '100%',
    marginBottom: Spacing.xxl,
  },
  progressTrack: {
    height: 4,
    backgroundColor: Colors.borderLight,
    borderRadius: 2,
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  progressThumb: {
    position: 'absolute',
    top: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    marginLeft: -6,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxl,
    marginBottom: Spacing.xxl,
  },
  skipButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  tipSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceLight,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
  },
  tipText: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
  },
});

export default MindTrainingScreen;
