import Box from "@mui/material/Box";
import {Divider, Typography} from "@mui/material";
import * as React from "react";
import {useContext, useState} from "react";
import {PipelineModel} from "../pipeline/Pipeline.model";
import {NodeStatusEnum} from "../nodes/NodeStatus.enum";
import {TimeUtils} from "../utils/Time.utils";
import NewPipelineDialog from "./NewPipelineDialog.view";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import {WorkPanelContext} from "../workpanel/WorkPanel.view";
import {UpdateMode} from "../workpanel/WorkPanel.controller";

export interface SectionPipelines {
	sectionName: string;
	pipelines: PipelineModel[];
}

export interface WorkflowKanbanProps {
	editorMode?: boolean,
	kanbanTitle: string,
	sectionPipelines: SectionPipelines[],
	templates: PipelineModel[],
	selectedPipeline?: PipelineModel,
	selectPipeline: (pipeline: PipelineModel) => void,
}

/**
 * A workflow kanban consists
 * @constructor
 */
export default function WorkflowKanbanView(props: WorkflowKanbanProps) {

	const {editorMode, kanbanTitle, sectionPipelines, selectedPipeline, templates, selectPipeline } = props
	const [openDialog, setOpenDialog] = useState(false);
	const [pendingCollapse, setPendingCollapse] = useState(true);
	const [workingCollapse, setWorkingCollapse] = useState(true);
	const [doneCollapse, setDoneCollapse] = useState(true);

	const workPanelController = useContext(WorkPanelContext)

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

	const openNewPipelineDialog = () => {
		setOpenDialog(true);
	}

	const closeNewPipelineDialog = () => {
		setOpenDialog(false);
	}

	// show a dialog for user to choose a template, and add it to the current Kanban
	const handleCreateNewPipeline = (pipeline: PipelineModel) => {
		setOpenDialog(false);
		selectPipeline(pipeline)
		workPanelController.updatePipeline(pipeline, UpdateMode.ADD)
	}

	const handleCreateNewTemplate = () => {
		const newTemplatePipeline = PipelineModel.newInstance()
		selectPipeline(newTemplatePipeline)
		workPanelController.updatePipeline(newTemplatePipeline, UpdateMode.ADD)
	}

	const addNewView = <Box className='workflow-accent' sx={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center'}} onClick={()=>{
			!editorMode ? openNewPipelineDialog() : handleCreateNewTemplate()
		}}>
			<Typography variant="body1">
				{ !editorMode ? 'Add a new pipeline' : 'Add a new template' }
			</Typography>
		</Box>

	const getFoldStatus = (sectionName: string) => {
		switch (sectionName) {
			case NodeStatusEnum.PENDING:
				return pendingCollapse
			case NodeStatusEnum.WORKING:
				return workingCollapse
			case NodeStatusEnum.DONE:
				return doneCollapse
			default:
				return true
		}
	}

	const setFoldStatus = (sectionName: string) => {
		switch (sectionName) {
			case NodeStatusEnum.PENDING:
				setPendingCollapse(!pendingCollapse)
				break
			case NodeStatusEnum.WORKING:
				setWorkingCollapse(!workingCollapse)
				break
			case NodeStatusEnum.DONE:
				setDoneCollapse(!doneCollapse)
				break
			default:
				break
		}
	}

	const getPipelineMenuItems = () => {
		const menuItemViews = []
		menuItemViews.push(
			<ListItemButton key={'add new'}>
				{addNewView}
			</ListItemButton>)
		for (const sectionPipeline of sectionPipelines) {
			const {sectionName, pipelines} = sectionPipeline
			// create a new fordable item
			menuItemViews.push(
				<ListItemButton key={'section-' + sectionName} onClick={() => {setFoldStatus(sectionName)}}>
					<ListItemText primary={sectionName} />
					{getFoldStatus(sectionName) ? <ExpandLess /> : <ExpandMore />}
				</ListItemButton>
			)
			const sectionItemViews = []
			for (const pipeline of pipelines) {
				sectionItemViews.push(
					<ListItemButton sx={{ pl: 4 }} key={pipeline.id}>
						<Box className={ selectedPipeline == pipeline ? 'workflow-container-inner-accent-border' : 'workflow-container-inner'} sx={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', id: pipeline.id}} onClick={()=>{
							selectPipeline(pipeline)}}>
							<Typography variant="body2">
								{pipeline.title}
							</Typography>
							<Box sx={{width: 110, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
								<Typography variant="body2">
									{TimeUtils.getDateTimeStr(pipeline.createTime)}
								</Typography>
								<Typography variant="body2" sx={{fontWeight: '600', color: "#336666"}}>
									{getProgress(pipeline)}
								</Typography>
							</Box>
						</Box>
					</ListItemButton>
				)
			}
			menuItemViews.push(
				<Collapse key={'collapse-' + sectionName} in={getFoldStatus(sectionName)} timeout="auto" unmountOnExit>
					<List component="div" disablePadding dense = {true}>
						{sectionItemViews}
					</List>
				</Collapse>
			);
		}
		return menuItemViews
	}

	const getListView = () => {
		return (
			<List
				sx={{ width: '100%', maxWidth: 360 }}
				component="nav"
				aria-labelledby="nested-list-subheader"
				dense = {true}
			>
				{getPipelineMenuItems()}
			</List>
		);
	}

	return (
		<div className={'workflow-container-outer'} style={{width: 300, height: '100%', overflow: 'scroll'}}>
			<Typography variant="h5" gutterBottom>
				{'Kanban: ' + kanbanTitle}
			</Typography>
			<Divider/>
			{getListView()}
			<NewPipelineDialog
				templates={templates}
				open={openDialog}
				closeDialog={closeNewPipelineDialog}
				createNewTask={handleCreateNewPipeline}
			/>
		</div>
	);
}
