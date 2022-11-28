import {Box, Stack} from "@mui/material";
import * as React from "react";
import WorkflowKanbanView from "./WorkflowKanban.view";
import PipelineView from "../pipeline/Pipeline.view";
import {WorkflowModel} from "./Workflow.model";
import {PipelineModel, PipelinesModel} from "../pipeline/Pipeline.model";
import {NodeStatusEnum} from "../nodes/NodeStatus.enum";

export interface WorkflowProps {
	data: WorkflowModel
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

	const [focusPL, setFocusPL] = React.useState(props.data.data[0])
	const [flag, setFlag] = React.useState(false)
	const [pendingWF, setPendingWF] = React.useState(getKanbanPipelines(NodeStatusEnum.PENDING, props.data))
	const [workingWF, setWorkingWF] = React.useState(getKanbanPipelines(NodeStatusEnum.WORKING, props.data))
	const [doneWF, setDoneWF] = React.useState(getKanbanPipelines(NodeStatusEnum.DONE, props.data))

	// update workflows
	const save = () => {
		setPendingWF(getKanbanPipelines(NodeStatusEnum.PENDING, props.data))
		setWorkingWF(getKanbanPipelines(NodeStatusEnum.WORKING, props.data))
		setDoneWF(getKanbanPipelines(NodeStatusEnum.DONE, props.data))
		props.saveData()
	}

	const selectPipeline = (pipeline: PipelineModel) => {
		setFocusPL(pipeline)
	}

	const pendingKanban = <WorkflowKanbanView title={NodeStatusEnum.PENDING} data={pendingWF} onPipelineClick={selectPipeline} />
	const workingKanban = <WorkflowKanbanView title={NodeStatusEnum.WORKING} data={workingWF} onPipelineClick={selectPipeline}/>
	const doneKanban = <WorkflowKanbanView title={NodeStatusEnum.DONE} data={doneWF} onPipelineClick={selectPipeline}/>

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
