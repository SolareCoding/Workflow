import {NodeModel} from "../nodes/Node.model";

export interface PipelinesModel {
	data: PipelineModel[]
}

export interface PipelineModel {
	id: string,
	title: string,
	sections: PipelineNodeModel[]
}

export interface PipelineNodeModel {
	title: string,
	nodes: NodeModel[]
}
