import type { WPPost, WPPostsResponse } from '../types/wordpress';

const BASE_URL = 'https://aseb.bg/wp-json/wp/v2';
export const NEWS_CATEGORY_ID = 11;
export const EVENTS_CATEGORY_ID = 10;

export interface FetchPostsParams {
  categories?: number;
  page?: number;
  perPage?: number;
}

export async function fetchPosts({
  categories = NEWS_CATEGORY_ID,
  page = 1,
  perPage = 20,
}: FetchPostsParams = {}): Promise<WPPost[]> {
  const params = new URLSearchParams({
    categories: String(categories),
    page: String(page),
    per_page: String(perPage),
    _embed: 'wp:featuredmedia,wp:term',
  });

  const response = await fetch(`${BASE_URL}/posts?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as WPPostsResponse;
}

/** Decode common HTML entities WordPress leaves in `title.rendered`. */
export function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8216;/g, '‘')
    .replace(/&#8217;/g, '’')
    .replace(/&#8220;/g, '“')
    .replace(/&#8221;/g, '”')
    .replace(/&#8230;/g, '…')
    .replace(/&nbsp;/g, ' ');
}

/** Remove HTML tags and collapse whitespace. */
export function stripHtml(html: string): string {
  return decodeHtmlEntities(html.replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ')
    .replace(/\[…\]|\[&hellip;\]/g, '…')
    .trim();
}

/** Best available featured image URL for a post (prefers medium_large/large). */
export function getFeaturedImage(post: WPPost): string | null {
  const media = post._embedded?.['wp:featuredmedia']?.[0];
  if (!media) return null;
  const sizes = media.media_details?.sizes;
  return (
    sizes?.medium_large?.source_url ??
    sizes?.large?.source_url ??
    sizes?.medium?.source_url ??
    media.source_url ??
    null
  );
}

/** Category names attached to the post (from `_embed`). */
export function getCategoryNames(post: WPPost): string[] {
  const terms = post._embedded?.['wp:term']?.flat() ?? [];
  return terms.filter(t => t.taxonomy === 'category').map(t => decodeHtmlEntities(t.name));
}

export function formatPostDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
