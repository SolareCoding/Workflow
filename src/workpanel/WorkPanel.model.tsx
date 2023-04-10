import {PipelineModel} from "../pipeline/Pipeline.model";
import {PomodoroModel} from "../pomodoro/Pomodoro.model";

export class WorkPanelModel {
	templates: PipelineModel[];
	workflows: PipelineModel[];
	pomodoro: PomodoroModel[]

	static newInstance() {
		let newModel = new WorkPanelModel();
		newModel.templates = []
		newModel.workflows = []
		newModel.pomodoro = []
		return newModel
	}
}
