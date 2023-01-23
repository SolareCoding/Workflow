import {Box} from "@mui/material";
import * as React from "react";
import {useState} from "react";
import WorkflowKanbanView, {SectionPipelines} from "./WorkflowKanban.view";
import PipelineView from "../pipeline/Pipeline.view";
import {WorkflowModel} from "./Workflow.model";
import {PipelineModel, PipelinesModel} from "../pipeline/Pipeline.model";
import {NodeStatusEnum} from "../nodes/NodeStatus.enum";
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';

export interface WorkflowProps {
	editorMode?: boolean
	workflows: WorkflowModel
	templates: PipelinesModel
	saveData: () => void;
}

export default function WorkflowView(props: WorkflowProps) {

	const {editorMode, workflows, templates, saveData} = props
	const pipelines = workflows.data
	const templatePLs = templates.data

	const getDefaultPL = () => {
		if (!editorMode && pipelines?.length > 0) {
			return pipelines[0]
		} else if (editorMode && templatePLs?.length > 0) {
			return templatePLs[0]
		} else {
			return undefined
		}
	}

	const [foldKanban, setFoldKanban] = useState(true)
	const [flag, setFlag] = useState(false)
	const [focusPL, setFocusPL] = useState(getDefaultPL())

	const getKanbanPipelines = () => {
		const sectionPipelines:SectionPipelines[] = []
		const pendingPipelines = []
		const workingPipelines = []
		const donePipelines = []
		for (const pipeline of pipelines) {
			switch (pipeline.status) {
				case NodeStatusEnum.PENDING:
					pendingPipelines.push(pipeline)
					break
				case NodeStatusEnum.WORKING:
					workingPipelines.push(pipeline)
					break
				case NodeStatusEnum.DONE:
					donePipelines.push(pipeline)
					break
				default:
					break
			}
		}
		sectionPipelines.push({sectionName: NodeStatusEnum.PENDING, pipelines: pendingPipelines});
		sectionPipelines.push({sectionName: NodeStatusEnum.WORKING, pipelines: workingPipelines});
		sectionPipelines.push({sectionName: NodeStatusEnum.DONE, pipelines: donePipelines});
		return sectionPipelines;
	}

	const getTemplatePipelines = () => {
		const sectionPipelines:SectionPipelines[] = []
		sectionPipelines.push({sectionName: 'Template', pipelines: templatePLs});
		return sectionPipelines;
	}

	const getFocusPipeline = () => {
		if (focusPL) {
			return <Box sx={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
				<PipelineView pipeline={focusPL} editorMode={editorMode} onPipelineUpdate={onPipelineUpdate}
							  onPipelineRemove={onPipelineRemove}/>
			</Box>
		}
		return null
	}

	// update workflows
	const save = () => {
		saveData()
	}

	/**
	 * 更新Selected Pipeline
	 */
	const onPipelineUpdate = () => {
		setFocusPL(getDefaultPL)
		save()
	}

	const onPipelineRemove = (pipeline: PipelineModel, editorMode?: boolean) => {
		if (!editorMode) {
			pipelines.remove(pipeline)
		} else {
			templatePLs.remove(pipeline)
		}
		setFlag(!flag)
		setFocusPL(getDefaultPL)
		save()
	}

	const insertPipeline = (pipeline: PipelineModel, editorMode: boolean) => {
		if (!editorMode) {
			pipelines.push(pipeline)
		} else {
			templatePLs.push(pipeline)
		}
		setFlag(!flag)
		save()
	}
	const selectPipeline = (pipeline: PipelineModel) => {
		setFocusPL(pipeline)
	}

	const workflowKanban = <WorkflowKanbanView kanbanTitle={'workflow'}
											  sectionPipelines={getKanbanPipelines()} selectedPipeline={focusPL}
											  selectPipeline={selectPipeline} templates={templatePLs}
											  addNewPipeline={(pipeline) => insertPipeline(pipeline, false)}/>
	const templateKanban = <WorkflowKanbanView editorMode={true} kanbanTitle={'template'} sectionPipelines={getTemplatePipelines()}
											   selectPipeline={selectPipeline} templates={templatePLs}
											   addNewPipeline={(pipeline) => insertPipeline(pipeline, true)}/>

	const getFoldKanbanView = () => {
		return <div style={{height: '100%', display: 'flex', alignItems:'center'}} onClick={() => setFoldKanban(!foldKanban)}>
			{foldKanban ? <KeyboardDoubleArrowRightIcon/> : <KeyboardDoubleArrowLeftIcon/> }
		</div>
	}

	const getWorkflowKanbans = () => {
		return <div style={{display: 'flex', flexDirection: 'row', height: '100%', padding: 10}}>
					{!foldKanban ? workflowKanban : false}
					{getFoldKanbanView()}
			</div>
	}

	const getTemplateKanbans = () => {
		return <div style={{display: 'flex', flexDirection: 'row', height: '100%', padding: 10, alignItems: 'center'}}>
			{!foldKanban ? templateKanban : false}
			{getFoldKanbanView()}
		</div>
	}

	const getKanbanViews = () => {
		if (!editorMode) {
			return getWorkflowKanbans()
		} else {
			return getTemplateKanbans()
		}
	}

	return (
		<div style={{
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
			height: '100%',
			width: '100%',
		}}>
			{getKanbanViews()}
			{getFocusPipeline()}
		</div>
	)
}
