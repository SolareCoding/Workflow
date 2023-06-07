import {PipelineModel} from "../pipeline/Pipeline.model";
import {PomodoroModel} from "../pomodoro/Pomodoro.model";
import {SubjectModel} from "../subject/Subject.model";

export class WorkPanelModel {
	templates: PipelineModel[];
	workflows: PipelineModel[];
	pomodoro: PomodoroModel[];
	subject: SubjectModel;

	static newInstance() {
		let newModel = new WorkPanelModel();
		newModel.templates = []
		newModel.workflows = []
		newModel.pomodoro = []
		newModel.subject = SubjectModel.newInstance()
		newModel.subject.name = 'RootSubject'
		return newModel
	}
}
