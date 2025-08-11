// 型定義: YouTube検索・分析ツール

export type PlanType = 'free' | 'pro' | 'business';

export interface ApiKeyConfig {
  apiKey: string;
  updatedAtEpochMs: number;
}

export interface SearchFilters {
  minSubscriberCount?: number; // 最低登録者数
  minViewCount?: number; // 最低総再生回数
  openedWithinMonths?: number; // 直近Nヶ月以内（最大6）
}

export interface SearchRequest {
  keywords: string[]; // 最大5件
  filters: SearchFilters;
  pageLimit: number; // プランにより1〜5
  plan: PlanType;
}

export interface ChannelBasic {
  channelId: string;
  title: string;
  thumbnailUrl: string;
  subscriberCount: number;
  viewCount: number;
  publishedAt: string; // ISO8601
}

export interface ChannelKeywords {
  channelId: string;
  keywords: string[];
  collectedAtEpochMs: number;
}

export interface ChannelVideoTag {
  channelId: string;
  videoId: string;
  tags: string[];
  collectedAtEpochMs: number;
}

export interface QuotaStatus {
  estimatedUsedUnits: number;
  remainingUnitsEstimate: number;
  thresholdWarning: boolean;
}

export interface RateLimitConfig {
  maxConcurrent: number; // 同時実行数
  requestsPerSecond: number; // RPS上限
}

export interface SearchResultItem {
  channel: ChannelBasic;
  score?: number; // 並べ替え用（任意）
}

export interface SearchResponse {
  items: SearchResultItem[];
  nextPageToken?: string;
  quota: QuotaStatus;
  fromCache: boolean;
}

export interface CachedEntry<T> {
  key: string; // 正規化条件キー
  value: T;
  version: string; // キャッシュスキーマバージョン
  expiresAtEpochMs: number; // TTL 24h
}

export interface ApiError {
  code: string;
  message: string;
  retriable?: boolean;
}

// YouTube API（抜粋）
export interface YtSearchItem {
  id: { channelId?: string; videoId?: string };
  snippet: { channelTitle: string; publishedAt: string; thumbnails: { default?: { url: string }; medium?: { url: string }; high?: { url: string } } };
}

export interface YtChannelsItem {
  id: string;
  snippet: { title: string; thumbnails: { default?: { url: string }; medium?: { url: string }; high?: { url: string } }; publishedAt: string };
  statistics: { subscriberCount?: string; viewCount?: string };
}

export interface CsvExportOptions {
  includeWatermark: boolean; // toBはfalse
  delimiter?: ',' | ';' | '\t';
}
