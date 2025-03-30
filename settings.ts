export interface CrosslinkerSettings {
	maxLinksPerNote: number;
	minRelevanceScore: number;
	titleMatchWeight: number;
	contentWeight: number;
	tagWeight: number;
	japaneseOptimization: boolean;
	linkFormat: string;
}

export const DEFAULT_SETTINGS: CrosslinkerSettings = {
	maxLinksPerNote: 8,
	minRelevanceScore: 0.35,
	titleMatchWeight: 0.6,
	contentWeight: 0.3,
	tagWeight: 0.1,
	japaneseOptimization: true,
	linkFormat: 'section'
}