import {Box, Typography} from "@mui/material";
import * as React from "react";
import {useEffect, useState} from "react";
import WorkflowKanbanView, {SectionPipelines} from "./WorkflowKanban.view";
import PipelineView from "../pipeline/Pipeline.view";
import {PipelineModel} from "../pipeline/Pipeline.model";
import {NodeStatusEnum} from "../nodes/NodeStatus.enum";
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';

export interface WorkflowProps {
	workflows: PipelineModel[]
	templates: PipelineModel[]
}

export default function WorkflowView(props: WorkflowProps) {

	const [workflowKanbanFold, setWorkflowKanbanFold] = useState(true)
	const [templateKanbanFold, setTemplateKanbanFold] = useState(true)
	const [focusPipeline, setFocusPipeline] = useState(props.workflows.length > 0 ? props.workflows[0] : undefined)

	useEffect(()=> {
		// no prev focus pipeline
		if (!focusPipeline) {
			setFocusPipeline(props.workflows.length > 0 ? props.workflows[0] : undefined)
			return
		}
		if (!focusPipeline.isTemplate && !props.workflows.contains(focusPipeline)) {
			const samePipelineIndex = props.workflows.findIndex((value, index, object) => value.id === focusPipeline.id)
			if (samePipelineIndex === -1) {
				setFocusPipeline(props.workflows.length > 0 ? props.workflows[0] : undefined)
			} else {
				setFocusPipeline(props.workflows[samePipelineIndex])
			}
			return
		}
		if (focusPipeline.isTemplate && !props.templates.contains(focusPipeline)) {
			const samePipelineIndex = props.templates.findIndex((value, index, object) => value.id === focusPipeline.id)
			if (samePipelineIndex === -1) {
				setFocusPipeline(props.templates.length > 0? props.templates[0] : undefined)
			} else {
				setFocusPipeline(props.templates[samePipelineIndex])
			}
			return
		}
	}, [props])

	const getKanbanPipelines = () => {
		const sectionPipelines:SectionPipelines[] = []
		const pendingPipelines = []
		const workingPipelines = []
		const donePipelines = []
		for (const pipeline of props.workflows) {
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
		sectionPipelines.push({sectionName: 'Template', pipelines: props.templates});
		return sectionPipelines;
	}

	const getFocusPipeline = () => {
		if (!focusPipeline) {
			return <div className={'workflow-container-outer'} style={{width: '100%', height: '100%', display: "flex", alignItems: 'center', justifyContent: 'center'}}>
				<Typography sx={{minWidth: 500}}>
					Open the left drawer to choose a workflow.
					<br/>
					Open the right drawer to manage templates.
				</Typography>
			</div>
		}
		return <PipelineView pipeline={focusPipeline} />
	}

	const selectPipeline = (pipeline: PipelineModel) => {
		setFocusPipeline(pipeline)
	}

	const workflowKanban = <WorkflowKanbanView kanbanTitle={'workflow'}
											   sectionPipelines={getKanbanPipelines()}
											   selectedPipeline={focusPipeline}
											   selectPipeline={selectPipeline}
											   templates={props.templates}/>
	const templateKanban = <WorkflowKanbanView editorMode={true} kanbanTitle={'template'}
											   sectionPipelines={getTemplatePipelines()}
											   selectedPipeline={focusPipeline}
											   selectPipeline={selectPipeline}
											   templates={props.templates}/>

	const getFoldWorkflowKanbanView = () => {
		return <div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}
					onClick={() => {
						setWorkflowKanbanFold(!workflowKanbanFold)
					}}>
			{!workflowKanbanFold ? <KeyboardDoubleArrowLeftIcon/> : <KeyboardDoubleArrowRightIcon/>}
		</div>
	}

	const getFoldTemplateKanbanView = () => {
		return <div style={{height: '100%', display: 'flex', alignItems: 'center'}}
					onClick={() => {
						setTemplateKanbanFold(!templateKanbanFold)
					}}>
			{!templateKanbanFold ? <KeyboardDoubleArrowRightIcon/> : <KeyboardDoubleArrowLeftIcon/> }
		</div>
	}

	const getWorkflowKanban = () => {
		return <div className={'workflow-container-outer'} style={{position: 'absolute', left: 0, display: 'flex', flexDirection: 'row', height: '100%', padding: 10}}>
			{getFoldWorkflowKanbanView()}
			{!workflowKanbanFold ? workflowKanban : null}
		</div>
	}

	const getTemplateKanban = () => {
		return <div className={'workflow-container-outer'} style={{position: 'absolute', right: 0, display: 'flex', flexDirection: 'row', height: '100%', padding: 10}}>
			{!templateKanbanFold ? templateKanban : null}
			{getFoldTemplateKanbanView()}
		</div>
	}

	return (
		<div style={{
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
			height: '100%',
			width: '100%',
		}}>
			{getFocusPipeline()}
			{getWorkflowKanban()}
			{getTemplateKanban()}
		</div>
	)
}
