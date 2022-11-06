import {App, Modal, SuggestModal} from "obsidian";

interface Command {
	command: string;
	desc: string;
}

const MAIN_COMMANDS: Command[] = [
	{
		command: "Node management",
		desc: "Create, modify or delete nodes"
	},
	{
		command: "Workflow management",
		desc: "Create, modify or delete workflows"
	},
]

export class MainModal extends SuggestModal<Command> {
	constructor(app: App) {
		super(app);
	}

	getSuggestions(query: string): Command[] | Promise<Command[]> {
		return MAIN_COMMANDS;
	}

	onChooseSuggestion(item: Command, evt: MouseEvent | KeyboardEvent): any {
		console.log("the item is: " + item)
	}

	renderSuggestion(value: Command, el: HTMLElement): any {
		el.createEl("div", { text: value.command });
		el.createEl("small", { text: value.desc });
	}
}
