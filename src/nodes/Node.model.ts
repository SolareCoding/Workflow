import {NodeStatusEnum} from "./NodeStatus.enum";
import UUIDUtils from "../utils/UUID.utils";

export class NodeTip {
	summary: string
	content: string
}

export class NodeShortcut {
	name: string
	command: string
	macCommand: string
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
			command: '',
			macCommand: ''
		}
		node.status = NodeStatusEnum.PENDING
		return node
	}
}

export class NodesModel {
	data: NodeModel[]
}
