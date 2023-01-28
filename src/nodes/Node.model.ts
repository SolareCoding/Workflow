import {NodeStatusEnum} from "./NodeStatus.enum";

export class NodeTip {
	summary: string
	content: string
}

export class NodeModel {
	id: string
	title: string
	tips: NodeTip
	status: NodeStatusEnum
	startTime: number
	finishTime: number

	static newInstance() {
		let node = new NodeModel()
		node.title = "Node Title"
		node.tips = {
			summary: "Tip summary",
			content: 'Tip content'
		}
		node.status = NodeStatusEnum.PENDING
		return node
	}
}

export class NodesModel {
	data: NodeModel[]
}
