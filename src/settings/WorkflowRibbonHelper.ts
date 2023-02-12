import {App} from "obsidian";
import WorkflowPlugin from "../../main";
import {WorkflowModal} from "./WorkflowModal";
import {WORKFLOW_FILE_NAME} from "./WorkflowSettings";

export async function openWorkflowPanel(app: App, plugin: WorkflowPlugin) {
	let filePath = plugin.settings.filePath;
	if (!filePath.endsWith('/')) {
		filePath += '/'
	}
	filePath += WORKFLOW_FILE_NAME
	await app.vault.adapter.exists(filePath).then(exist => {
		if (exist) {
			const leaf = app.workspace.getLeaf(true);
			leaf.openFile(this.app.vault.getAbstractFileByPath(filePath), {
				active: true,
			})
		} else {
			new WorkflowModal(app, 'The workflow file has not been created yet').open()
		}
	})
}
