import { JAPANESE_STOPWORDS, ENGLISH_STOPWORDS } from './stopwords';

// テキストからタグを抽出
export function extractTags(content: string): Set<string> {
	const tags = new Set<string>();
	
	// フロントマターからタグを抽出
	if (content.startsWith('---')) {
		const frontmatterEnd = content.indexOf('---', 3);
		if (frontmatterEnd !== -1) {
			const frontmatter = content.substring(3, frontmatterEnd);
			
			// tags: [tag1, tag2] または tags: tag1, tag2 形式を検出
			const tagMatches = frontmatter.match(/tags:\s*(\[.*?\]|.*?)($|\n)/m);
			if (tagMatches) {
				let tagStr = tagMatches[1].trim();
				if (tagStr.startsWith('[') && tagStr.endsWith(']')) {
					// [tag1, tag2] 形式
					tagStr = tagStr.substring(1, tagStr.length - 1);
					tagStr.split(',').forEach(tag => {
						tags.add(tag.trim().replace(/['"]/g, ''));
					});
				} else {
					// tag1, tag2 形式
					tagStr.split(',').forEach(tag => {
						tags.add(tag.trim().replace(/['"]/g, ''));
					});
				}
			}
		}
	}
	
	// インラインタグを抽出 (#tag形式)
	const tagRegex = /#([a-zA-Z0-9_/.-]+)/g;
	let match;
	while ((match = tagRegex.exec(content)) !== null) {
		tags.add(match[1]);
	}
	
	return tags;
}

// テキストから一般的な単語を抽出
export async function getCommonWords(text: string, japaneseOptimization: boolean): Promise<string[]> {
	// ストップワード（除外する一般的な単語）
	const stopwords = new Set([...ENGLISH_STOPWORDS]);
	
	if (japaneseOptimization) {
		JAPANESE_STOPWORDS.forEach(word => stopwords.add(word));
	}
	
	// 単語を抽出
	const words = extractWords(text, japaneseOptimization);
	
	// ストップワードを除外
	return words.filter(word => !stopwords.has(word.toLowerCase()));
}

// テキストから単語を抽出
function extractWords(text: string, japaneseOptimization: boolean): string[] {
	const words: string[] = [];
	
	// 英数字の単語を抽出
	const enWordMatches = text.toLowerCase().match(/\b[a-z0-9_-]{2,}\b/g);
	if (enWordMatches) {
		words.push(...enWordMatches);
	}
	
	// 日本語最適化が有効な場合
	if (japaneseOptimization) {
		// 漢字
		const kanjiMatches = text.match(/[\u4e00-\u9fff]{2,}/g);
		if (kanjiMatches) {
			words.push(...kanjiMatches);
		}
		
		// ひらがな（3文字以上のみ意味があると仮定）
		const hiraganaMatches = text.match(/[\u3040-\u309f]{3,}/g);
		if (hiraganaMatches) {
			words.push(...hiraganaMatches);
		}
		
		// カタカナ
		const katakanaMatches = text.match(/[\u30a0-\u30ff]{2,}/g);
		if (katakanaMatches) {
			words.push(...katakanaMatches);
		}
	}
	
	return words;
}

// Jaccard類似度の計算（共通要素数 / 全要素数）
export function calculateJaccardSimilarity<T>(set1: Set<T>, set2: Set<T>): number {
	if (set1.size === 0 || set2.size === 0) return 0;
	
	// 積集合のサイズを計算
	let intersectionSize = 0;
	for (const item of set1) {
		if (set2.has(item)) {
			intersectionSize++;
		}
	}
	
	// 和集合のサイズを計算
	const unionSize = set1.size + set2.size - intersectionSize;
	
	// Jaccard係数を計算
	return intersectionSize / unionSize;
}