import Box from "@mui/material/Box";
import {Divider, IconButton, Stack, Typography} from "@mui/material";
import * as React from "react";
import {PipelineModel} from "../pipeline/Pipeline.model";
import {NodeStatusEnum} from "../nodes/NodeStatus.enum";
import {TimeUtils} from "../utils/Time.utils";
import {useEffect} from "react";
import NewPipelineDialog from "./NewPipelineDialog.view";

export interface WorkflowKanbanProps {
	kanbanTitle: string,
	workflows: PipelineModel[],
	templates: PipelineModel[],
	selectPipeline: (pipeline: PipelineModel) => void,
	addNewPipeline: (pipeline: PipelineModel) => void
}

/**
 * A workflow kanban consists
 * @constructor
 */
export default function WorkflowKanbanView(props: WorkflowKanbanProps) {

	const [open, setOpen] = React.useState(false);

	const getProgress = (pipeline: PipelineModel) => {
		let totalNodes = 0;
		let doneNodes = 0;
		for (const section of pipeline.sections) {
			for (const sectionElement of section.nodes) {
				totalNodes ++
				if (sectionElement.status == NodeStatusEnum.DONE) {
					doneNodes ++
				}
			}
		}
		return doneNodes + '/' + totalNodes
	}

	// show a dialog for user to choose a template, and add it to the current Kanban
	const addNewWorkflow = (pipeline: PipelineModel) => {
		props.addNewPipeline(pipeline)
	}

	const handleClose = () => {
		setOpen(false);
	}

	const handleCreateNewTask = (pipeline: PipelineModel) => {
		setOpen(false);
		addNewWorkflow(pipeline)
		console.log("handle create new task")
	}

	const openNewPipelineDialog = () => {
		setOpen(true);
	}

	const addNewView = <Box onClick={(event) => openNewPipelineDialog()}>
		<Typography variant="body2" sx={{fontWeight: '600', color: "#336666", textAlign: 'center'}}>
			Add new
		</Typography>
	</Box>

	const getPipelines = () => {
		let pipelines = []
		if (props.kanbanTitle == NodeStatusEnum.PENDING) {
			pipelines.push(addNewView)
		}
		for (const pipeline of props.workflows) {
			pipelines.push(
				<Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', id: pipeline.id}} onClick={()=>{
					props.selectPipeline(pipeline)}}>
					<Box>
						<Typography>
							{pipeline.title}
						</Typography>
					</Box>
					<Box sx={{width: 110, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
						<Typography variant="body2">
							{TimeUtils.getDateTimeStr(pipeline.createTime)}
						</Typography>
						<Typography variant="body2" sx={{fontWeight: '600', color: "#336666"}}>
							{getProgress(pipeline)}
						</Typography>
					</Box>
				</Box>
			)
		}
		return pipelines
	}

	return (
		<Box sx={{width: 300, bgcolor: 'background.paper', padding: 1, borderRadius: 1, boxShadow: 1, height: 300, overflow: 'scroll'}}>
			<Typography variant="h5" gutterBottom color={'#333366'}>
				{'Kanban: ' + props.kanbanTitle}
			</Typography>
			<Divider sx={{marginY: 1}}/>
			<Stack spacing={1} divider={<Divider orientation="horizontal" flexItem />}>
				{getPipelines()}
			</Stack>
			<NewPipelineDialog
				templates={props.templates}
				open={open}
				closeDialog={handleClose}
				createNewTask={handleCreateNewTask}
			/>
		</Box>
	);
}