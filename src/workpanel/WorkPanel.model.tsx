import {NodeModel, NodesModel} from "../nodes/Node.model";
import {PipelinesModel} from "../pipeline/Pipeline.model";
import {WorkflowModel} from "../workflow/Workflow.model";
import {PomodorosModel} from "../pomodoro/Pomodoro.model";

export interface WorkPanelModel {
	nodes: NodesModel,
	pipelines: PipelinesModel,
	workflows: WorkflowModel,
	pomodoros: PomodorosModel,
}
