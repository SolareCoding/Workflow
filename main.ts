import {
	addIcon,
	Plugin,
} from 'obsidian';
import {workflowIcon} from "./resources/icons/workflow.icon";
import {WORK_FLOW_VIEW, WorkPanelEntry} from "./src/workpanel/WorkPanel.entry";
import {MainModal} from "./src/main/views/MainModal";
import {DEFAULT_SETTINGS, WorkflowSettings, WorkflowSettingTab} from "./src/settings/WorkflowSettings";
import {openWorkflowPanel} from "./src/settings/WorkflowRibbonHelper";

export default class WorkflowPlugin extends Plugin {

	settings: WorkflowSettings;

	async activateView() {
		this.app.workspace.detachLeavesOfType(WORK_FLOW_VIEW);

		await this.app.workspace.getLeaf(true).setViewState({
			type: WORK_FLOW_VIEW,
			active: true,
		});

		this.app.workspace.revealLeaf(
			this.app.workspace.getLeavesOfType(WORK_FLOW_VIEW)[0]
		);
	}



	async onload() {
		await this.loadSettings();

		addIcon("workflow", workflowIcon)

		this.registerView(WORK_FLOW_VIEW,
			(leaf) => new WorkPanelEntry(leaf, this));

		this.registerExtensions(["workflow"], WORK_FLOW_VIEW);

		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('workflow', 'Open workflow panel', (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			// this.activateView();
			openWorkflowPanel(this.app, this)
		});
		// Perform additional things with the ribbon
		ribbonIconEl.addClass('workflow-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		// const statusBarItemEl = this.addStatusBarItem();
		// statusBarItemEl.setText('Workflow is running');

		// This adds a simple command that can be triggered anywhere
		// this.addCommand({
		// 	id: 'create-new-workflow-fiel',
		// 	name: 'Create a new workflow',
		// 	callback: () => {
		// 		new MainModal(this.app).open();
		// 	}
		// });

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new WorkflowSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
		// 	console.log('click', evt);
		// });
		//
		// // When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		// this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}




