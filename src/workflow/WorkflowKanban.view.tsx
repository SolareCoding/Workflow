import Box from "@mui/material/Box";
import {Divider, IconButton, Stack, Typography} from "@mui/material";
import * as React from "react";
import {PipelineModel, PipelineNodeModel} from "../pipeline/Pipeline.model";
import {NodeStatusEnum} from "../nodes/NodeStatus.enum";
import {TimeUtils} from "../utils/Time.utils";
import {useEffect} from "react";
import NewPipelineDialog from "./NewPipelineDialog.view";

export interface WorkflowKanbanProps {
	allowAddNew?: boolean,
	editorMode?: boolean,
	kanbanTitle: string,
	pipelines: PipelineModel[],
	templates: PipelineModel[],
	selectPipeline: (pipeline: PipelineModel) => void,
	addNewPipeline: (pipeline: PipelineModel) => void
}

/**
 * A workflow kanban consists
 * @constructor
 */
export default function WorkflowKanbanView(props: WorkflowKanbanProps) {

	const { allowAddNew, editorMode, kanbanTitle, pipelines, templates, selectPipeline, addNewPipeline } = props

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

	const handleClose = () => {
		setOpen(false);
	}

	// show a dialog for user to choose a template, and add it to the current Kanban
	const handleCreateNewTask = (pipeline: PipelineModel) => {
		setOpen(false);
		addNewPipeline(pipeline)
	}

	const openNewPipelineDialog = () => {
		setOpen(true);
	}

	const handCreateNewTemplate = () => {
		addNewPipeline(PipelineModel.newInstance())
	}

	const addNewView = <Box onClick={(event) => openNewPipelineDialog()}>
		<Typography variant="body2" sx={{fontWeight: '600', color: "#336666", textAlign: 'center'}}>
			Add new
		</Typography>
	</Box>

	const addNewTemplateView = <Box onClick={(event) => handCreateNewTemplate()}>
		<Typography variant="body2" sx={{fontWeight: '600', color: "#336666", textAlign: 'center'}}>
			Add new template
		</Typography>
	</Box>

	const getPipelines = () => {
		let pipelineViews = []
		if (allowAddNew) {
			pipelineViews.push(addNewView)
		}
		if (editorMode) {
			pipelineViews.push(addNewTemplateView)
		}
		for (const pipeline of pipelines) {
			pipelineViews.push(
				<Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', id: pipeline.id}} onClick={()=>{
					selectPipeline(pipeline)}}>
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
		return pipelineViews
	}

	return (
		<Box sx={{width: 300, bgcolor: 'background.paper', padding: 1, borderRadius: 1, boxShadow: 1, height: 300, overflow: 'scroll'}}>
			<Typography variant="h5" gutterBottom color={'#333366'}>
				{'Kanban: ' + kanbanTitle}
			</Typography>
			<Divider sx={{marginY: 1}}/>
			<Stack spacing={1} divider={<Divider orientation="horizontal" flexItem />}>
				{getPipelines()}
			</Stack>
			<NewPipelineDialog
				templates={templates}
				open={open}
				closeDialog={handleClose}
				createNewTask={handleCreateNewTask}
			/>
		</Box>
	);
}
