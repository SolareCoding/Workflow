import {Box, Divider, Stack} from "@mui/material";
import * as React from "react";
import WorkflowKanbanView from "./WorkflowKanban.view";
import PipelineView from "../pipeline/Pipeline.view";
import {WorkflowModel} from "./Workflow.model";
import {PipelineModel, PipelinesModel} from "../pipeline/Pipeline.model";
import {NodeStatusEnum} from "../nodes/NodeStatus.enum";
import {useEffect, useState} from "react";
import PipelineColors from "../common/Pipeline.colors";

export interface WorkflowProps {
	editorMode?: boolean
	workflows: WorkflowModel
	templates: PipelinesModel
	saveData: () => void;
}

export default function WorkflowView(props: WorkflowProps) {

	const { editorMode, workflows, templates, saveData } = props
	const pipelines = workflows.data
	const templatePLs = templates.data

	const getKanbanPipelines = (type: NodeStatusEnum) => {
		const result = []
		for (const pipeline of pipelines) {
			if (pipeline.status == type) {
				result.push(pipeline);
			}
		}
		return result;
	}

	const getFocusPipeline = () => {
		if (focusPL) {
			return <Box>
				<PipelineView pipeline={focusPL} editorMode={editorMode} onPipelineUpdate={onPipelineUpdate} onPipelineRemove={onPipelineRemove}/>
			</Box>
		}
		return null
	}

	const getDefaultPL = () => {
		if (!editorMode && pipelines?.length > 0) {
			return pipelines[0]
		} else if (editorMode && templatePLs?.length > 0) {
			return templatePLs[0]
		} else {
			return null
		}
	}

	const [focusPL, setFocusPL] = useState(getDefaultPL())
	const [flag, setFlag] = useState(false)
	const [pendingWF, setPendingWF] = useState(getKanbanPipelines(NodeStatusEnum.PENDING))
	const [workingWF, setWorkingWF] = useState(getKanbanPipelines(NodeStatusEnum.WORKING))
	const [doneWF, setDoneWF] = useState(getKanbanPipelines(NodeStatusEnum.DONE))
	const [templateWF, setTemplateWF] = useState(templatePLs)

	useEffect(()=> setFocusPL(getDefaultPL()))

	// update workflows
	const save = () => {
		setPendingWF(getKanbanPipelines(NodeStatusEnum.PENDING))
		setWorkingWF(getKanbanPipelines(NodeStatusEnum.WORKING))
		setDoneWF(getKanbanPipelines(NodeStatusEnum.DONE))
		setTemplateWF(templatePLs)
		saveData()
	}

	/**
	 * 更新Selected Pipeline
	 */
	const onPipelineUpdate = () => {
		save()
	}

	const onPipelineRemove = (pipeline: PipelineModel, editorMode?: boolean) => {
		if (!editorMode) {
			pipelines.remove(pipeline)
		} else {
			templatePLs.remove(pipeline)
		}
		setFocusPL(getDefaultPL)
		save()
	}

	const insertPipeline = (pipeline: PipelineModel, editorMode: boolean) => {
		if (!editorMode) {
			pipelines.push(pipeline)
		} else {
			templatePLs.push(pipeline)
		}
		save()
	}
	const selectPipeline = (pipeline: PipelineModel) => {
		setFocusPL(pipeline)
		setFlag(!flag)
	}

	const pendingKanban = <WorkflowKanbanView allowAddNew={true} kanbanTitle={NodeStatusEnum.PENDING} pipelines={pendingWF} selectPipeline={selectPipeline} templates={templatePLs} addNewPipeline={(pipeline) => insertPipeline(pipeline, false)} />
	const workingKanban = <WorkflowKanbanView kanbanTitle={NodeStatusEnum.WORKING} pipelines={workingWF} selectPipeline={selectPipeline} templates={[]} addNewPipeline={(pipeline) => insertPipeline(pipeline, false)}/>
	const doneKanban = <WorkflowKanbanView kanbanTitle={NodeStatusEnum.DONE} pipelines={doneWF} selectPipeline={selectPipeline} templates={[]} addNewPipeline={(pipeline) => insertPipeline(pipeline, false)}/>
	const templateKanban = <WorkflowKanbanView editorMode={true} kanbanTitle={'Template'} pipelines={templateWF} selectPipeline={selectPipeline} templates={templatePLs} addNewPipeline={(pipeline) => insertPipeline(pipeline, true)} />

	const getKanbanViews = () => {
		if (!editorMode) {
			return <Stack spacing={3} sx={{alignItems: 'center'}} direction='row' >
				{pendingKanban}
				{workingKanban}
				{doneKanban}
			</Stack>
		} else {
			return templateKanban
		}
	}

	return(
		<Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'background.paper', margin: 3}}>
			{ getKanbanViews() }
			{ getFocusPipeline() }
		</Box>
	)
}
