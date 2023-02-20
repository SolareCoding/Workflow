import {PipelineModel} from "../pipeline/Pipeline.model";

export class WorkPanelModel {
	templates: PipelineModel[];
	workflows: PipelineModel[];

	static newInstance() {
		let newModel = new WorkPanelModel();
		newModel.templates = []
		newModel.workflows = []
		return newModel
	}
}
