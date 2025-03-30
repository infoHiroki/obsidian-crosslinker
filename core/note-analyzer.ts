import { App, TFile, Vault } from 'obsidian';
import { CrosslinkerSettings } from '../settings';
import { extractTags, getCommonWords, calculateJaccardSimilarity } from './text-utils';

export interface RelatedNote {
	file: TFile;
	score: number;
	matchReason: string;
}

export class NoteAnalyzer {
	private app: App;
	private settings: CrosslinkerSettings;
	private vault: Vault;

	constructor(app: App, settings: CrosslinkerSettings) {
		this.app = app;
		this.settings = settings;
		this.vault = app.vault;
	}

	updateSettings(settings: CrosslinkerSettings) {
		this.settings = settings;
	}

	async findRelatedNotes(file: TFile): Promise<RelatedNote[]> {
		// ソースノートのコンテンツを取得
		const sourceContent = await this.vault.cachedRead(file);
		
		// ファイル名からタイトルを抽出
		const sourceTitle = file.basename;
		
		// ソースノートからタグを抽出
		const sourceTags = extractTags(sourceContent);
		
		// 結果格納用
		const results: RelatedNote[] = [];
		
		// Vaultの全ファイルを取得
		const allMarkdownFiles = this.vault.getMarkdownFiles();
		
		// 各ファイルの関連性をチェック
		for (const targetFile of allMarkdownFiles) {
			// 自分自身は除外
			if (targetFile.path === file.path) continue;
			
			// ターゲットノートのコンテンツを取得
			const targetContent = await this.vault.cachedRead(targetFile);
			const targetTitle = targetFile.basename;
			
			// 関連性スコアを計算
			const score = await this.calculateRelevanceScore(
				sourceTitle, sourceContent, sourceTags,
				targetTitle, targetContent
			);
			
			// 最小スコア以上の場合のみ結果に追加
			if (score >= this.settings.minRelevanceScore) {
				let matchReason = `関連スコア: ${score.toFixed(2)}`;
				
				// タイトルがコンテンツに含まれる場合
				if (sourceContent.toLowerCase().includes(targetTitle.toLowerCase())) {
					matchReason = 'タイトルが内容に含まれています';
				}
				// タグが共通する場合
				else if (this.hasCommonTags(sourceTags, extractTags(targetContent))) {
					matchReason = '共通のタグがあります';
				}
				
				results.push({
					file: targetFile,
					score: score,
					matchReason: matchReason
				});
			}
		}
		
		// スコア順に並べ替え
		results.sort((a, b) => b.score - a.score);
		
		// 最大リンク数に制限
		return results.slice(0, this.settings.maxLinksPerNote);
	}
	
	private async calculateRelevanceScore(
		sourceTitle: string, sourceContent: string, sourceTags: Set<string>,
		targetTitle: string, targetContent: string
	): Promise<number> {
		let score = 0;
		
		// 1. タイトル一致
		const titleScore = this.calculateTitleMatchScore(sourceContent, targetTitle);
		score += titleScore * this.settings.titleMatchWeight;
		
		// 2. コンテンツ類似性
		const contentScore = await this.calculateContentSimilarity(sourceContent, targetContent);
		score += contentScore * this.settings.contentWeight;
		
		// 3. タグ一致
		const tagScore = this.calculateTagSimilarity(sourceTags, extractTags(targetContent));
		score += tagScore * this.settings.tagWeight;
		
		return score;
	}
	
	private calculateTitleMatchScore(content: string, title: string): number {
		// タイトルが内容に完全一致する場合
		if (content.toLowerCase().includes(title.toLowerCase())) {
			return 1.0;
		}
		
		// 部分一致（単語レベル）をチェック
		const words = title.split(/\s+/).filter(word => word.length > 2);
		if (words.length > 1) {
			const matchCount = words.filter(word => 
				content.toLowerCase().includes(word.toLowerCase())
			).length;
			
			return matchCount / words.length * 0.8;
		}
		
		return 0;
	}
	
	private async calculateContentSimilarity(content1: string, content2: string): Promise<number> {
		// コンテンツから単語を抽出
		const words1 = await getCommonWords(content1, this.settings.japaneseOptimization);
		const words2 = await getCommonWords(content2, this.settings.japaneseOptimization);
		
		// Jaccard係数で類似度を計算
		return calculateJaccardSimilarity(new Set(words1), new Set(words2));
	}
	
	private calculateTagSimilarity(tags1: Set<string>, tags2: Set<string>): number {
		if (tags1.size === 0 || tags2.size === 0) return 0;
		return calculateJaccardSimilarity(tags1, tags2);
	}
	
	private hasCommonTags(tags1: Set<string>, tags2: Set<string>): boolean {
		for (const tag of tags1) {
			if (tags2.has(tag)) return true;
		}
		return false;
	}
}