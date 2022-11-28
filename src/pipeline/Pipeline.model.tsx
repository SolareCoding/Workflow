import {NodeModel} from "../nodes/Node.model";
import {NodeStatusEnum} from "../nodes/NodeStatus.enum";

export interface PipelinesModel {
	data: PipelineModel[]
}

export interface PipelineModel {
	id: string,
	title: string,
	status: NodeStatusEnum,
	createTime: number,
	sections: PipelineNodeModel[]
}

export interface PipelineNodeModel {
	title: string,
	nodes: NodeModel[]
}
