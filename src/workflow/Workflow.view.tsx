import {Box, Stack} from "@mui/material";
import * as React from "react";
import WorkflowKanbanView from "./WorkflowKanban.view";
import PipelineView from "../pipeline/Pipeline.view";
import {WorkflowModel} from "./Workflow.model";
import {PipelineModel, PipelinesModel} from "../pipeline/Pipeline.model";
import {NodeStatusEnum} from "../nodes/NodeStatus.enum";

export interface WorkflowProps {
	workflows: WorkflowModel
	templates: PipelinesModel
	saveData: () => void;
}

export default function WorkflowView(props: WorkflowProps) {

	const getKanbanPipelines = (type: NodeStatusEnum, workflowModel: WorkflowModel) => {
		const result = []
		for (const pipeline of workflowModel.data) {
			if (pipeline.status == type) {
				result.push(pipeline);
			}
		}
		return result;
	}

	const [focusPL, setFocusPL] = React.useState(props.workflows.data[0])
	const [pendingWF, setPendingWF] = React.useState(getKanbanPipelines(NodeStatusEnum.PENDING, props.workflows))
	const [workingWF, setWorkingWF] = React.useState(getKanbanPipelines(NodeStatusEnum.WORKING, props.workflows))
	const [doneWF, setDoneWF] = React.useState(getKanbanPipelines(NodeStatusEnum.DONE, props.workflows))

	// update workflows
	const save = () => {
		setPendingWF(getKanbanPipelines(NodeStatusEnum.PENDING, props.workflows))
		setWorkingWF(getKanbanPipelines(NodeStatusEnum.WORKING, props.workflows))
		setDoneWF(getKanbanPipelines(NodeStatusEnum.DONE, props.workflows))
		props.saveData()
	}

	const insertPipeline = (pipeline: PipelineModel) => {
		props.workflows.data.push(pipeline)
		save()
	}

	const selectPipeline = (pipeline: PipelineModel) => {
		setFocusPL(pipeline)
	}

	const pendingKanban = <WorkflowKanbanView kanbanTitle={NodeStatusEnum.PENDING} workflows={pendingWF} selectPipeline={selectPipeline} templates={props.templates.data} addNewPipeline={insertPipeline} />
	const workingKanban = <WorkflowKanbanView kanbanTitle={NodeStatusEnum.WORKING} workflows={workingWF} selectPipeline={selectPipeline} templates={[]} addNewPipeline={insertPipeline}/>
	const doneKanban = <WorkflowKanbanView kanbanTitle={NodeStatusEnum.DONE} workflows={doneWF} selectPipeline={selectPipeline} templates={[]} addNewPipeline={insertPipeline}/>

	return(
		<Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'background.paper', margin: 3}}>
			<Box>
				<PipelineView data={focusPL} saveData={save} />
			</Box>

			<Stack spacing={3} sx={{alignItems: 'center'}} direction='row' >
				{pendingKanban}
				{workingKanban}
				{doneKanban}
			</Stack>
		</Box>
	)
}