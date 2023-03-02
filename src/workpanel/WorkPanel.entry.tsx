import {TextFileView, TFile, WorkspaceLeaf} from "obsidian";
import {createRoot} from "react-dom/client";
import * as React from "react";
import WorkPanelView from "./WorkPanel.view";
import {
	Plugin,
} from 'obsidian';
import WorkflowPlugin from "../../main";

export const WORK_FLOW_VIEW = 'WorkFlowView'

/**
 * 主页面，从workflow文件进入的初始页面
 */
export class WorkPanelEntry extends TextFileView {

	plugin: WorkflowPlugin;

	constructor(leaf: WorkspaceLeaf, plugin: WorkflowPlugin) {
		super(leaf);
		this.plugin = plugin;
	}

	root = createRoot(this.containerEl)

	getViewType(): string {
		return WORK_FLOW_VIEW;
	}

	async onOpen() {
	}

	async onClose() {
		this.root.unmount()
	}

	override onLoadFile(file: TFile): Promise<void> {
		return super.onLoadFile(file);
	}

	clear(): void {
		this.data = "{}"
	}

	getViewData(): string {
		return this.data;
	}

	updateData(data: string) {
		this.data = data;
		this.requestSave();
	}

	setViewData(data: string, clear: boolean): void {
		this.contentEl.empty();
		this.data = data;
		this.root.render(
			<React.StrictMode>
				<WorkPanelView data={this.data} saveData={(data) => {this.updateData(data)}} plugin={this.plugin}/>
				{/*<DummyListView dummyList={DummyListModel.newInstance()}/>*/}
			</React.StrictMode>
		)
	}

}
