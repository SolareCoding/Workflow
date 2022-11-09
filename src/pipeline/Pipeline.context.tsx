import {NodeModel} from "../nodes/Node.model";

export interface PipelineContext {
	updateNode: (node: NodeModel)=> void;
}
