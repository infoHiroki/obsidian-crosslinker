import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile } from 'obsidian';
import { CrosslinkerSettings, DEFAULT_SETTINGS } from './settings';
import { RelatedNotesView } from './ui/related-notes-view';
import { NoteAnalyzer } from './core/note-analyzer';
import { StatusBarItem } from './ui/status-bar';

export default class CrosslinkerPlugin extends Plugin {
	settings: CrosslinkerSettings;
	analyzer: NoteAnalyzer;
	statusBarItem: StatusBarItem;

	async onload() {
		await this.loadSettings();
		
		// ステータスバーにアイテムを追加
		this.statusBarItem = new StatusBarItem(this);
		
		// アナライザーを初期化
		this.analyzer = new NoteAnalyzer(this.app, this.settings);

		// コマンド登録
		this.addCommand({
			id: 'find-related-notes',
			name: '現在のノートの関連ノートを検索',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				// 現在のファイルを取得
				const file = view.file;
				if (!file) {
					new Notice('ファイルが開かれていません');
					return;
				}
				
				this.statusBarItem.setStatus('関連ノートを検索中...');
				
				// 非同期で関連ノートを検索
				setTimeout(async () => {
					try {
						const relatedNotes = await this.analyzer.findRelatedNotes(file);
						// 関連ノートを表示
						new RelatedNotesView(this.app, relatedNotes, this, file).open();
					} catch (error) {
						console.error('関連ノート検索エラー:', error);
						new Notice('関連ノートの検索中にエラーが発生しました');
					} finally {
						this.statusBarItem.clearStatus();
					}
				}, 100);
			}
		});

		// 設定タブを追加
		this.addSettingTab(new CrosslinkerSettingTab(this.app, this));
	}

	onunload() {
		this.statusBarItem.remove();
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
		this.analyzer.updateSettings(this.settings);
	}
}

// 設定タブクラス
class CrosslinkerSettingTab extends PluginSettingTab {
	plugin: CrosslinkerPlugin;

	constructor(app: App, plugin: CrosslinkerPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Crosslinker 設定'});

		new Setting(containerEl)
			.setName('最大リンク数')
			.setDesc('1つのノートに追加する最大リンク数')
			.addSlider(slider => slider
				.setLimits(1, 20, 1)
				.setValue(this.plugin.settings.maxLinksPerNote)
				.setDynamicTooltip()
				.onChange(async (value) => {
					this.plugin.settings.maxLinksPerNote = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('最小関連スコア')
			.setDesc('関連ノートと見なす最小スコア (0.0-1.0)')
			.addSlider(slider => slider
				.setLimits(0.1, 0.9, 0.05)
				.setValue(this.plugin.settings.minRelevanceScore)
				.setDynamicTooltip()
				.onChange(async (value) => {
					this.plugin.settings.minRelevanceScore = value;
					await this.plugin.saveSettings();
				}));
				
		new Setting(containerEl)
			.setName('タイトル一致重み')
			.setDesc('タイトル一致の重み付け係数')
			.addSlider(slider => slider
				.setLimits(0, 1, 0.1)
				.setValue(this.plugin.settings.titleMatchWeight)
				.setDynamicTooltip()
				.onChange(async (value) => {
					this.plugin.settings.titleMatchWeight = value;
					await this.plugin.saveSettings();
				}));
				
		new Setting(containerEl)
			.setName('内容類似度重み')
			.setDesc('内容の類似度の重み付け係数')
			.addSlider(slider => slider
				.setLimits(0, 1, 0.1)
				.setValue(this.plugin.settings.contentWeight)
				.setDynamicTooltip()
				.onChange(async (value) => {
					this.plugin.settings.contentWeight = value;
					await this.plugin.saveSettings();
				}));
				
		new Setting(containerEl)
			.setName('タグ一致重み')
			.setDesc('タグ一致の重み付け係数')
			.addSlider(slider => slider
				.setLimits(0, 1, 0.1)
				.setValue(this.plugin.settings.tagWeight)
				.setDynamicTooltip()
				.onChange(async (value) => {
					this.plugin.settings.tagWeight = value;
					await this.plugin.saveSettings();
				}));
				
		new Setting(containerEl)
			.setName('日本語最適化')
			.setDesc('日本語コンテンツの分析を最適化')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.japaneseOptimization)
				.onChange(async (value) => {
					this.plugin.settings.japaneseOptimization = value;
					await this.plugin.saveSettings();
				}));
				
		new Setting(containerEl)
			.setName('リンク形式')
			.setDesc('ノートにリンクを追加する方法')
			.addDropdown(dropdown => dropdown
				.addOption('bottom', 'ファイル末尾')
				.addOption('section', '専用セクション')
				.setValue(this.plugin.settings.linkFormat)
				.onChange(async (value) => {
					this.plugin.settings.linkFormat = value;
					await this.plugin.saveSettings();
				}));
	}
}