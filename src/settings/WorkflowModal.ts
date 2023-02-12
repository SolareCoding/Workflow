import {App, Modal, SuggestModal} from "obsidian";

export class WorkflowModal extends Modal {

	message: string = ''

	constructor(app: App, message: string) {
		super(app);
		this.message = message
	}

	onOpen() {
		let { titleEl, contentEl } = this;
		titleEl.setText('Workflow plugin')
		contentEl.setText(this.message);
	}

	onClose() {
		let { contentEl } = this;
		contentEl.empty();
	}
}
