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

export class NodeModel {
	id: string
	title: string
	tips: NodeTip
	shortcut: NodeShortcut
	status: NodeStatusEnum
	startTime: number
	finishTime: number

	static newInstance() {
		let node = new NodeModel()
		node.id = UUIDUtils.getUUID()
		node.title = "Node Title"
		node.tips = {
			summary: '',
			content: ''
		}
		node.shortcut = {
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
		}
		node.status = NodeStatusEnum.PENDING
		return node
	}
}

export class NodesModel {
	data: NodeModel[]
}
