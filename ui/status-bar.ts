import { Plugin } from 'obsidian';

export class StatusBarItem {
	private statusBarEl: HTMLElement;
	private plugin: Plugin;

	constructor(plugin: Plugin) {
		this.plugin = plugin;
		this.statusBarEl = this.plugin.addStatusBarItem();
		this.statusBarEl.setText('');
	}

	setStatus(text: string) {
		this.statusBarEl.setText(`Crosslinker: ${text}`);
	}

	clearStatus() {
		this.statusBarEl.setText('');
	}

	remove() {
		this.statusBarEl.remove();
	}
}