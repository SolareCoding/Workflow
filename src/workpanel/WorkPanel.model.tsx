import {NodeModel, NodesModel} from "../nodes/Node.model";
import {PipelinesModel} from "../pipeline/Pipeline.model";

export interface WorkPanelModel {
	nodes: NodesModel,
	pipelines: PipelinesModel
}
