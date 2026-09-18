import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import { useAuth } from '../auth/AuthContext';
import { useAppTheme } from '../theme';

interface SignUpScreenProps {
  onSwitchToLogin: () => void;
}

const MIN_PASSWORD_LENGTH = 6;

export default function SignUpScreen({ onSwitchToLogin }: SignUpScreenProps) {
  const { colors, spacing } = useAppTheme();
  const { register } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordTooShort = password.length > 0 && password.length < MIN_PASSWORD_LENGTH;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const canSubmit =
    username.trim().length > 0 &&
    password.length >= MIN_PASSWORD_LENGTH &&
    password === confirmPassword &&
    !submitting;

  const handleSignUp = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await register({ username, password });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign up failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: colors.background, padding: spacing.lg }]}
    >
      <Text variant="headlineMedium" style={{ marginBottom: spacing.lg }}>
Създай акаунт
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
        disabled={submitting}
      />

      <TextInput
        label="Парола"
        mode="outlined"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        textContentType="newPassword"
        error={passwordTooShort}
        right={
          <TextInput.Icon
            icon={showPassword ? 'eye-off' : 'eye'}
            onPress={() => setShowPassword(v => !v)}
          />
        }
        disabled={submitting}
      />
      <HelperText type="error" visible={passwordTooShort}>
        Паролата трябва да е поне {MIN_PASSWORD_LENGTH} символа
      </HelperText>

      <TextInput
        label="Потвърди паролата"
        mode="outlined"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={!showPassword}
        textContentType="newPassword"
        error={passwordsMismatch}
        onSubmitEditing={canSubmit ? handleSignUp : undefined}
        disabled={submitting}
      />
      <HelperText type="error" visible={passwordsMismatch}>
        Паролите не съвпадат
      </HelperText>

      <HelperText type="error" visible={!!error}>
        {error}
      </HelperText>

      <Button
        mode="contained"
        onPress={handleSignUp}
        loading={submitting}
        disabled={!canSubmit}
        style={{ marginTop: spacing.sm }}
      >
        Регистрация
      </Button>

      <View style={[styles.switchRow, { marginTop: spacing.lg }]}>
        <Text variant="bodyMedium" style={{ color: colors.onSurfaceVariant }}>
          Вече имате акаунт?
        </Text>
        <Button mode="text" compact onPress={onSwitchToLogin} disabled={submitting}>
          Вход
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
});
