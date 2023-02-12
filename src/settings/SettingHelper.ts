import {App, PluginSettingTab, Setting, TFolder, Vault} from "obsidian";


export interface Choice {
	id?: number;
	customProperties?: Record<string, any>;
	disabled?: boolean;
	active?: boolean;
	elementId?: string;
	groupId?: number;
	keyCode?: number;
	label: string;
	placeholder?: boolean;
	selected?: boolean;
	value: string;
}

export function getFolderChoices(app: App) {
	const folderList: Choice[] = [];

	Vault.recurseChildren(app.vault.getRoot(), (f) => {
		if (f instanceof TFolder) {
			folderList.push({
				value: f.path,
				label: f.path,
				selected: false,
				disabled: false,
			});
		}
	});

	return folderList;
}
