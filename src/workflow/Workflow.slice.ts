import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../repository/Workflow.store";
import {PipelineModel, SectionModel} from "../pipeline/Pipeline.model";
import {WorkPanelModel} from "../workpanel/WorkPanel.model";
import {NodeModel} from "../nodes/Node.model";

export interface WorkflowState {
	pipelines: PipelineModel[]
	templates: PipelineModel[]
	hasLoaded: boolean
}

const initialState: WorkflowState = {
	pipelines: [],
	templates: [],
	hasLoaded: false
}

export enum UpdateMode {
	ADD,
	UPDATE,
	DELETE,
}

export interface PipelineAction {
	pipeline: PipelineModel
	isEditMode: boolean
	updateMode: UpdateMode
}

export interface SectionAction {
	pipeline: PipelineModel
	section: SectionModel
	isEditMode: boolean
	updateMode: UpdateMode
	index?: number
}

export interface NodeAction {
	pipeline: PipelineModel
	section: SectionModel
	node: NodeModel
	isEditMode: boolean
	updateMode: UpdateMode
	index?: number
}

const searchPipelineIndex = (pipelines: PipelineModel[], pipeline: PipelineModel) => {
	return pipelines.findIndex((value) => value.id == pipeline.id)
}

const searchSectionIndex = (sections: SectionModel[], section: SectionModel) => {
	return sections.findIndex((value) => value.id == section.id)
}

const searchSection = (pipelines: PipelineModel[], pipeline: PipelineModel, section: SectionModel) => {
	const localPipeline = pipelines.find((value) => value.id == pipeline.id)
	const localSection = localPipeline ? localPipeline.sections.find((value) => value.id == section.id) : undefined
	return localSection

}

export const workflowSlice = createSlice({
	name: 'workflow',
	initialState,
	reducers: {
		loadWorkflow:  (state, action: PayloadAction<WorkPanelModel>) => {
			state.pipelines = action.payload.workflows
			state.templates = action.payload.templates
			state.hasLoaded = true
		},
		updatePipeline: (state, action: PayloadAction<PipelineAction>) => {
			switch (action.payload.updateMode) {
				case UpdateMode.ADD:
					if (action.payload.isEditMode) {
						state.templates.push(action.payload.pipeline);
					} else {
						state.pipelines.push(action.payload.pipeline);
					}
					break;
				case UpdateMode.DELETE:
					const index = searchPipelineIndex(action.payload.isEditMode ? state.templates : state.pipelines, action.payload.pipeline);
					if (index > -1) {
						if (action.payload.isEditMode) {
							state.templates.splice(index, 1);
						} else {
							state.pipelines.splice(index, 1);
						}
					}
					break;
				case UpdateMode.UPDATE:
					const updateIndex = searchPipelineIndex(action.payload.isEditMode ? state.templates : state.pipelines, action.payload.pipeline);
					if (updateIndex > -1) {
						if (action.payload.isEditMode) {
							Object.assign(state.templates[updateIndex], action.payload.pipeline)
						} else {
							Object.assign(state.pipelines[updateIndex], action.payload.pipeline)
						}
					}
					break;
			}
		},
		updateSection: (state, action: PayloadAction<SectionAction>) => {
			switch (action.payload.updateMode) {
				case UpdateMode.ADD:
					const index = searchPipelineIndex(action.payload.isEditMode? state.templates : state.pipelines, action.payload.pipeline);
						if (index > -1) {
							if (action.payload.isEditMode) {
								state.templates[index].sections.splice(action.payload.index || 0, 0, action.payload.section);
							} else {
								state.pipelines[index].sections.splice(action.payload.index || 0, 0, action.payload.section);
							}
						}
					break;
				case UpdateMode.DELETE:
					const deletePipelineIndex = searchPipelineIndex(action.payload.isEditMode? state.templates : state.pipelines, action.payload.pipeline);
					if (deletePipelineIndex > -1) {
						if (action.payload.isEditMode) {
							const deleteSectionIndex = searchSectionIndex(state.templates[deletePipelineIndex].sections, action.payload.section)
							state.templates[deletePipelineIndex].sections.splice(deleteSectionIndex, 1);
						} else {
							const deleteSectionIndex = searchSectionIndex(state.pipelines[deletePipelineIndex].sections, action.payload.section)
							state.pipelines[deletePipelineIndex].sections.splice(deleteSectionIndex, 1);
						}
					}
					break;
				case UpdateMode.UPDATE:
					const updatePipelineIndex = searchPipelineIndex(action.payload.isEditMode? state.templates : state.pipelines, action.payload.pipeline);
					if (updatePipelineIndex > -1) {
						if (action.payload.isEditMode) {
							const updateSectionIndex = searchSectionIndex(state.templates[updatePipelineIndex].sections, action.payload.section)
							Object.assign(state.templates[updatePipelineIndex].sections[updateSectionIndex], action.payload.section)
						} else {
							const updateSectionIndex = searchSectionIndex(state.pipelines[updatePipelineIndex].sections, action.payload.section)
							Object.assign(state.pipelines[updatePipelineIndex].sections[updateSectionIndex], action.payload.section)
						}
					}
					break;
			}
		},
		updateNode: (state, action: PayloadAction<NodeAction>) => {
			switch (action.payload.updateMode) {
				case UpdateMode.ADD:
					const sectionForAdd = searchSection(action.payload.isEditMode? state.templates : state.pipelines, action.payload.pipeline, action.payload.section)
					sectionForAdd?.nodes.splice(action.payload.index || 0, 0, action.payload.node);
					break;

				case UpdateMode.DELETE:
					const localSection = searchSection(action.payload.isEditMode? state.templates : state.pipelines, action.payload.pipeline, action.payload.section)
					const deleteNodeIndex = localSection?.nodes.findIndex((value) => value.id == action.payload.node.id)
					if (deleteNodeIndex != undefined && deleteNodeIndex > -1) {
						localSection?.nodes.splice(deleteNodeIndex, 1);
					}
					break;
				case UpdateMode.UPDATE:
					const localUpdateSection = searchSection(action.payload.isEditMode? state.templates : state.pipelines, action.payload.pipeline, action.payload.section)
					console.log('localUpdateSection ', JSON.stringify(localUpdateSection))
					const updateNodeIndex = localUpdateSection?.nodes.findIndex((value) => value.id == action.payload.node.id)
					if (updateNodeIndex != undefined && updateNodeIndex > -1 && localUpdateSection?.nodes[updateNodeIndex]) {
						console.log('node to update ', JSON.stringify(localUpdateSection?.nodes[updateNodeIndex]))
						Object.assign(localUpdateSection?.nodes[updateNodeIndex], action.payload.node)
					}
					break
			}
		},
	},
});

export const { loadWorkflow, updatePipeline, updateSection, updateNode } = workflowSlice.actions;

export const selectWorkflow = (state: RootState) => state.workflow

export default workflowSlice.reducer;
