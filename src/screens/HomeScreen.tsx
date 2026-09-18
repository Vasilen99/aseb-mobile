import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { useAppTheme } from '../theme';
import { useTabNavigation } from '../navigation/BottomNav';

export default function HomeScreen() {
  const { colors } = useAppTheme();
  const { goToTab } = useTabNavigation();

  const goToNews = () => goToTab('news');
  const goToEvents = () => goToTab('events');
  const goToLogin = () => goToTab('login');

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={styles.content}
    >
      {/* Hero */}
      <View style={[styles.hero, { backgroundColor: colors.primary }]}>
        <Text variant="headlineSmall" style={[styles.heroTitle, { color: colors.onPrimary }]}>
          Асоциация на собствениците на електромобили в България - АСЕБ
        </Text>
        <Text variant="bodyMedium" style={[styles.heroSubtitle, { color: colors.onPrimary }]}>
          Обединяваме хората, които вярват в чиста, тиха и достъпна мобилност.
          Заедно правим електромобилността в България по-лесна за всеки.
        </Text>
      </View>

      {/* Stats */}
      <Card style={styles.section} mode="elevated">
        <Card.Content style={styles.statsContent}>
          <Text variant="titleLarge" style={styles.statsNumber}>
            2000+
          </Text>
          <Text variant="titleMedium" style={styles.centerText}>
            Повече от 2000 членове в над 30 града в България
          </Text>
        </Card.Content>
      </Card>

      {/* Registration CTA #1 */}
      <Card style={styles.section} mode="outlined">
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Станете част от общността
          </Text>
          <Text variant="bodyMedium">
            Регистрирайте се, за да получавате новини, отстъпки от партньори и достъп до
            затворените групи на членовете.
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={goToLogin}>
            Регистрация / Вход
          </Button>
        </Card.Actions>
      </Card>

      {/* News */}
      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Новини и статии
        </Text>
        <Text variant="bodyMedium" style={styles.sectionText}>
          Актуални новини за електромобилността в България, позиции на АСЕБ по важни теми,
          полезни статии за зареждане, поддръжка и пътувания с електромобил.
        </Text>
        <Button mode="contained-tonal" onPress={goToNews} style={styles.ctaButton}>
          Всички новини
        </Button>
      </View>

      {/* Registration CTA #2 */}
      <Card style={[styles.section, { backgroundColor: colors.secondaryContainer }]} mode="contained">
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Имате електромобил или планирате да си купите?
          </Text>
          <Text variant="bodyMedium">
            Членовете ни споделят реален опит – разход, зареждане, сервиз и пътувания.
            Задайте въпрос и получете отговор от хора, които вече карат електрически.
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={goToLogin}>
            Присъединете се
          </Button>
        </Card.Actions>
      </Card>

      {/* Events */}
      <View style={styles.section}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          Събития
        </Text>
        <Text variant="bodyMedium" style={styles.sectionText}>
          АСЕБ организира регулярни срещи, тест-драйвове, пътувания и дискусии в различни градове
          на страната. Вижте предстоящите събития и се включете в живота на общността.
        </Text>
        <Button mode="contained-tonal" onPress={goToEvents} style={styles.ctaButton}>
          Всички събития
        </Button>
      </View>

      {/* Registration CTA #3 */}
      <Card style={styles.section} mode="outlined">
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Вашият глас има значение
          </Text>
          <Text variant="bodyMedium">
            АСЕБ работи с институции и оператори за по-добра зарядна инфраструктура и
            справедливи правила. Колкото повече сме, толкова по-силен е гласът ни.
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={goToLogin}>
            Станете член
          </Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: 32 },
  hero: { padding: 24, paddingTop: 32 },
  heroTitle: { fontWeight: '700', marginBottom: 12 },
  heroSubtitle: { opacity: 0.9 },
  section: { marginHorizontal: 16, marginTop: 16 },
  sectionTitle: { marginBottom: 8, fontWeight: '600' },
  sectionText: { marginBottom: 12, opacity: 0.85 },
  statsContent: { alignItems: 'center', paddingVertical: 8 },
  statsNumber: { fontWeight: '700', marginBottom: 4 },
  centerText: { textAlign: 'center' },
  ctaButton: { marginTop: 4, alignSelf: 'flex-start' },
});
