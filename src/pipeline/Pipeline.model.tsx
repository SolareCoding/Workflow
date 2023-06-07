import {NodeModel} from "../nodes/Node.model";
import {NodeStatusEnum} from "../nodes/NodeStatus.enum";
import UUIDUtils from "../utils/UUID.utils";
export class PipelineModel {
	id: string;
	title: string;
	templateTitle: string;
	isTemplate: boolean;
	status: NodeStatusEnum;
	createTime: number;
	subjectID: string;
	sections: SectionModel[];

	static newInstance(): PipelineModel {
		let pipeline = new PipelineModel();
		pipeline.id = UUIDUtils.getUUID()
		pipeline.title = 'Template'
		pipeline.isTemplate = true
		pipeline.status = NodeStatusEnum.PENDING
		pipeline.createTime = Date.now()
		pipeline.subjectID = '0'
		pipeline.sections = []
		return pipeline;
	}
}

export class SectionModel {
	id: string;
	title: string;
	status: NodeStatusEnum;
	nodes: NodeModel[];

	static newInstance(): SectionModel {
		let section = new SectionModel();
		section.id = UUIDUtils.getUUID();
		section.title = 'Section Title';
		section.status = NodeStatusEnum.PENDING;
		section.nodes = [];
		return section;
	}
}
