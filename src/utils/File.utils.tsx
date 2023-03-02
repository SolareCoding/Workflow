import {App, TFile, TFolder, Vault} from "obsidian";


export function getAllFolders(app: App) {
	const folders:string[] = [];
	Vault.recurseChildren(app.vault.getRoot(), (f) => {
		if (f instanceof TFolder) {
			folders.push(f.path);
		}
	});
	return folders;
}

export function openFileInNewLeaf(filePath: string, app: App) {
	const file = app.vault.getAbstractFileByPath(filePath)
	if (!file || !(file instanceof TFile)) {
		return
	}
	// open the file directly
	console.log("newFilePath: ", filePath)
	const leaf = app.workspace.getLeaf(true);
	leaf.openFile(file, {
		active: true,
	}).then(() => {

	}).catch((reason) => {
		console.log(reason)
	})
}
