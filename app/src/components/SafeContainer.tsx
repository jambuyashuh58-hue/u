import React from 'react';
import { View, StyleSheet, ViewStyle, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { useThemeStore } from '@/store';

interface SafeContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  backgroundColor?: string;
  statusBarStyle?: 'light-content' | 'dark-content';
  withBottomNav?: boolean;
}

export const SafeContainer: React.FC<SafeContainerProps> = ({
  children,
  style,
  edges = ['top'],
  backgroundColor,
  statusBarStyle,
  withBottomNav = false,
}) => {
  const { isDarkMode } = useThemeStore();

  const bgColor = backgroundColor || (isDarkMode ? Colors.backgroundDark : Colors.backgroundLight);
  const barStyle = statusBarStyle || (isDarkMode ? 'light-content' : 'dark-content');

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: bgColor },
        withBottomNav && styles.withBottomNav,
        style,
      ]}
      edges={edges}
    >
      <StatusBar barStyle={barStyle} backgroundColor={bgColor} />
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  withBottomNav: {
    paddingBottom: 80,
  },
});

export default SafeContainer;
