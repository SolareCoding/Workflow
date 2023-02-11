import {NodeStatusEnum} from "./NodeStatus.enum";

export class NodeTip {
	summary: string
	content: string
}

export class NodeShortcut {
	name: string
	command: string
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
		node.title = "Node Title"
		node.tips = {
			summary: '',
			content: ''
		}
		node.shortcut = {
			name: "Shortcut",
			command: ''
		}
		node.status = NodeStatusEnum.PENDING
		return node
	}
}

export class NodesModel {
	data: NodeModel[]
}
