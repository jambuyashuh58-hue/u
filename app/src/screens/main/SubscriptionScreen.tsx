import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeContainer, Button, Header, Card } from '@/components';
import { useSubscriptionStore } from '@/store';
import { Colors, Spacing, FontSizes, FontWeights, BorderRadius, Shadows } from '@/constants/theme';

interface SubscriptionScreenProps {
  navigation: any;
}

type PlanType = 'monthly' | 'yearly' | 'quarterly';

interface PlanOption {
  id: PlanType;
  name: string;
  price: string;
  period: string;
  equivalent?: string;
  features: string[];
  popular?: boolean;
  savings?: string;
}

const PLANS: PlanOption[] = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: '$19.99',
    period: '/mo',
    features: ['Billed monthly', 'Cancel anytime'],
  },
  {
    id: 'yearly',
    name: 'Yearly (Best Value - 40% Off)',
    price: '$119.99',
    period: '/yr',
    equivalent: 'Equivalent to $9.99/mo',
    features: ['Billed annually', 'Priority support', 'Save 40% vs Monthly'],
    popular: true,
    savings: '40%',
  },
  {
    id: 'quarterly',
    name: 'Quarterly',
    price: '$49.99',
    period: '/3-mo',
    features: ['Billed every 3 months', 'Quarterly progress reports'],
  },
];

export const SubscriptionScreen: React.FC<SubscriptionScreenProps> = ({ navigation }) => {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('yearly');
  const { setPremium } = useSubscriptionStore();

  const handleSubscribe = async () => {
    // In real app, this would trigger RevenueCat purchase flow
    try {
      // Simulate purchase
      setPremium(true, selectedPlan, new Date(Date.now() + 365 * 24 * 60 * 60 * 1000));
      navigation.goBack();
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };

  const handleRestore = async () => {
    // Trigger RevenueCat restore purchases
    console.log('Restoring purchases...');
  };

  return (
    <SafeContainer style={styles.container}>
      <Header
        title="Choose Your Plan"
        leftIcon="close"
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.logoIcon}>
            <MaterialIcons name="psychology" size={32} color={Colors.textLight} />
          </View>
          <Text style={styles.title}>Unlock Full Access to UltraMind</Text>
          <Text style={styles.subtitle}>
            Optimize your brain health with daily wellness routines and neuro-nutrition guidance.
          </Text>
        </View>

        {/* Plan Options */}
        <View style={styles.plansContainer}>
          {PLANS.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            return (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planCard,
                  isSelected && styles.planCardSelected,
                  plan.popular && styles.planCardPopular,
                ]}
                onPress={() => setSelectedPlan(plan.id)}
                activeOpacity={0.8}
              >
                {plan.popular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>MOST POPULAR</Text>
                  </View>
                )}
                
                <View style={styles.planHeader}>
                  <Text style={[
                    styles.planName,
                    isSelected && plan.popular && styles.planNameSelected,
                  ]}>
                    {plan.name}
                  </Text>
                </View>
                
                <View style={styles.priceRow}>
                  <Text style={[
                    styles.price,
                    isSelected && plan.popular && styles.priceSelected,
                  ]}>
                    {plan.price}
                  </Text>
                  <Text style={[
                    styles.period,
                    isSelected && plan.popular && styles.periodSelected,
                  ]}>
                    {plan.period}
                  </Text>
                </View>
                
                {plan.equivalent && (
                  <Text style={[
                    styles.equivalent,
                    isSelected && plan.popular && styles.equivalentSelected,
                  ]}>
                    {plan.equivalent}
                  </Text>
                )}
                
                <View style={styles.features}>
                  {plan.features.map((feature, index) => (
                    <View key={index} style={styles.featureRow}>
                      <MaterialIcons
                        name="check-circle"
                        size={18}
                        color={plan.popular && isSelected ? Colors.textLight : Colors.primary}
                      />
                      <Text style={[
                        styles.featureText,
                        plan.popular && isSelected && styles.featureTextSelected,
                      ]}>
                        {feature}
                      </Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomSection}>
        <Button
          title="Subscribe Now"
          onPress={handleSubscribe}
          size="large"
        />
        
        <Text style={styles.disclaimer}>
          By subscribing, you agree to our terms. Subscription automatically renews unless 
          cancelled 24 hours before the end of the current period.
        </Text>
        
        <TouchableOpacity onPress={handleRestore} style={styles.restoreButton}>
          <Text style={styles.restoreText}>Restore Purchase</Text>
        </TouchableOpacity>
        
        <View style={styles.legalLinks}>
          <TouchableOpacity>
            <Text style={styles.legalLink}>Terms of Service</Text>
          </TouchableOpacity>
          <Text style={styles.legalDivider}>•</Text>
          <TouchableOpacity>
            <Text style={styles.legalLink}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.xl,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  logoIcon: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSizes.title,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  plansContainer: {
    gap: Spacing.lg,
  },
  planCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 2,
    borderColor: Colors.borderLight,
  },
  planCardSelected: {
    borderColor: Colors.primary,
  },
  planCardPopular: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    ...Shadows.primary,
  },
  popularBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.textLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.md,
  },
  popularText: {
    fontSize: FontSizes.xs,
    fontWeight: FontWeights.bold,
    color: Colors.primary,
    letterSpacing: 0.5,
  },
  planHeader: {
    marginBottom: Spacing.sm,
  },
  planName: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  planNameSelected: {
    color: Colors.textLight,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.xs,
  },
  price: {
    fontSize: FontSizes.hero,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
  },
  priceSelected: {
    color: Colors.textLight,
  },
  period: {
    fontSize: FontSizes.lg,
    color: Colors.textSecondary,
    marginLeft: Spacing.xs,
  },
  periodSelected: {
    color: 'rgba(255,255,255,0.8)',
  },
  equivalent: {
    fontSize: FontSizes.sm,
    color: Colors.primary,
    fontWeight: FontWeights.medium,
    marginBottom: Spacing.md,
  },
  equivalentSelected: {
    color: 'rgba(255,255,255,0.9)',
  },
  features: {
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  featureText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
  featureTextSelected: {
    color: 'rgba(255,255,255,0.9)',
  },
  bottomSection: {
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxl,
    backgroundColor: Colors.backgroundLight,
  },
  disclaimer: {
    fontSize: FontSizes.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.lg,
    lineHeight: 18,
  },
  restoreButton: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    marginTop: Spacing.md,
  },
  restoreText: {
    fontSize: FontSizes.md,
    fontWeight: FontWeights.semibold,
    color: Colors.primary,
  },
  legalLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  legalLink: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
  },
  legalDivider: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
  },
});

export default SubscriptionScreen;
