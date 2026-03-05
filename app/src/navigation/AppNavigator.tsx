import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { theme } from '@constants/theme';
import { useAuthStore, useOnboardingStore } from '@store';

// Onboarding Screens
import WelcomeScreen from '@screens/onboarding/WelcomeScreen';
import GoalSettingScreen from '@screens/onboarding/GoalSettingScreen';
import ChallengeSelectionScreen from '@screens/onboarding/ChallengeSelectionScreen';
import BaselineAssessmentScreen from '@screens/onboarding/BaselineAssessmentScreen';

// Main Screens
import DashboardScreen from '@screens/main/DashboardScreen';
import MorningCheckInScreen from '@screens/main/MorningCheckInScreen';
import MindTrainingScreen from '@screens/main/MindTrainingScreen';
import AICoachScreen from '@screens/main/AICoachScreen';
import SubscriptionScreen from '@screens/main/SubscriptionScreen';
import ProgressAnalyticsScreen from '@screens/main/ProgressAnalyticsScreen';
import SupplementPlannerScreen from '@screens/main/SupplementPlannerScreen';
import EmotionalDetoxScreen from '@screens/main/EmotionalDetoxScreen';
import SettingsScreen from '@screens/main/SettingsScreen';
import ProfileScreen from '@screens/main/ProfileScreen';

// Types
import type { RootStackParamList } from '@types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0d1f3c',
          borderTopColor: 'rgba(255,255,255,0.1)',
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: 24,
          height: 80,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
          marginTop: 4,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof MaterialIcons.glyphMap;
          
          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Program':
              iconName = 'assignment';
              break;
            case 'Insights':
              iconName = 'insights';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'circle';
          }
          
          return <MaterialIcons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Program" component={DashboardScreen} />
      <Tab.Screen name="Insights" component={ProgressAnalyticsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Main App Navigator
export function AppNavigator() {
  const { isAuthenticated } = useAuthStore();
  const { isCompleted: onboardingCompleted } = useOnboardingStore();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {/* Onboarding Flow */}
        {!onboardingCompleted && (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="GoalSetting" component={GoalSettingScreen} />
            <Stack.Screen name="ChallengeSelection" component={ChallengeSelectionScreen} />
            <Stack.Screen name="BaselineAssessment" component={BaselineAssessmentScreen} />
          </>
        )}

        {/* Main App */}
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        
        {/* Modal Screens */}
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen name="MorningCheckIn" component={MorningCheckInScreen} />
          <Stack.Screen name="MindTraining" component={MindTrainingScreen} />
          <Stack.Screen name="AICoach" component={AICoachScreen} />
          <Stack.Screen name="Subscription" component={SubscriptionScreen} />
          <Stack.Screen name="Supplements" component={SupplementPlannerScreen} />
          <Stack.Screen name="EmotionalDetox" component={EmotionalDetoxScreen} />
          <Stack.Screen name="ProgressAnalytics" component={ProgressAnalyticsScreen} />
        </Stack.Group>

        {/* Full Screen Modals */}
        <Stack.Group screenOptions={{ presentation: 'fullScreenModal' }}>
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
