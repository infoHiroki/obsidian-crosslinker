# Obsidian Crosslinker

![Obsidian Crosslinker](https://img.shields.io/badge/Obsidian-Crosslinker-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Version](https://img.shields.io/badge/version-0.1.0-green)

Obsidian Crosslinkerは、ノート間の関連性を高度に分析し、高品質な相互リンクを提案するObsidianプラグインです。タイトル一致、内容類似性、タグ一致などの複数の要素を組み合わせた分析により、関連ノートを自動的に検出します。

## スクリーンショット

![関連ノート検索画面](https://raw.githubusercontent.com/infoHiroki/obsidian-crosslinker/main/screenshots/related-notes.png)

![設定画面](https://raw.githubusercontent.com/infoHiroki/obsidian-crosslinker/main/screenshots/settings.png)

## 特徴

- **スマートな関連性分析**: タイトル一致、コンテンツ類似性、タグ一致など複数の要素を組み合わせた分析
- **日本語コンテンツ最適化**: 日本語テキスト処理に特化した機能（漢字、ひらがな、カタカナの検出）
- **カスタマイズ可能**: 各種パラメータの調整が可能
- **使いやすいUI**: 関連ノートの確認と選択式のリンク追加

## 使い方

1. 任意のノートを開く
2. コマンドパレット（Ctrl+P / Cmd+P）から「現在のノートの関連ノートを検索」を選択
3. 表示された関連ノートから追加したいリンクを選択
4. 「選択したノートをリンク」ボタンをクリック

## インストール

### Obsidianプラグインストアから（準備中）

1. Obsidianの設定を開く
2. 「サードパーティプラグイン」→「コミュニティプラグイン」→「参照」
3. "Crosslinker" を検索
4. インストールし、有効化

### 手動インストール

1. [最新リリース](https://github.com/infoHiroki/obsidian-crosslinker/releases)から `main.js` と `manifest.json` をダウンロード
2. Obsidian vaultの `.obsidian/plugins/crosslinker/` ディレクトリに配置（ディレクトリが存在しない場合は作成）
3. Obsidianを再起動し、設定からプラグインを有効化

## 設定オプション

- **最大リンク数**: 1つのノートに追加する最大リンク数
- **最小関連スコア**: 関連ノートと見なす最小スコア（0.0-1.0）
- **タイトル一致重み**: タイトル一致の重み付け係数
- **内容類似度重み**: コンテンツ類似性の重み付け係数
- **タグ一致重み**: タグ一致の重み付け係数
- **日本語最適化**: 日本語コンテンツの分析を最適化
- **リンク形式**: 「専用セクション」か「ファイル末尾」を選択

## アルゴリズムについて

Crosslinkerの関連性スコアは以下の要素を組み合わせて計算されます：

1. **タイトル一致 (デフォルト60\%)**: 他のノートのタイトルが内容に含まれているか
   - 完全一致: 高いスコア
   - 部分一致: 中程度のスコア

2. **コンテンツ類似性 (デフォルト30\%)**: ノート内容の単語レベルでの共通性
   - Jaccard係数をベースに計算（共通単語数/全単語数）
   - ストップワードを除外して計算

3. **タグの一致 (デフォルト10\%)**: ノート間で共通するタグの比率
   - Jaccard係数で計算（共通タグ数/全タグ数）

各要素の重みは設定で調整可能です。

## 日本語対応

Obsidian Crosslinkerは日本語コンテンツに最適化されています：

- 漢字、ひらがな、カタカナなど日本語特有の文字パターンに対応
- 日本語のストップワードリストを備える
- 日本語の複合語の検出

## 開発者向け情報

### ビルド方法

```bash
# リポジトリのクローン
git clone https://github.com/infoHiroki/obsidian-crosslinker.git
cd obsidian-crosslinker

# 依存関係のインストール
npm install

# 開発ビルド（監視モード）
npm run dev

# 本番ビルド
npm run build
```

### プロジェクト構造

- `main.ts`: プラグインのエントリポイント
- `settings.ts`: 設定データ構造とデフォルト値
- `core/`: 関連性分析やテキスト処理の中核ロジック
- `ui/`: ユーザーインターフェース要素

## ロードマップ

- リアルタイム関連ノート提案
- 高度な日本語形態素解析
- ノート間の関連性グラフ表示
- リンク品質の学習と改善

## バグ報告・機能リクエスト

バグ報告や機能リクエストは[GitHub Issues](https://github.com/infoHiroki/obsidian-crosslinker/issues)で受け付けています。

## ライセンス

[MIT](LICENSE) © infoHirokiT