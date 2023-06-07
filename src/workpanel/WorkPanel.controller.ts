import {NodeModel} from "../nodes/Node.model";
import {PipelineModel, SectionModel} from "../pipeline/Pipeline.model";
import WorkflowPlugin from "../../main";
import {PomodoroModel} from "../pomodoro/Pomodoro.model";
import {SubjectModel} from "../subject/Subject.model";

export enum UpdateMode {
	ADD,
    UPDATE,
    DELETE,
}
export class WorkPanelController {

	plugin?: WorkflowPlugin

	updateNode(pipeline: PipelineModel, section: SectionModel, node: NodeModel, updateMode: UpdateMode = UpdateMode.UPDATE):void  {}

	updateSection(pipeline: PipelineModel, section: SectionModel, updateMode: UpdateMode = UpdateMode.UPDATE): void {}

	updatePipeline(pipeline: PipelineModel, updateMode: UpdateMode = UpdateMode.UPDATE): void {}

	updatePomodoro(pomodoro: PomodoroModel, updateMode: UpdateMode = UpdateMode.UPDATE): void {}

	updateSubject(subject: SubjectModel, updateMode: UpdateMode = UpdateMode.UPDATE): void {}
}
