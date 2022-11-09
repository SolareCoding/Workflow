import {NodeStatusEnum} from "./NodeStatus.enum";

export class NodeTip {
	summary: string
	content: string[]
}

export class NodeModel {
	id: string
	title: string
	tips: NodeTip
	status: NodeStatusEnum
	startTime: number
	finishTime: number

	static getDummyNode() {
		let node = new NodeModel()
		node.id = '123';
		node.title = "Dummy"
		node.tips = {
			summary: "开发",
			content: [
				'记得写业务',
				'记得写埋点'
			]
		}
		node.status = NodeStatusEnum.PENDING
		return node
	}
}

export class NodesModel {
	data: NodeModel[]
}
