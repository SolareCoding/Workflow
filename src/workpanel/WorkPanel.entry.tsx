import {TextFileView, TFile} from "obsidian";
import {createRoot} from "react-dom/client";
import * as React from "react";
import {PomodoroView} from "../pomodoro/Pomodoro.view";
import {WORK_FLOW_VIEW} from "../pomodoro/Pomodoro.entry";
import WorkPanelView from "./WorkPanel.view";

/**
 * 主页面，从workflow文件进入的初始页面
 */
export class WorkPanelEntry extends TextFileView {

	root = createRoot(this.containerEl)

	getViewType(): string {
		return WORK_FLOW_VIEW;
	}

	async onOpen() {
		console.log('on open')
	}

	async onClose() {
		this.root.unmount()
	}

	override onLoadFile(file: TFile): Promise<void> {
		console.log("onLoadFile")
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
				<WorkPanelView data={this.data} saveData={(data) => {this.updateData(data)}}/>
			</React.StrictMode>
		)
	}

}
