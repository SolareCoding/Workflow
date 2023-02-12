import {App} from "obsidian";
import WorkflowPlugin from "../../main";
import {WorkflowModal} from "./WorkflowModal";
import {WORKFLOW_FILE_NAME} from "./WorkflowSettings";
import {WORK_FLOW_VIEW} from "../workpanel/WorkPanel.entry";

export async function openWorkflowPanel(app: App, plugin: WorkflowPlugin) {
	let filePath = plugin.settings.filePath;
	if (!filePath.endsWith('/')) {
		filePath += '/'
	}
	filePath += WORKFLOW_FILE_NAME
	await app.vault.adapter.exists(filePath).then(exist => {
		if (exist) {
			let hasLeaf = false
			app.workspace.iterateAllLeaves(leaf => {
				if (leaf.getViewState().type == WORK_FLOW_VIEW) {
					hasLeaf = true
					app.workspace.revealLeaf(leaf)
				}
			})
			if (hasLeaf) {
				return
			}
			const leaf = app.workspace.getLeaf(true);
			leaf.openFile(this.app.vault.getAbstractFileByPath(filePath), {
				active: true,
			})
		} else {
			new WorkflowModal(app, 'The workflow file has not been created yet').open()
		}
	})
}
