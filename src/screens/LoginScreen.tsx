import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import { useAuth } from '../auth/AuthContext';
import { useAppTheme } from '../theme';
import SignUpScreen from './SignUpScreen';

export default function LoginScreen() {
  const { colors, spacing } = useAppTheme();
  const { login } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = username.trim().length > 0 && password.length > 0 && !submitting;

  const handleLogin = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await login({ username, password });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (mode === 'signup') {
    return <SignUpScreen onSwitchToLogin={() => setMode('login')} />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: colors.background, padding: spacing.lg }]}
    >
      <Text variant="headlineMedium" style={{ marginBottom: spacing.lg }}>
        Вход
      </Text>

      <TextInput
        label="Потребителско име"
        mode="outlined"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="username"
        style={{ marginBottom: spacing.md }}
      />

      <TextInput
        label="Парола"
        mode="outlined"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        textContentType="password"
        right={
          <TextInput.Icon
            icon={showPassword ? 'eye-off' : 'eye'}
            onPress={() => setShowPassword(v => !v)}
          />
        }
        onSubmitEditing={canSubmit ? handleLogin : undefined}
      />

      <HelperText type="error" visible={!!error}>
        {error}
      </HelperText>

      <Button
        mode="contained"
        onPress={handleLogin}
        loading={submitting}
        disabled={!canSubmit}
        style={{ marginTop: spacing.sm }}
      >
        Вход
      </Button>

      <View style={[styles.switchRow, { marginTop: spacing.lg }]}>
        <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
          Нямате акаунт?
        </Text>
        <Button mode="text" compact onPress={() => setMode('signup')} disabled={submitting}>
          Регистрация
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
});
