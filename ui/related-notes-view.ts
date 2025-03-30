import { App, Modal, TFile, ButtonComponent, Setting, Notice } from 'obsidian';
import { RelatedNote } from '../core/note-analyzer';
import CrosslinkerPlugin from '../main';

export class RelatedNotesView extends Modal {
	private relatedNotes: RelatedNote[];
	private plugin: CrosslinkerPlugin;
	private sourceFile: TFile;
	private selectedNotes: Set<string> = new Set();

	constructor(app: App, relatedNotes: RelatedNote[], plugin: CrosslinkerPlugin, sourceFile: TFile) {
		super(app);
		this.relatedNotes = relatedNotes;
		this.plugin = plugin;
		this.sourceFile = sourceFile;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.empty();

		contentEl.createEl('h2', { text: '関連ノート' });
		
		if (this.relatedNotes.length === 0) {
			contentEl.createEl('p', { text: '関連ノートが見つかりませんでした。' });
			return;
		}
		
		// 説明
		contentEl.createEl('p', { 
			text: `${this.sourceFile.basename}に関連するノートが${this.relatedNotes.length}件見つかりました。` 
		});
		
		// 関連ノートリスト
		const relatedListEl = contentEl.createDiv('related-notes-list');
		
		// カスタムスタイルを適用
		contentEl.createEl('style', { 
			text: `
				.related-note-item {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 8px;
					padding: 5px;
					border-bottom: 1px solid var(--background-modifier-border);
				}
				.related-note-info {
					flex-grow: 1;
				}
				.related-note-preview {
					margin-left: 10px;
				}
				.related-notes-action-buttons {
					display: flex;
					justify-content: flex-end;
					margin-top: 20px;
				}
			` 
		});
		
		this.relatedNotes.forEach(note => {
			const noteEl = relatedListEl.createDiv('related-note-item');
			
			// 左側に情報を配置
			const infoContainer = noteEl.createDiv('related-note-info');
			
			// チェックボックスと情報
			const checkbox = new Setting(infoContainer)
				.setName(note.file.basename)
				.setDesc(`${note.matchReason} (スコア: ${note.score.toFixed(2)})`)
				.addToggle(toggle => toggle
					.setValue(false)
					.onChange(value => {
						if (value) {
							this.selectedNotes.add(note.file.path);
						} else {
							this.selectedNotes.delete(note.file.path);
						}
					}));
			
			// 右側にプレビューボタンを配置
			const previewContainer = noteEl.createDiv('related-note-preview');
			const previewButton = new ButtonComponent(previewContainer)
				.setButtonText('プレビュー')
				.setCta()
				.onClick(() => {
					this.openFileInNewLeaf(note.file);
				});
		});
		
		// アクションボタン
		const actionButtonContainer = contentEl.createDiv('related-notes-action-buttons');
		
		// リンク追加ボタン
		new ButtonComponent(actionButtonContainer)
			.setButtonText('選択したノートをリンク')
			.setCta()
			.onClick(() => {
				this.addLinksToNote();
			});
		
		// キャンセルボタン
		const cancelButton = new ButtonComponent(actionButtonContainer)
			.setButtonText('キャンセル')
			.onClick(() => {
				this.close();
			});
		cancelButton.buttonEl.style.marginLeft = '10px';
	}
	
	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
	
	private async addLinksToNote() {
		if (this.selectedNotes.size === 0) {
			new Notice('リンクするノートが選択されていません');
			return;
		}
		
		try {
			// ファイルの内容を取得
			const content = await this.app.vault.read(this.sourceFile);
			
			// 選択したノートへのリンクを作成
			const selectedNotesLinks: string[] = [];
			
			for (const path of this.selectedNotes) {
				const file = this.app.vault.getAbstractFileByPath(path);
				if (file instanceof TFile) {
					selectedNotesLinks.push(`[[${file.basename}]]`);
				}
			}
			
			// リンクを追加
			let updatedContent = '';
			const linkFormat = this.plugin.settings.linkFormat || 'section';
			
			if (linkFormat === 'section') {
				// セクションとしてリンクを追加
				const sectionTitle = '## 関連概念';
				
				if (content.includes(sectionTitle)) {
					// 既存のセクションにリンクを追加
					const sectionRegex = new RegExp(`${sectionTitle}[\\s\\S]*?(?=\\n#|$)`, 'g');
					updatedContent = content.replace(sectionRegex, (match) => {
						return `${sectionTitle}\n\n${selectedNotesLinks.join(' ')}${match.startsWith(sectionTitle) ? match.substring(sectionTitle.length) : ''}`;
					});
				} else {
					// 新しいセクションを追加
					updatedContent = `${content}\n\n${sectionTitle}\n\n${selectedNotesLinks.join(' ')}`;
				}
			} else {
				// ファイル末尾にリンクを追加
				updatedContent = `${content}\n\n${selectedNotesLinks.join(' ')}`;
			}
			
			// ファイルを更新
			await this.app.vault.modify(this.sourceFile, updatedContent);
			
			new Notice(`${this.selectedNotes.size}個のリンクを追加しました`);
			this.close();
			
		} catch (error) {
			console.error('ノート更新エラー:', error);
			new Notice('リンクの追加中にエラーが発生しました');
		}
	}
	
	private openFileInNewLeaf(file: TFile) {
		this.app.workspace.splitActiveLeaf().openFile(file);
	}
}