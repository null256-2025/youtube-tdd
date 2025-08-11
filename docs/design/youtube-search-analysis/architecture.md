# YouTube検索・分析ツール アーキテクチャ設計

## システム概要
YouTube Data API v3 を用い、直近3〜6ヶ月に開設された急成長チャンネルをキーワード検索・段階的フィルタリング・詳細分析・プログレッシブ表示で可視化するクライアント主導のWebアプリケーション。BYOK（ユーザー自身のAPIキー）を前提とし、データ保存はブラウザ（LocalStorage/IndexedDB）で完結する。

## アーキテクチャパターン
- パターン: クライアント主導SPA + 外部API（YouTube）連携 + ローカルファーストキャッシュ
- 理由: BYOKかつクォータ制約の最適化（キャッシュ/段階取得/並列+レート制限）をクライアントで完結させるため。MVPでサーバ不要、toB向けに将来的な薄いBFF追加を許容。

## コンポーネント構成
### フロントエンド
- フレームワーク: React + Bootstrap（UI）
- 状態管理: React標準（useState/useReducer）+ カスタムフック、必要に応じて軽量の非同期状態（フェッチ中/キャッシュ命中/エラー/クォータ）
- 主要モジュール:
  - UI: 検索フォーム、結果リスト、詳細カード、フィルタ設定、クォータインジケータ、アップセルUI
  - services/youtubeClient: axiosベースのYouTube APIクライアント
  - services/rateLimiter: トークンバケツ/簡易キューでレート制限
  - services/cache: IndexedDB（基本/キーワード/動画タグの24hキャッシュ）、LocalStorage（APIキー・合意フラグ・UI設定）
  - services/searchService: 検索オーケストレーション（並列取得・段階表示・「もっと見る」）
  - services/analysisService: 詳細分析（上限20件）、動画タグ収集
  - services/quotaService: クォータ概算と閾値監視
  - services/exportService: CSV出力（toB）/画像カード保存（toC）

### バックエンド（MVP: なし／将来: 任意）
- フレームワーク: Node.js（Express/Fastify）想定のBFF（任意）
- 役割（任意）: リクエスト集約/監査ログ/企業向けアクセス制御/エクスポートの署名URL生成
- 認証方式: Business向けのみ必要（APIキー非該当、メールリンク or Token）

### データベース
- ブラウザ: IndexedDBオブジェクトストア（`channel_basic`, `channel_keywords`, `channel_video_tags`）TTL=24h
- LocalStorage: `apiKey`, `agreedToTerms`, `userSettings`
- 将来（任意）: toBの共有キャッシュ用にRDB/Key-Valueを併設可能

## クロスカット
- エラー方針: 画面復帰可能・説明付き、指数バックオフ、部分表示
- パフォーマンス: プログレッシブ描画、並列+レート制限、キャッシュ即時提示→バックグラウンド更新
- アクセシビリティ: キーボード操作/ローディングの一貫表示
- 法令/規約: 利用規約/PP表示、YouTubeブランドガイドライン順守、ローカルデータ削除UI

## デプロイ/運用
- デプロイ: Vercel（SPA）
- 環境: BYOKのためビルドは環境変数不要
- モニタリング: フロントの軽量計測（P50/P90、失敗率、クォータ警告回数）
