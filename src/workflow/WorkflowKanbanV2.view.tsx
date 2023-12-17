import Box from "@mui/material/Box";
import {Divider, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {newPipelineInstance, PipelineModel} from "../pipeline/Pipeline.model";
import {NodeStatusEnum} from "../nodes/NodeStatus.enum";
import {TimeUtils} from "../utils/Time.utils";
import NewPipelineDialog from "./NewPipelineDialog.view";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import {UpdateMode} from "../workpanel/WorkPanel.controller";
import {SubjectModel} from "../subject/Subject.model";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {useAppDispatch, useAppSelector} from "../repository/hooks";
import {selectWorkflow, updatePipeline} from "./Workflow.slice";
import * as React from "react";


export interface SectionPipelines {
	sectionName: string;
	pipelines: PipelineModel[];
}

export interface WorkflowKanbanProps {
	editorMode?: boolean,
	kanbanTitle: string,
	subjects: SubjectModel[],
	selectedPipeline?: PipelineModel,
	selectPipeline: (pipeline: PipelineModel) => void,
}

/**
 * A workflow kanban consists
 * @constructor
 */
export default function WorkflowKanbanViewV2(props: WorkflowKanbanProps) {

	const workflowRepo = useAppSelector(selectWorkflow)
	const dispatch = useAppDispatch()

	const {editorMode, kanbanTitle, selectedPipeline, selectPipeline, subjects } = props
	const [openDialog, setOpenDialog] = useState(false);
	const [collapseSection, setCollapseSection] = useState(editorMode ? NodeStatusEnum.TEMPLATE : NodeStatusEnum.WORKING);
	const [preSelectedTemplate, setPreSelectedTemplate] = useState<PipelineModel | null>(null)
	const [preSetWorkflowName, setPreSetWorkflowName] = useState<string | null >(null)

	const [sectionPipelines, setSectionPipelines] = useState<SectionPipelines[]>([])

	const getKanbanPipelines = (pipelines: PipelineModel[]) => {
		const sectionPipelines: SectionPipelines[] = []
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

	const getTemplatePipelines = (pipelines: PipelineModel[]) => {
		const sectionPipelines: SectionPipelines[] = []
		sectionPipelines.push({sectionName: NodeStatusEnum.TEMPLATE, pipelines: pipelines});
		return sectionPipelines;
	}

	useEffect(() => {
		if (props.editorMode) {
			setSectionPipelines(getTemplatePipelines(workflowRepo.templates))
		} else {
			setSectionPipelines(getKanbanPipelines(workflowRepo.pipelines))
		}
	}, [props.editorMode, workflowRepo])

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
		setPreSelectedTemplate(null)
		setPreSetWorkflowName(null)
		setOpenDialog(true);
	}

	const closeNewPipelineDialog = () => {
		setOpenDialog(false);
	}

	// show a dialog for user to choose a template, and add it to the current Kanban
	const handleCreateNewPipeline = (pipeline: PipelineModel) => {
		setOpenDialog(false);
		selectPipeline(pipeline)
		dispatch(updatePipeline({
			pipeline: pipeline,
			isEditMode: editorMode || false,
			updateMode: UpdateMode.ADD,
		}))
	}

	const handleCreateNewTemplate = () => {
		const newTemplatePipeline = newPipelineInstance()
		selectPipeline(newTemplatePipeline)
		dispatch(updatePipeline({
			pipeline: newTemplatePipeline,
			isEditMode: editorMode || false,
			updateMode: UpdateMode.ADD,
		}))
	}

	const addNewView = <Box className='workflow-accent' sx={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems:'center'}} onClick={()=>{
			!editorMode ? openNewPipelineDialog() : handleCreateNewTemplate()
		}}>
			<AddCircleIcon />
			<Typography variant="body1">
				{ !editorMode ? 'Add a new pipeline' : 'Add a new template' }
			</Typography>
		</Box>

	const getFoldStatus = (sectionName: string) => {
		return collapseSection == sectionName
	}

	const getExtraInfoView = (pipeline: PipelineModel) => {
		if (!editorMode) {
			return <Typography variant="body2" sx={{fontWeight: '600', color: "#336666"}}>
				{getProgress(pipeline)}
			</Typography>
		} else {
			return <AddCircleIcon onClick={() => {
				setPreSelectedTemplate(pipeline)
				setPreSetWorkflowName(`${pipeline.title} - ${TimeUtils.getDateStr(Date.now())}`)
				setOpenDialog(true)
				return true
			}} />
		}
	}

	const getPipelineKanbanItems = () => {
		const menuItemViews = []
		menuItemViews.push(addNewView)
		for (const sectionPipeline of sectionPipelines) {
			const {sectionName, pipelines} = sectionPipeline
			// create a new fordable item
			menuItemViews.push(
				<div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'right', margin: 10, fontWeight: 600}} key={'section-' + sectionName} onClick={() => {setCollapseSection(sectionName as NodeStatusEnum)}}>
					<div> {sectionName.toUpperCase()} </div>
					{getFoldStatus(sectionName) ? <ExpandLess /> : <ExpandMore />}
				</div>
			)
			const sectionItemViews = []
			for (const pipeline of pipelines) {
				sectionItemViews.push(
					<Box className={ selectedPipeline == pipeline ? 'workflow-container-inner-accent-border' : 'workflow-container-inner'} sx={{width: 200, height: 60, display: 'flex', flexDirection: 'column', alignItems: 'left', justifyContent: 'space-between', id: pipeline.id, margin: 1}} onClick={()=>{
						selectPipeline(pipeline)}}>
						<Box sx={{width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
							<Typography variant="body2">
								{pipeline.title}
							</Typography>
							{ getExtraInfoView(pipeline) }
						</Box>
						<Typography variant="body2">
							{TimeUtils.getYearDateTimeStr(pipeline.createTime)}
						</Typography>
					</Box>
				)
			}
			menuItemViews.push(
				<Collapse style={{width: '100%'}} key={'collapse-' + sectionName} in={getFoldStatus(sectionName)} timeout="auto" unmountOnExit>
					<Box sx={{ flexGrow: 1 }}>
						<Divider sx={{marginBottom: 1}}/>
						<div style={{width: '100%', height: '100%', flexWrap: 'wrap', display: 'flex', flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'flex-start'}}>
							{sectionItemViews}
						</div>
					 </Box>
				 </Collapse>
			);
		}
		return menuItemViews
	}

	return (
		<div style={{width: '100%', height: '100%', overflowY: 'scroll', overflowX: 'scroll'}}>
			{getPipelineKanbanItems()}
			<NewPipelineDialog
				templates={workflowRepo.templates}
				open={openDialog}
				closeDialog={closeNewPipelineDialog}
				createNewTask={handleCreateNewPipeline}
				subjects={subjects}
				preSelectedTemplate={preSelectedTemplate}
				preSetWorkflowName={preSetWorkflowName}
			/>
		</div>
	);
}
