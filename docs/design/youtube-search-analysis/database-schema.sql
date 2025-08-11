-- データベーススキーマ（参考DDL）
-- MVPはブラウザIndexedDBで完結。以下は将来の共有キャッシュ/監査向けRDB設計の対応表。

-- 1) チャンネル基本情報（24hキャッシュ）
CREATE TABLE IF NOT EXISTS channel_basic (
    channel_id VARCHAR(64) PRIMARY KEY,
    title TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    subscriber_count BIGINT NOT NULL,
    view_count BIGINT NOT NULL,
    published_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_channel_basic_expires ON channel_basic(expires_at);
CREATE INDEX IF NOT EXISTS idx_channel_basic_updated ON channel_basic(updated_at);

-- 2) チャンネル関連キーワード（24hキャッシュ）
CREATE TABLE IF NOT EXISTS channel_keywords (
    channel_id VARCHAR(64) NOT NULL,
    keyword TEXT NOT NULL,
    collected_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(channel_id, keyword)
);
CREATE INDEX IF NOT EXISTS idx_channel_keywords_collected ON channel_keywords(collected_at);

-- 3) 動画タグ（24hキャッシュ）
CREATE TABLE IF NOT EXISTS channel_video_tags (
    channel_id VARCHAR(64) NOT NULL,
    video_id VARCHAR(64) NOT NULL,
    tag TEXT NOT NULL,
    collected_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(channel_id, video_id, tag)
);
CREATE INDEX IF NOT EXISTS idx_video_tags_collected ON channel_video_tags(collected_at);

-- 4) 検索キャッシュ（条件キーでヒット）
CREATE TABLE IF NOT EXISTS search_cache (
    cache_key TEXT PRIMARY KEY,
    payload JSONB NOT NULL,
    version TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_search_cache_expires ON search_cache(expires_at);

-- TTL運用はスケジューラでexpires_at < now()を削除。
