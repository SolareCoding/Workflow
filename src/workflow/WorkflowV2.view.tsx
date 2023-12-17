import {Divider, Typography} from "@mui/material";
import * as React from "react";
import {useEffect, useMemo, useState} from "react";
import PipelineView from "../pipeline/Pipeline.view";
import {PipelineModel} from "../pipeline/Pipeline.model";
import {NodeStatusEnum} from "../nodes/NodeStatus.enum";
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import {SubjectModel} from "../subject/Subject.model";
import WorkflowKanbanViewV2 from "./WorkflowKanbanV2.view";
import PomodoroSnackViewV2 from "../pomodoro/PomodoroPanelV2.view";
import PomodoroListViewV2 from "../pomodoro/PomodoroListV2.view";
import SubjectView from "../subject/Subject.view";
import {useAppSelector} from "../repository/hooks";
import {selectWorkflow} from "./Workflow.slice";
import {selectSubject} from "../subject/Subject.slice";

export interface WorkflowProps {
	subject: SubjectModel
}

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

enum TabEnums {
	Workflow,
	Template,
	Subject,
	Pomodoro
}

export default function WorkflowViewV2(props: WorkflowProps) {

	const workflowRepo = useAppSelector(selectWorkflow)
	const subjectRepo = useAppSelector(selectSubject)

	const [drawerClosed, setDrawerClosed] = useState(true)
	const [currentTab, setCurrentTab] = useState(TabEnums.Workflow)
	const [focusPipeline, setFocusPipeline] = useState<PipelineModel | undefined>(undefined)

	useEffect(() => {
		// no prev focus pipeline
		if (!focusPipeline) {
			setFocusPipeline(getDefaultFocusedPipeline(workflowRepo.pipelines))
			return
		}
		if (!focusPipeline.isTemplate && !workflowRepo.pipelines.contains(focusPipeline)) {
			const samePipelineIndex = workflowRepo.pipelines.findIndex((value, index, object) => value.id === focusPipeline.id)
			if (samePipelineIndex === -1) {
				setFocusPipeline(getDefaultFocusedPipeline(workflowRepo.pipelines))
			} else {
				setFocusPipeline(workflowRepo.pipelines[samePipelineIndex])
			}
			return
		}
		if (focusPipeline.isTemplate && !workflowRepo.templates.contains(focusPipeline)) {
			const samePipelineIndex = workflowRepo.templates.findIndex((value, index, object) => value.id === focusPipeline.id)
			if (samePipelineIndex === -1) {
				setFocusPipeline(workflowRepo.templates.length > 0 ? workflowRepo.templates[0] : undefined)
			} else {
				setFocusPipeline(workflowRepo.templates[samePipelineIndex])
			}
			return
		}
	}, [props])

	const getLeafSubjects = (rootSubject: SubjectModel): SubjectModel[] => {
		const leafSubjects: SubjectModel[] = []
		innerSearchLeafSubjects(rootSubject, leafSubjects)
		return leafSubjects
	}


	const innerSearchLeafSubjects = (rootSubject: SubjectModel, leafSubjects: SubjectModel[]) => {
		if (rootSubject.children.length == 0) {
			leafSubjects.push(rootSubject)
			return
		}
		for (let i = 0; i < rootSubject.children.length; i++) {
			innerSearchLeafSubjects(rootSubject.children[i], leafSubjects)
		}
	}

	const leafSubjects = useMemo(
		() => getLeafSubjects(props.subject), [props.subject]
	)

	const getDefaultFocusedPipeline = (pipelines: PipelineModel[]) => {
		for (const pipeline of pipelines) {
			if (pipeline.status == NodeStatusEnum.WORKING) {
				return pipeline
			}
		}
		for (const pipeline of pipelines) {
			if (pipeline.status == NodeStatusEnum.PENDING) {
				return pipeline
			}
		}
		return undefined
	}

	const getFocusPipeline = () => {
		if (!focusPipeline) {
			return <div className={'workflow-container-outer'} style={{
				width: '100%',
				height: '100%',
				display: "flex",
				alignItems: 'center',
				justifyContent: 'center',
			}}>
				<Typography>
					Find your own way. Trust yourself.
				</Typography>
				<img style={{marginTop: 5}} src="https://picsum.photos/200" alt="display image"/>
			</div>
		}
		return <PipelineView pipeline={focusPipeline}/>
	}

	const selectPipeline = (pipeline: PipelineModel) => {
		setFocusPipeline(pipeline)
	}

	const workflowKanban = <WorkflowKanbanViewV2 kanbanTitle={'workflow'}
											   selectedPipeline={focusPipeline}
											   selectPipeline={selectPipeline}
											   subjects={leafSubjects}/>
	const templateKanban = <WorkflowKanbanViewV2 editorMode={true} kanbanTitle={'template'}
											   selectedPipeline={focusPipeline}
											   selectPipeline={selectPipeline}
											   subjects={leafSubjects}/>

	const pomodoroKanban = <PomodoroListViewV2 focusedPomodoro={undefined}/>

	const subjectKanban = <SubjectView subject={subjectRepo.rootSubject}/>

	const getDrawerHeader = () => {
		return <div style={{
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			width: '100%',
		}}>
			<div style={{display: 'flex', width: 100, alignItems: 'center', justifyContent: 'center'}} onClick={() => {
				setDrawerClosed(!drawerClosed)
			}}>
				{!drawerClosed ? <KeyboardDoubleArrowDownIcon/> : <KeyboardDoubleArrowUpIcon/>}
			</div>
			<PomodoroSnackViewV2 focusedPipeline={focusPipeline} />
		</div>
	}

	const getTabContent = () => {
		switch (currentTab) {
			case TabEnums.Workflow:
				return workflowKanban;
			case TabEnums.Template:
				return templateKanban;
			case TabEnums.Pomodoro:
				return pomodoroKanban;
			case TabEnums.Subject:
				return subjectKanban;
			default:
				return null;
		}
	}

	const getDrawerContent = () => {
		return <div style={{width: '100%', height: '60vh', display: 'flex', flexDirection: 'row'}}>
			<div>
				<div className={currentTab==TabEnums.Workflow ? 'workflow-container-inner-accent-border' : 'workflow-container-inner'} style={{marginTop: 5, fontSize: 16, fontWeight: 600}} onClick={() => setCurrentTab(TabEnums.Workflow)}>
					Workflows
				</div>
				<div className={currentTab==TabEnums.Template ? 'workflow-container-inner-accent-border' : 'workflow-container-inner'} style={{marginTop: 5, fontSize: 16, fontWeight: 600}} onClick={() => setCurrentTab(TabEnums.Template)}>
					Templates
				</div>
				<div className={currentTab==TabEnums.Subject ? 'workflow-container-inner-accent-border' : 'workflow-container-inner'} style={{marginTop: 5, fontSize: 16, fontWeight: 600}} onClick={() => setCurrentTab(TabEnums.Subject)}>
					Subjects
				</div>
				<div className={currentTab==TabEnums.Pomodoro ? 'workflow-container-inner-accent-border' : 'workflow-container-inner'} style={{marginTop: 5, fontSize: 16, fontWeight: 600}} onClick={() => setCurrentTab(TabEnums.Pomodoro)}>
					Pomodoro
				</div>
			</div>
			<Divider orientation='vertical' sx={{margin: 1}}/>
			{getTabContent()}
		</div>
	}

	const getMenuDrawer = () => {
		return <div style={{
			position: 'absolute',
			bottom: 0,
			display: 'flex',
			width: '100%',
			height: !drawerClosed ? '100%' : '',
			backgroundColor: !drawerClosed ? 'rgba(0, 0, 0, 0.3)' : '',
			flexDirection: 'column',
			minWidth: 400,
		}}>
			{!drawerClosed ? <div style={{
				height: '100%',
				width: '100%',
			}} onClick={()=> setDrawerClosed(true)}/> : null}
			<div className={'workflow-container-outer'} style={{
				display: 'flex',
				flexDirection: 'column',
				width: '100%',
				maxHeight: '60vh',
				padding: 10
			}}>
				{getDrawerHeader()}
				<Divider sx={{margin: 1}}/>
				{!drawerClosed ? getDrawerContent() : null}
			</div>
		</div>

	}

	return (
		<div style={{
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'center',
			height: '100%',
			width: '100%',
			minWidth: 400,
		}}>
			{getFocusPipeline()}
			{getMenuDrawer()}
		</div>
	)
}
