# Obsidian Crosslinker

![Obsidian Crosslinker](https://img.shields.io/badge/Obsidian-Crosslinker-blue)
![License](https://img.shields.io/github/license/yourusername/obsidian-crosslinker)
![Version](https://img.shields.io/badge/version-0.1.0-green)

Obsidian Crosslinkerは、ノート間の関連性を高度に分析し、高品質な相互リンクを提案するObsidianプラグインです。

## 特徴

- **スマートな関連性分析**: タイトル一致、コンテンツ類似性、タグ一致など複数の要素を組み合わせた分析
- **日本語コンテンツ最適化**: 日本語テキスト処理に特化した機能
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

1. [最新リリース](https://github.com/yourusername/obsidian-crosslinker/releases)から `main.js` と `manifest.json` をダウンロード
2. Obsidian vaultの `.obsidian/plugins/obsidian-crosslinker/` ディレクトリに配置（ディレクトリが存在しない場合は作成）
3. Obsidianを再起動し、設定からプラグインを有効化

## 設定オプション

- **最大リンク数**: 1つのノートに追加する最大リンク数
- **最小関連スコア**: 関連ノートと見なす最小スコア（0.0-1.0）
- **タイトル一致重み**: タイトル一致の重み付け係数
- **内容類似度重み**: コンテンツ類似性の重み付け係数
- **タグ一致重み**: タグ一致の重み付け係数
- **日本語最適化**: 日本語コンテンツの分析を最適化

## アルゴリズムについて

Crosslinkerの関連性スコアは以下の要素を組み合わせて計算されます：

1. **タイトル一致 (60%)**: 他のノートのタイトルが内容に含まれているか
2. **コンテンツ類似性 (30%)**: ノート内容の単語レベルでの共通性（Jaccard係数）
3. **タグの一致 (10%)**: ノート間で共通するタグの比率

各要素の重みは設定で調整可能です。

## 開発者向け情報

### ビルド方法

```bash
# リポジトリのクローン
git clone https://github.com/yourusername/obsidian-crosslinker.git
cd obsidian-crosslinker

# 依存関係のインストール
npm install

# 開発ビルド（監視モード）
npm run dev

# 本番ビルド
npm run build
```

### 開発ガイド

詳細な開発者向けドキュメントは[こちら](DEVELOPERS.md)を参照してください。

## Python版との違い

このプラグインは、元々スタンドアロンのPythonツールとして開発されていた[Obsidian Crosslinker](https://github.com/yourusername/obsidian-crosslinker)をObsidianプラグインとして統合したものです。主な違いは以下の通りです：

- **UI統合**: Obsidianのインターフェース内で直接操作可能
- **リアルタイム処理**: 現在のノートに対してその場で関連ノートを分析
- **選択式リンク**: 提案された関連ノートから必要なものだけを選択可能

## ロードマップ

- リアルタイム関連ノート提案
- 高度な日本語形態素解析
- ノート間の関連性グラフ表示
- リンク品質の学習と改善

## バグ報告・機能リクエスト

バグ報告や機能リクエストは[GitHub Issues](https://github.com/yourusername/obsidian-crosslinker/issues)で受け付けています。

## ライセンス

[MIT](LICENSE) © Your Name