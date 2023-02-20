import {WorkPanelModel} from "./WorkPanel.model";
import {NodeModel} from "../nodes/Node.model";
import {PipelineModel, SectionModel} from "../pipeline/Pipeline.model";

export enum UpdateMode {
	ADD,
    UPDATE,
    DELETE,
}
export class WorkPanelController {

	updateNode(pipeline: PipelineModel, section: SectionModel, node: NodeModel, updateMode: UpdateMode = UpdateMode.UPDATE):void  {}

	updateSection(pipeline: PipelineModel, section: SectionModel, updateMode: UpdateMode = UpdateMode.UPDATE): void {}

	updatePipeline(pipeline: PipelineModel, updateMode: UpdateMode = UpdateMode.UPDATE): void {}
}
