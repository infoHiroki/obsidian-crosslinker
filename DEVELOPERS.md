# Obsidian Crosslinker Plugin 開発者ドキュメント

このドキュメントはObsidian Crosslinkerプラグインの開発者向け情報をまとめたものです。

## プロジェクト構造

```
obsidian-crosslinker-plugin/
├── main.ts                 # プラグインのエントリポイント
├── manifest.json           # プラグイン定義
├── package.json            # パッケージ定義
├── esbuild.config.mjs      # ビルド設定
├── settings.ts             # 設定インターフェース
├── core/                   # コア機能
│   ├── note-analyzer.ts    # 関連性分析エンジン
│   ├── text-utils.ts       # テキスト処理ユーティリティ
│   └── stopwords.ts        # ストップワードリスト
└── ui/                     # UI関連コンポーネント
    ├── related-notes-view.ts  # 関連ノート表示モーダル
    └── status-bar.ts       # ステータスバー表示
```

## 開発環境のセットアップ

### 前提条件
- Node.js (v14以上)
- npm または yarn
- Git

### 環境構築手順

1. リポジトリのクローン:
```bash
git clone https://github.com/yourusername/obsidian-crosslinker-plugin.git
cd obsidian-crosslinker-plugin
```

2. 依存関係のインストール:
```bash
npm install
```

3. ディレクトリ構造の作成:
```bash
mkdir -p core ui
```

4. 開発ビルドの実行:
```bash
npm run dev
```

5. プラグインのテスト:
   - `main.js` と `manifest.json` をVaultの `.obsidian/plugins/obsidian-crosslinker/` にコピー
   - Obsidianを再起動し、設定からプラグインを有効化

### 開発用ホットリロード設定（オプション）

1. 開発用Vaultを作成
2. シンボリックリンクを作成:
   ```bash
   # macOS/Linux
   ln -s /path/to/obsidian-crosslinker-plugin /path/to/vault/.obsidian/plugins/obsidian-crosslinker
   
   # Windows
   mklink /D "C:\path\to\vault\.obsidian\plugins\obsidian-crosslinker" "C:\path\to\obsidian-crosslinker-plugin"
   ```
3. `npm run dev` を実行して監視モードでビルド

## 主要コンポーネント解説

### NoteAnalyzer

関連性分析の中核機能を担当するクラス。

```typescript
// core/note-analyzer.ts
export class NoteAnalyzer {
  // ...
  
  async findRelatedNotes(file: TFile): Promise<RelatedNote[]> {
    // ノートの関連性を分析して関連ノートを返す
  }
  
  private async calculateRelevanceScore(
    sourceTitle: string, sourceContent: string, sourceTags: Set<string>,
    targetTitle: string, targetContent: string
  ): Promise<number> {
    // 複合的な関連性スコアを計算
  }
  
  // ...
}
```

#### 実装のポイント:
- 各スコア要素（タイトル、コンテンツ、タグ）の計算を分離
- 設定による重み付けの適用
- キャッシングによるパフォーマンス最適化
- Obsidian APIの効率的な利用

### テキスト処理ユーティリティ

テキストからの情報抽出や類似度計算を行う関数群。

```typescript
// core/text-utils.ts

// テキストからタグを抽出
export function extractTags(content: string): Set<string> {
  // フロントマターとインラインタグを抽出
}

// テキストから単語を抽出
export async function getCommonWords(text: string, japaneseOptimization: boolean): Promise<string[]> {
  // ストップワードを除外した意味のある単語を抽出
}

// Jaccard類似度の計算
export function calculateJaccardSimilarity<T>(set1: Set<T>, set2: Set<T>): number {
  // 共通要素数 / 全要素数
}
```

#### 実装のポイント:
- 効率的な正規表現パターン
- 日本語処理の最適化
- ストップワード除外によるノイズ削減

### 関連ノート表示UI

関連ノートを表示し、リンク追加を行うモーダルインターフェース。

```typescript
// ui/related-notes-view.ts
export class RelatedNotesView extends Modal {
  // ...
  
  onOpen() {
    // モーダルUI構築
  }
  
  private async addLinksToNote() {
    // 選択したノートへのリンクを追加
  }
  
  // ...
}
```

#### 実装のポイント:
- ユーザーフレンドリーなUI設計
- リンク追加操作の柔軟性
- プレビュー機能

## 設計思想

### 1. 高品質な関連性分析

- 単純なテキストマッチングではなく、複合的な関連性指標
- 日本語コンテンツへの特別な対応
- 低関連性リンクを排除するフィルタリング

### 2. ユーザーの意思決定をサポート

- 自動リンク作成ではなく、選択式の提案
- 関連理由の説明
- プレビュー機能によるコンテンツ確認

### 3. 柔軟性とカスタマイズ

- 各要素の重み付け調整
- 最小スコア閾値の調整
- 言語固有の最適化オプション

## デバッグとトラブルシューティング

### ログ出力

```typescript
// デバッグログの出力
console.debug('Detailed information:', data);
console.log('General information');
console.warn('Warning message');
console.error('Error details:', error);
```

### 開発者コンソールの表示

1. Obsidianアプリで `Ctrl+Shift+I` (Windows/Linux) または `Cmd+Opt+I` (macOS)
2. コンソールタブでログを確認

### 一般的な問題

1. **ビルドエラー**
   - TypeScriptのバージョン互換性を確認
   - 依存関係の問題は `npm install` で再インストール

2. **プラグインが読み込まれない**
   - `manifest.json` のフォーマットを確認
   - プラグインディレクトリの構造を確認

3. **パフォーマンス問題**
   - 大量のノートスキャン時はキャッシングを検討
   - 非同期処理の活用

## 貢献ガイドライン

### コーディング規約

- TypeScriptの型定義を適切に行う
- コメントで複雑な処理を説明
- 命名規則: キャメルケース、説明的な名前

### プルリクエストプロセス

1. 作業ブランチの作成 (`feature/feature-name` または `fix/bug-name`)
2. 変更を実装し、コミット
3. テストとビルドの確認
4. プルリクエストを作成、詳細な説明を記載

### リリースプロセス

1. バージョン番号のインクリメント (`npm version`)
2. CHANGELOG.mdの更新
3. タグ付けとリリース

## 将来の展望

### 短期目標

- パフォーマンス最適化
- UIの洗練
- 基本的なユーザーフィードバック機能

### 中期目標

- 高度な日本語形態素解析
- リアルタイム提案機能
- グラフビューとの連携

### 長期目標

- 機械学習による関連性予測
- 複数のノート間の関連性分析
- コミュニティフィードバックに基づく改良

## 参考リソース

- [Obsidian Plugin API](https://github.com/obsidianmd/obsidian-api)
- [Obsidian Sample Plugin](https://github.com/obsidianmd/obsidian-sample-plugin)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)