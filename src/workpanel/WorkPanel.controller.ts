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

	updateSubject(subject: SubjectModel, updateMode: UpdateMode = UpdateMode.UPDATE): void {}
}
