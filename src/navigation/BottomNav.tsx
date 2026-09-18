import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Appbar, BottomNavigation } from 'react-native-paper';
import { useAuth } from '../auth/AuthContext';
import { useAppTheme } from '../theme';
import SettingsSheet from '../components/SettingsSheet';
import HomeScreen from '../screens/HomeScreen';
import NewsScreen from '../screens/NewsScreen';
import EventsScreen from '../screens/EventsScreen';
import LoginScreen from '../screens/LoginScreen';
import ProfileScreen from '../screens/ProfileScreen';

export type TabKey = 'home' | 'news' | 'events' | 'login' | 'profile';

type TabNavigationContextValue = { goToTab: (key: TabKey) => void };

const TabNavigationContext = createContext<TabNavigationContextValue>({ goToTab: () => {} });

export const useTabNavigation = () => useContext(TabNavigationContext);

const baseRoutes = [
  { key: 'home', title: 'Начало', focusedIcon: 'home', unfocusedIcon: 'home-outline' },
  { key: 'news', title: 'Новини', focusedIcon: 'newspaper-variant', unfocusedIcon: 'newspaper-variant-outline' },
  { key: 'events', title: 'Събития', focusedIcon: 'calendar', unfocusedIcon: 'calendar-outline' },
];

const loginRoute = { key: 'login', title: 'Вход', focusedIcon: 'login', unfocusedIcon: 'login' };
const profileRoute = { key: 'profile', title: 'Профил', focusedIcon: 'account', unfocusedIcon: 'account-outline' };

const renderScene = BottomNavigation.SceneMap({
  home: HomeScreen,
  news: NewsScreen,
  events: EventsScreen,
  login: LoginScreen,
  profile: ProfileScreen,
});

export default function BottomNav() {
  const { colors } = useAppTheme();
  const { isAuthenticated, isLoading } = useAuth();
  const [index, setIndex] = useState(0); // Home is default
  const [settingsOpen, setSettingsOpen] = useState(false);

  const routes = useMemo(
    () => [...baseRoutes, isAuthenticated ? profileRoute : loginRoute],
    [isAuthenticated],
  );

  const goToTab = useCallback(
    (key: TabKey) => {
      let i = routes.findIndex((r) => r.key === key);
      // 'login' and 'profile' occupy the same slot depending on auth state
      if (i < 0 && (key === 'login' || key === 'profile')) i = routes.length - 1;
      if (i >= 0) setIndex(i);
    },
    [routes],
  );

  const tabNavValue = useMemo(() => ({ goToTab }), [goToTab]);

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <TabNavigationContext.Provider value={tabNavValue}>
      <View style={styles.flex}>
        <Appbar.Header>
          <Appbar.Content title={routes[index]?.title ?? ''} />
          <Appbar.Action
            icon="cog-outline"
            accessibilityLabel="Settings"
            onPress={() => setSettingsOpen(true)}
          />
        </Appbar.Header>

        <BottomNavigation
          navigationState={{ index, routes }}
          onIndexChange={setIndex}
          renderScene={renderScene}
        />

        <SettingsSheet visible={settingsOpen} onDismiss={() => setSettingsOpen(false)} />
      </View>
    </TabNavigationContext.Provider>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
