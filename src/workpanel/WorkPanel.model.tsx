import {PipelinesModel} from "../pipeline/Pipeline.model";
import {WorkflowModel} from "../workflow/Workflow.model";

export class WorkPanelModel {
	pipelines: PipelinesModel;
	workflows: WorkflowModel;

	static newInstance() {
		let newModel = new WorkPanelModel();
		newModel.pipelines = new PipelinesModel();
		newModel.pipelines.data = []
		newModel.workflows = new WorkflowModel();
		newModel.workflows.data = []
		return newModel
	}
}
