# API エンドポイント仕様

本MVPはBYOKかつフロントエンド完結を前提とする。以下は:
- 1) 直接利用するYouTube Data API（クライアントから呼び出し）
- 2) 企業向け拡張で追加可能な薄いBFF（任意）

## 1) YouTube Data API（クライアント）

### GET https://www.googleapis.com/youtube/v3/search
- パラメータ: `part=snippet`, `type=channel`, `q`, `maxResults`, `publishedAfter`, `key`
- 用途: キーワードからチャンネル候補を取得

### GET https://www.googleapis.com/youtube/v3/channels
- パラメータ: `part=snippet,statistics`, `id` or `forUsername`, `key`
- 用途: 登録者数・総再生回数・開設日を取得

### GET https://www.googleapis.com/youtube/v3/search (videos)
- パラメータ: `part=snippet`, `type=video`, `channelId`, `order=date`, `maxResults`, `key`
- 用途: 代表動画の抽出→動画ID取得

### GET https://www.googleapis.com/youtube/v3/videos
- パラメータ: `part=snippet`, `id`, `key`
- 用途: 動画タグの取得

## 2) 任意のBFFエンドポイント（Business向け・将来）

### GET /health
- 目的: 稼働確認
- レスポンス: `{ "status": "ok", "version": "x.y.z" }`

### POST /export/csv
- 目的: 企業向けの署名URL生成/大容量CSV組み立て
- リクエスト例:
```json
{
  "items": [{ "channelId": "...", "title": "...", "subscriberCount": 12345, "viewCount": 67890 }],
  "options": { "includeWatermark": false, "delimiter": "," }
}
```
- レスポンス例:
```json
{ "success": true, "url": "https://.../signed.csv" }
```

### POST /images/card
- 目的: サーバサイドでのOGP相当カード生成（高解像度、透かし制御）
- リクエスト: チャンネル要約、レイアウト指定
- レスポンス: 画像URL

### GET /quota/status
- 目的: 企業アカウントの共有クォータ可視化（任意）
- レスポンス: `{ "limit": 10000, "used": 4321 }`

## 命名規約
- リソース名は複数形、動作はHTTPメソッドで表現
- ステータスコード: 2xx成功、4xxクライアント起因、5xxサーバ起因
- エラー形式: `{ "code": string, "message": string }`
