import * as React from "react";
import {useContext, useState} from "react";
import {PomodoroModel, PomodoroStatus} from "./Pomodoro.model";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import StopCircleIcon from '@mui/icons-material/StopCircle';
import TocIcon from '@mui/icons-material/Toc';
import {PipelineModel} from "../pipeline/Pipeline.model";
import {WorkPanelContext} from "../workpanel/WorkPanel.view";
import {UpdateMode} from "../workpanel/WorkPanel.controller";
import AlarmOnIcon from '@mui/icons-material/AlarmOn';

/**
 * 创建、管理所有的番茄时钟？
 */
export interface PomodoroPanelProps {
	setFocusedPomodoro: (pomodoro: PomodoroModel) => void
	focusedPipeline?: PipelineModel
	focusedPomodoro?: PomodoroModel
	showList: boolean,
	setShowList: (showList: boolean) => void
	pomodoroList: PomodoroModel[]
}

export default function PomodoroPanelView(props: PomodoroPanelProps) {

	const {setFocusedPomodoro, focusedPomodoro, focusedPipeline, pomodoroList,showList, setShowList} = props
	const workPanelController = useContext(WorkPanelContext)

	const addNewPomodoro = () => {
		// Check focused pipeline, no pipeline or template pipeline should return
		if (!focusedPipeline || focusedPipeline.isTemplate) {
			return
		}
		// check pomodoro
		if (focusedPomodoro && !focusedPomodoro.status) {
			return
		}
		const newPomodoro = PomodoroModel.newInstance(focusedPipeline)
		workPanelController.updatePomodoro(newPomodoro, UpdateMode.ADD)
		setFocusedPomodoro(newPomodoro)
		console.log("add new pomodoro")
	}

	const pausePomodoro = () => {
		updatePomodoroStatus(PomodoroStatus.PAUSED)
	}

	const resumePomodoro = () => {
		updatePomodoroStatus(PomodoroStatus.RUNNING)
	}

	const stopPomodoro = () => {
		updatePomodoroStatus(PomodoroStatus.FINISHED)
	}

	const updatePomodoroStatus = (status: PomodoroStatus) => {
		if (!focusedPomodoro || focusedPomodoro.status === PomodoroStatus.FINISHED) {
			return
		}
		const copiedPomodoro = Object.assign({}, focusedPomodoro, {status: status})
		workPanelController.updatePomodoro(copiedPomodoro)
	}

	const getAddView = () => {
		if (focusedPomodoro && focusedPomodoro.status != PomodoroStatus.FINISHED) {
			return null
		}
		return <AddCircleIcon onClick={addNewPomodoro}/>
	}

	const getPauseResumeView = () => {
		if (!focusedPomodoro || focusedPomodoro.status == PomodoroStatus.FINISHED) {
			return null
		}
		if (focusedPomodoro.status == PomodoroStatus.RUNNING) {
			return <PauseCircleIcon onClick={pausePomodoro}/>
		} else {
			return <PlayCircleIcon onClick={resumePomodoro} />
		}
	}

	const getStopView = () => {
		if (!focusedPomodoro || focusedPomodoro.status == PomodoroStatus.FINISHED) {
			return null
		}
		return <StopCircleIcon onClick={stopPomodoro}/>
	}

	const getListView = () => {
		if (!showList) {
			return <TocIcon onClick={() => setShowList(!showList)}/>
		}
		return <AlarmOnIcon onClick={() => setShowList(!showList)}/>
	}

	return(
		<div style={{width: 345, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 1}}>
			{ getAddView() }
			{ getPauseResumeView() }
			{ getStopView() }
			{ getListView() }
		</div>
	)
}
