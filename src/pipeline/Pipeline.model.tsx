import {NodeModel} from "../nodes/Node.model";
import {NodeStatusEnum} from "../nodes/NodeStatus.enum";
import UUIDUtils from "../utils/UUID.utils";
export interface PipelineModel {
	id: string;
	title: string;
	templateTitle: string;
	isTemplate: boolean;
	status: NodeStatusEnum;
	createTime: number;
	subjectID: string;
	sections: SectionModel[];
}

export function newPipelineInstance(): PipelineModel {
	return {
		id: UUIDUtils.getUUID(),
		title: 'Template',
		templateTitle: '',
		isTemplate: true,
		status: NodeStatusEnum.PENDING,
		createTime: Date.now(),
		subjectID: '0',
		sections: [],
	}
}

export interface SectionModel {
	id: string;
	title: string;
	status: NodeStatusEnum;
	nodes: NodeModel[];
}

export function newSectionInstance(): SectionModel {
	return {
		id: UUIDUtils.getUUID(),
		title: 'Section Title',
		status: NodeStatusEnum.PENDING,
		nodes: [],
	}
}
