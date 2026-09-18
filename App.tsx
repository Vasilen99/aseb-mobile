/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { ActivityIndicator, PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/auth/AuthContext';
import { SubscriptionProvider } from './src/subscription/SubscriptionContext';
import { SettingsProvider, useSettings } from './src/settings/SettingsContext';
import RootNavigator from './src/navigation/RootNavigator';
import { darkTheme, lightTheme } from './src/theme';
import SplashGate from './src/components/SplashGate';

function ThemedApp() {
  const { resolvedScheme } = useSettings();
  const isDark = resolvedScheme === 'dark';
  const theme = isDark ? darkTheme : lightTheme;

  const navTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme : DefaultTheme).colors,
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.background,
      text: theme.colors.onBackground,
      border: theme.colors.outline,
    },
  };

  // Preload the icon font so Paper icons don't render as empty squares.
  const [fontsLoaded] = useFonts(MaterialCommunityIcons.font);

  return (
    <PaperProvider theme={theme}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <AuthProvider>
        <SubscriptionProvider>
          {fontsLoaded ? (
            <SplashGate>
              <NavigationContainer theme={navTheme}>
                <RootNavigator />
              </NavigationContainer>
            </SplashGate>
          ) : (
            <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
              <ActivityIndicator size="large" />
            </View>
          )}
        </SubscriptionProvider>
      </AuthProvider>
    </PaperProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <ThemedApp />
      </SettingsProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
