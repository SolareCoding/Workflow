import {App, PluginSettingTab, Setting} from "obsidian";
import WorkflowPlugin from "../../main";
import {getFolderChoices} from "./SettingHelper";
import {WorkPanelModel} from "../workpanel/WorkPanel.model";
import {WorkflowModal} from "./WorkflowModal";

export interface WorkflowSettings {
	filePath: string;
}

export const DEFAULT_SETTINGS: WorkflowSettings = {
	filePath: '/',
}

export const WORKFLOW_FILE_NAME = 'Workflow.workflow'

export class WorkflowSettingTab extends PluginSettingTab {

	plugin: WorkflowPlugin;

	constructor(app: App, plugin: WorkflowPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	getDropdownOptions() {
		const folders = getFolderChoices(this.app);
		const pathOptions: Record<string, string> = {}
		for (const folder of folders) {
			pathOptions[folder.label] = folder.value
		}
		return pathOptions;
	}

	createWorkflowFile() {
		let filePath = this.plugin.settings.filePath;
		if (!filePath.endsWith('/')) {
			filePath += '/'
		}
		filePath += WORKFLOW_FILE_NAME
		this.app.vault.adapter.exists(filePath).then(exist => {
			if (exist) {
				new WorkflowModal(app, 'The workflow file has already been created. Try open the workflow panel from ribbon').open()
			} else {
				let workflow = WorkPanelModel.newInstance();
				this.app.vault.adapter.write(filePath, JSON.stringify(workflow));
			}
		})
	}

	display(): void {
		const {containerEl} = this;
		containerEl.empty();
		containerEl.createEl('h2', {text: 'Workflow settings'});

		new Setting(containerEl)
			.setName('Workflow save place')
			.setDesc('Choose the path where the workflow file is saved')
			.addDropdown(dropDown => {
				dropDown
					.addOptions(this.getDropdownOptions())
					.setValue(this.plugin.settings.filePath)
					.onChange(async (value) => {
						this.plugin.settings.filePath = value;
						await this.plugin.saveSettings();
					})
			});

		new Setting(containerEl)
			.setName('Create workflow file')
			.setDesc('Create your workflow file')
			.addButton(button => {
				button
					.setButtonText('Create')
					.onClick(cb => {
						this.createWorkflowFile()
					})
			})
	}
}
