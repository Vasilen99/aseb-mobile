/**
 * Types for the WordPress REST API v2 `/wp/v2/posts` response.
 * Source: https://aseb.bg/wp-json/wp/v2/posts?categories=10
 */

export type WPPostStatus = 'publish' | 'future' | 'draft' | 'pending' | 'private';
export type WPPostFormat =
  | 'standard'
  | 'aside'
  | 'chat'
  | 'gallery'
  | 'link'
  | 'image'
  | 'quote'
  | 'status'
  | 'video'
  | 'audio';
export type WPCommentStatus = 'open' | 'closed';
export type WPPingStatus = 'open' | 'closed';

/** WordPress "rendered" field wrapper, e.g. title, excerpt. */
export interface WPRendered {
  rendered: string;
  /** Present on `title` and `excerpt` / `content`. */
  protected?: boolean;
}

export interface WPGuid {
  rendered: string;
}

export interface WPLink {
  href: string;
  embeddable?: boolean;
  templated?: boolean;
  /** Present in `wp:term` links */
  taxonomy?: string;
  /** Present in `curies` */
  name?: string;
}

export interface WPCurie {
  name: string;
  href: string;
  templated: boolean;
}

export interface WPPostLinks {
  self: WPLink[];
  collection: WPLink[];
  about: WPLink[];
  author: WPLink[];
  replies: WPLink[];
  'version-history': (WPLink & { count: number })[];
  'predecessor-version'?: (WPLink & { id: number })[];
  'wp:featuredmedia'?: WPLink[];
  'wp:attachment': WPLink[];
  'wp:term': WPLink[];
  curies: WPCurie[];
}

/** Yoast SEO adds this block when the plugin is installed. Optional. */
export interface WPYoastHeadJson {
  title?: string;
  description?: string;
  robots?: Record<string, string>;
  canonical?: string;
  og_locale?: string;
  og_type?: string;
  og_title?: string;
  og_description?: string;
  og_url?: string;
  og_site_name?: string;
  article_published_time?: string;
  article_modified_time?: string;
  og_image?: { url: string; width?: number; height?: number; type?: string }[];
  author?: string;
  twitter_card?: string;
  schema?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface WPMediaSize {
  file: string;
  width: number;
  height: number;
  mime_type: string;
  source_url: string;
}

export interface WPFeaturedMedia {
  id: number;
  source_url: string;
  alt_text?: string;
  media_details?: {
    width?: number;
    height?: number;
    sizes?: Record<string, WPMediaSize>;
  };
}

export interface WPEmbeddedTerm {
  id: number;
  name: string;
  slug: string;
  taxonomy: 'category' | 'post_tag' | string;
}

export interface WPEmbedded {
  'wp:featuredmedia'?: WPFeaturedMedia[];
  /** Array of term arrays: index 0 = categories, 1 = tags */
  'wp:term'?: WPEmbeddedTerm[][];
  author?: { id: number; name: string }[];
}

export interface WPPost {
  id: number;
  /** ISO 8601 in site timezone, e.g. "2024-05-14T10:12:00" */
  date: string;
  /** ISO 8601 in GMT */
  date_gmt: string;
  guid: WPGuid;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: WPPostStatus;
  type: 'post' | string;
  link: string;
  title: WPRendered;
  content: WPRendered;
  excerpt: WPRendered;
  /** Author user ID */
  author: number;
  /** Featured media attachment ID, 0 if none */
  featured_media: number;
  comment_status: WPCommentStatus;
  ping_status: WPPingStatus;
  sticky: boolean;
  template: string;
  format: WPPostFormat;
  meta: Record<string, unknown> | unknown[];
  /** Category IDs */
  categories: number[];
  /** Tag IDs */
  tags: number[];
  /** Added by some themes/plugins */
  class_list?: string[];
  yoast_head?: string;
  yoast_head_json?: WPYoastHeadJson;
  _links: WPPostLinks;
  /** Present when fetched with `_embed`. */
  _embedded?: WPEmbedded;
}

export type WPPostsResponse = WPPost[];
