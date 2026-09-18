import React, { useLayoutEffect, useMemo } from 'react';
import { Image, Linking, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import RenderHtml, { type MixedStyleDeclaration, type MixedStyleRecord } from 'react-native-render-html';
import { useAppTheme } from '../theme';
import type { WPPost } from '../types/wordpress';

/** Heading colour used on the website, with a lighter counterpart for dark mode. */
const HEADING_LIGHT = '#4b567d';
const HEADING_DARK = '#aab4dd';

/** Root stack param list. Extend with your other screens as needed. */
export type RootStackParamList = {
  Home: undefined;
  PostDetail: { post: WPPost };
};

export type PostDetailRouteProp = RouteProp<RootStackParamList, 'PostDetail'>;
export type PostDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PostDetail'>;

function decodeEntities(html: string): string {
  return html
    .replace(/&amp;/g, '&')
    .replace(/&#8217;/g, '’')
    .replace(/&#8216;/g, '‘')
    .replace(/&#8220;/g, '“')
    .replace(/&#8221;/g, '”')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&nbsp;/g, ' ')
    .replace(/<[^>]+>/g, '');
}

interface ArticleStyles {
  base: MixedStyleDeclaration;
  tags: MixedStyleRecord;
  classes: MixedStyleRecord;
}

function buildArticleStyles(
  colors: ReturnType<typeof useAppTheme>['colors'],
  isDark: boolean,
  spacing: ReturnType<typeof useAppTheme>['spacing'],
): ArticleStyles {
  const heading = isDark ? HEADING_DARK : HEADING_LIGHT;
  const headingBase: MixedStyleDeclaration = {
    color: heading,
    fontWeight: '700',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  };

  return {
    base: { color: colors.onBackground, fontSize: 16, lineHeight: 26 },
    tags: {
      p: { marginTop: 0, marginBottom: spacing.md },
      h1: { ...headingBase, fontSize: 28, lineHeight: 34 },
      h2: { ...headingBase, fontSize: 24, lineHeight: 30 },
      h3: { ...headingBase, fontSize: 20, lineHeight: 26 },
      h4: { ...headingBase, fontSize: 18, lineHeight: 24 },
      h5: { ...headingBase, fontSize: 16, lineHeight: 22 },
      h6: { ...headingBase, fontSize: 14, lineHeight: 20, textTransform: 'uppercase' },
      strong: { fontWeight: '700', color: colors.onBackground },
      b: { fontWeight: '700' },
      em: { fontStyle: 'italic' },
      a: { color: colors.primary, textDecorationLine: 'underline' },
      ul: { marginTop: 0, marginBottom: spacing.md, paddingLeft: spacing.lg },
      ol: { marginTop: 0, marginBottom: spacing.md, paddingLeft: spacing.lg },
      li: { marginBottom: spacing.xs, lineHeight: 26 },
      blockquote: {
        borderLeftWidth: 4,
        borderLeftColor: heading,
        paddingLeft: spacing.md,
        marginLeft: 0,
        marginRight: 0,
        marginBottom: spacing.md,
        fontStyle: 'italic',
        color: colors.onSurfaceVariant,
      },
      hr: { backgroundColor: colors.outlineVariant, height: 1, marginVertical: spacing.lg },
      img: { borderRadius: 8, marginBottom: spacing.md },
      figure: { marginLeft: 0, marginRight: 0, marginBottom: spacing.md },
      figcaption: {
        fontSize: 13,
        lineHeight: 18,
        color: colors.onSurfaceVariant,
        textAlign: 'center',
        marginTop: spacing.xs,
      },
      table: { borderWidth: 1, borderColor: colors.outlineVariant, marginBottom: spacing.md },
      th: { fontWeight: '700', color: heading, padding: spacing.sm, backgroundColor: colors.surfaceVariant },
      td: { padding: spacing.sm, borderTopWidth: 1, borderTopColor: colors.outlineVariant },
      code: {
        fontFamily: 'monospace',
        backgroundColor: colors.surfaceVariant,
        paddingHorizontal: 4,
        borderRadius: 4,
      },
      pre: {
        fontFamily: 'monospace',
        backgroundColor: colors.surfaceVariant,
        padding: spacing.md,
        borderRadius: 8,
        marginBottom: spacing.md,
      },
    },
    classes: {
      // WordPress block editor helpers
      'has-text-align-center': { textAlign: 'center' },
      'has-text-align-right': { textAlign: 'right' },
      'has-text-align-left': { textAlign: 'left' },
      'wp-block-quote': { borderLeftColor: heading },
      'wp-block-separator': { backgroundColor: colors.outlineVariant },
      'wp-block-button__link': {
        backgroundColor: colors.primary,
        color: colors.onPrimary,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: 8,
        textDecorationLine: 'none',
        fontWeight: '600',
      },
      'has-small-font-size': { fontSize: 13 },
      'has-large-font-size': { fontSize: 20 },
    },
  };
}

interface ArticleBodyProps {
  html: string;
  contentWidth: number;
}

function ArticleBody({ html, contentWidth }: ArticleBodyProps) {
  const { colors, spacing } = useAppTheme();
  const { dark } = useTheme();

  const styles = useMemo(() => buildArticleStyles(colors, dark, spacing), [colors, dark, spacing]);

  return (
    <RenderHtml
      contentWidth={contentWidth}
      source={{ html }}
      baseStyle={styles.base}
      tagsStyles={styles.tags}
      classesStyles={styles.classes}
      // WP inserts fixed width/height attrs on images; ignore them so images scale to the screen.
      ignoredStyles={['width', 'height', 'fontFamily']}
      renderersProps={{
        img: { enableExperimentalPercentWidth: true },
        a: { onPress: (_e, href) => Linking.openURL(href).catch(() => {}) },
      }}
      defaultTextProps={{ selectable: true }}
      enableExperimentalMarginCollapsing
      enableExperimentalBRCollapsing
    />
  );
}

export default function PostDetailScreen() {
  const { params } = useRoute<PostDetailRouteProp>();
  const navigation = useNavigation<PostDetailNavigationProp>();
  const { post } = params;
  const { colors, spacing } = useAppTheme();
  const { dark } = useTheme();
  const { width } = useWindowDimensions();

  const title = decodeEntities(post.title.rendered);

  useLayoutEffect(() => {
    navigation.setOptions({ title });
  }, [navigation, title]);

  const featuredImage = (post as any)._embedded?.['wp:featuredmedia']?.[0]?.source_url as
    | string
    | undefined;

  const date = new Date(post.date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: spacing.xl }}
      showsVerticalScrollIndicator={false}
    >
      {featuredImage ? (
        <Image source={{ uri: featuredImage }} style={styles.hero} resizeMode="cover" />
      ) : null}

      <View style={{ paddingHorizontal: spacing.md, paddingTop: spacing.md }}>
        <Text
          variant="headlineSmall"
          style={{ marginBottom: spacing.xs, color: dark ? HEADING_DARK : HEADING_LIGHT, fontWeight: '700' }}
        >
          {title}
        </Text>
        <Text
          variant="bodySmall"
          style={{ color: colors.onSurfaceVariant, marginBottom: spacing.md }}
        >
          {date}
        </Text>

        <ArticleBody html={post.content.rendered} contentWidth={width - spacing.md * 2} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hero: { width: '100%', aspectRatio: 16 / 9 },
});
