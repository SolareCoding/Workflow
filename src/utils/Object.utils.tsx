import {PipelineModel} from "../pipeline/Pipeline.model";
import UUIDUtils from "./UUID.utils";
import {NodeStatusEnum} from "../nodes/NodeStatus.enum";

export function deepCopy(obj: any): any {
	if (obj === null || typeof obj !== 'object') {
		return obj;
	}

	if (Array.isArray(obj)) {
		const copy: any[] = [];
		for (let i = 0; i < obj.length; i++) {
			copy[i] = deepCopy(obj[i]);
		}
		return copy;
	}

	const copy: { [key: string]: any } = {};
	for (const key in obj) {
		if (obj.hasOwnProperty(key)) {
			copy[key] = deepCopy(obj[key]);
		}
	}
	return copy;
}

export function genPipelineFromTemplate(template: PipelineModel, taskName: string, subjectID: string) {
	// deep copy template and modify uuid
	const copiedSections = []
	for (const section of template.sections) {
		const copiedSection = Object.assign({}, section)
		copiedSection.id = UUIDUtils.getUUID()
		const copiedNodes = []
		for (const node of copiedSection.nodes) {
			const copiedNode = Object.assign({}, node)
			copiedNode.id = UUIDUtils.getUUID()
			copiedNodes.push(copiedNode)
		}
		copiedSection.nodes = copiedNodes
		copiedSections.push(copiedSection)
	}
	const copiedPipeline: PipelineModel = {
		templateTitle: template.title,
		title: taskName,
		createTime: Date.now(),
		status: NodeStatusEnum.PENDING,
		isTemplate: false,
		id: UUIDUtils.getUUID(),
		subjectID: subjectID,
		sections: copiedSections
	}
	return copiedPipeline
}
