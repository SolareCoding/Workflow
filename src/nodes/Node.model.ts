import {NodeStatusEnum} from "./NodeStatus.enum";
import UUIDUtils from "../utils/UUID.utils";
import {CommandType, ShortCutCommand} from "./Command";

export class NodeTip {
	summary: string
	content: string
}

export class NodeShortcut {
	name: string;
	command: ShortCutCommand;
	macCommand: ShortCutCommand;
}

export interface NodeModel {
	id: string
	title: string
	tips: NodeTip
	shortcut: NodeShortcut
	status: NodeStatusEnum
	startTime: number
	finishTime: number
}

export function newNodeInstance(): NodeModel {
	return {
		id: UUIDUtils.getUUID(),
		title: "Node Title",
		tips: {
			summary: '',
			content: ''
		},
		shortcut: {
			name: "Shortcut",
			command: {
				type: CommandType.SHELL,
				commandFolder: '',
				commandFile: ''
			},
			macCommand: {
				type: CommandType.SHELL,
				commandFolder: '',
				commandFile: ''
			},
		},
		status: NodeStatusEnum.PENDING,
		startTime: 0,
		finishTime: 0,
	}
}

export class NodesModel {
	data: NodeModel[]
}
