import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Modal, Portal, SegmentedButtons, Text } from 'react-native-paper';
import { useAppTheme } from '../theme';
import { useSettings } from '../settings/SettingsContext';
import type { ThemeMode } from '../settings/storage';

interface SettingsSheetProps {
  visible: boolean;
  onDismiss: () => void;
}

export default function SettingsSheet({ visible, onDismiss }: SettingsSheetProps) {
  const { colors, spacing, radius } = useAppTheme();
  const { themeMode, setThemeMode } = useSettings();

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={{
          backgroundColor: colors.surface,
          borderRadius: radius.lg,
          margin: spacing.md,
          padding: spacing.lg,
        }}
      >
        <View style={styles.header}>
          <Text variant="titleLarge">Настройки</Text>
          <IconButton icon="close" onPress={onDismiss} />
        </View>

        <Text variant="labelLarge" style={{ marginBottom: spacing.sm }}>
          Изглед на приложението
        </Text>
        <SegmentedButtons
          value={themeMode}
          onValueChange={v => setThemeMode(v as ThemeMode)}
          buttons={[
            { value: 'light', label: 'Светла', icon: 'white-balance-sunny' },
            { value: 'dark', label: 'Тъмна', icon: 'weather-night' },
          ]}
        />
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
