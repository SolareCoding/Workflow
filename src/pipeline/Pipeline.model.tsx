import {NodeModel} from "../nodes/Node.model";
import {NodeStatusEnum} from "../nodes/NodeStatus.enum";
import UUIDUtils from "../utils/UUID.utils";

export interface PipelinesModel {
	data: PipelineModel[]
}

export class PipelineModel {
	id: string;
	title: string;
	templateTitle: string;
	isTemplate: boolean;
	status: NodeStatusEnum;
	createTime: number;
	sections: PipelineNodeModel[];

	static newInstance(): PipelineModel {
		let pipeline = new PipelineModel();
		pipeline.id = UUIDUtils.getUUID()
		pipeline.title = 'Template'
		pipeline.isTemplate = true
		pipeline.status = NodeStatusEnum.PENDING
		pipeline.createTime = Date.now()
		pipeline.sections = []
		return pipeline;
	}
}

export class PipelineNodeModel {
	title: string;
	status: NodeStatusEnum;
	nodes: NodeModel[];

	static newInstance(): PipelineNodeModel {
		let section = new PipelineNodeModel();
		section.title = 'Section Title';
		section.status = NodeStatusEnum.PENDING;
		section.nodes = [];
		return section;
	}
}
