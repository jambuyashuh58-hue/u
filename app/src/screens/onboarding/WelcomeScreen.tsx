import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeContainer, Button } from '@/components';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius } from '@/constants/theme';

const { width, height } = Dimensions.get('window');

interface WelcomeScreenProps {
  navigation: any;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  return (
    <SafeContainer
      backgroundColor={Colors.backgroundLight}
      style={styles.container}
      edges={['top', 'bottom']}
    >
      {/* Close Button */}
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons name="close" size={24} color={Colors.textPrimary} />
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <MaterialIcons name="psychology" size={32} color={Colors.textLight} />
        </View>
        <Text style={styles.appName}>UltraMind Companion</Text>
      </View>

      {/* Hero Image */}
      <View style={styles.imageContainer}>
        <LinearGradient
          colors={['#f5f5dc', '#d4c4a8']}
          style={styles.imagePlaceholder}
        >
          {/* This would be replaced with actual image */}
          <View style={styles.shadowShapes}>
            <View style={styles.triangle} />
            <View style={styles.triangle2} />
          </View>
          <View style={styles.plantIcon}>
            <MaterialIcons name="eco" size={60} color="#2d5a27" />
          </View>
        </LinearGradient>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Optimize Your Brain Health</Text>
        <Text style={styles.description}>
          Start your journey to mental clarity and vitality with the UltraMind Solution. 
          A comprehensive approach to wellness.
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          title="Get Started"
          onPress={() => navigation.navigate('GoalSetting')}
          size="large"
        />
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.loginLink}
        >
          <Text style={styles.loginText}>
            Already have an account? <Text style={styles.loginHighlight}>Log In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f9f4', // Soft mint background
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    left: Spacing.lg,
    zIndex: 10,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    paddingTop: Spacing.huge,
  },
  logoContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  appName: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: Spacing.xxl,
    marginHorizontal: Spacing.xl,
  },
  imagePlaceholder: {
    width: width - Spacing.xl * 2,
    height: height * 0.35,
    borderRadius: BorderRadius.xxl,
    overflow: 'hidden',
    position: 'relative',
  },
  shadowShapes: {
    position: 'absolute',
    top: '30%',
    left: '20%',
    right: '20%',
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 60,
    borderRightWidth: 60,
    borderBottomWidth: 100,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(255,255,255,0.3)',
    position: 'absolute',
    left: 20,
  },
  triangle2: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 50,
    borderRightWidth: 50,
    borderBottomWidth: 80,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(255,255,255,0.2)',
    position: 'absolute',
    right: 0,
    top: 20,
  },
  plantIcon: {
    position: 'absolute',
    bottom: Spacing.xxl,
    left: Spacing.xxl,
  },
  content: {
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.xxxl,
    alignItems: 'center',
  },
  title: {
    fontSize: FontSizes.title,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  description: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  actions: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.xxxl,
  },
  loginLink: {
    marginTop: Spacing.xl,
    alignItems: 'center',
  },
  loginText: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
  },
  loginHighlight: {
    color: Colors.primary,
    fontWeight: FontWeights.semibold,
  },
});

export default WelcomeScreen;
