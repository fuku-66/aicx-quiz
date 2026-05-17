# AICX学習クイズ

SHIFT AI Certification eXam (AICX) 対策アプリ。

- フロント: GitHub Pages（このリポジトリ）
- データAPI: Google Apps Script Web App（別管理）
- データストア: Google Sheets

## アーキテクチャ

```
GitHub Pages (静的)  ──fetch(GET ?action / POST text/plain JSON)──>  GAS Web App  ──>  Spreadsheet
```

GASのHTMLレンダリングを介さないため初回ロードが軽い。
GAS側は `Content-Type: text/plain` で受けてプリフライト不要にしている。

## ファイル

| ファイル | 内容 |
|---------|------|
| `index.html` | アプリ本体（ホーム/クイズ/図鑑/資料の4ビュー） |
| `style.css` | 全画面共通スタイル |
| `main.js` | ビュー切替・クイズフロー・解放トースト |
| `pokemon.js` | 図鑑描画・日本語名キャッシュ |
| `calendar.js` | 学習カレンダー描画 |
| `learn-01.html` 〜 `learn-03.html` | 3つのpillar解説資料（独立ページ） |

## GAS API URL

`main.js` の `GAS_API_URL` 定数で指定。同じデプロイIDで再デプロイすればURLは変わらない。
