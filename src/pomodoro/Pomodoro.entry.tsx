import {TextFileView, TFile} from "obsidian";
import {createRoot} from "react-dom/client";
import * as React from "react";
import {PomodoroView} from "./Pomodoro.view";

export const WORK_FLOW_VIEW = "workflowview"

// 如何解析数据：如果有
export class PomodoroEntry extends TextFileView {

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
		this.root.render(
			<React.StrictMode>
				<PomodoroView data={data} updateData={(data) => this.updateData(data)}/>
			</React.StrictMode>
		)
	}

}
