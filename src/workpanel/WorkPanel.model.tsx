import {PipelineModel} from "../pipeline/Pipeline.model";
import {PomodoroModel} from "../pomodoro/Pomodoro.model";
import {newSubjectInstance, SubjectModel} from "../subject/Subject.model";

export interface WorkPanelModel {
	templates: PipelineModel[];
	workflows: PipelineModel[];
	pomodoro: PomodoroModel[];
	subject: SubjectModel;
}

export function newWorkPanelModel(): WorkPanelModel {
	return {
		templates: [],
		workflows: [],
		pomodoro: [],
		subject: newSubjectInstance(),
	}
}
