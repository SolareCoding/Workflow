import * as React from "react";
import {useContext, useEffect, useState} from "react";
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
import PomodoroListView from "./PomodoroList.view";
import PomodoroView from "./Pomodoro.view";
import {Divider} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {TimeUtils} from "../utils/Time.utils";

/**
 * 创建、管理所有的番茄时钟？
 */
export interface PomodoroPanelProps {
	focusedPipeline?: PipelineModel
	pomodoroList: PomodoroModel[]
}

export default function PomodoroPanelView(props: PomodoroPanelProps) {

	const {focusedPipeline, pomodoroList} = props
	const workPanelController = useContext(WorkPanelContext)

	const [showList, setShowList] = useState(false)
	const [focusedPomodoro, setFocusedPomodoro] = useState<undefined | PomodoroModel>()

	useEffect(() => {
		// no prev focus pipeline
		if (!focusedPomodoro) {
			setFocusedPomodoro(getDefaultPomodoro())
			return
		}
		if (!pomodoroList.contains(focusedPomodoro)) {
			const samePipelineIndex = pomodoroList.findIndex((value, index, object) => value.id === focusedPomodoro.id)
			if (samePipelineIndex === -1 || pomodoroList[samePipelineIndex].status == PomodoroStatus.FINISHED) {
				setFocusedPomodoro(undefined)
			} else {
				setFocusedPomodoro(pomodoroList[samePipelineIndex])
			}
			return
		}
	}, [props])

	const getDefaultPomodoro = () => {
		for (const pomodoroModel of pomodoroList) {
			if (pomodoroModel.status != PomodoroStatus.FINISHED) {
				return pomodoroModel
			}
		}
		return undefined
	}

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

	const savePomodoro = () => {
		workPanelController.updatePomodoro(Object.assign({}, focusedPomodoro, {editMode: false}))
	}

	const updatePomodoroStatus = (status: PomodoroStatus) => {
		if (!focusedPomodoro || focusedPomodoro.status === PomodoroStatus.FINISHED) {
			return
		}
		const copiedPomodoro = Object.assign({}, focusedPomodoro, {status: status})
		workPanelController.updatePomodoro(copiedPomodoro)
	}

	const getPomodoroView = () => {
		if (showList) {
			return <PomodoroListView
						focusedPomodoro={focusedPomodoro} pomodoroArray={pomodoroList}
						setFocusPomodoro={
							(focusedPomodoro: PomodoroModel) => {
								setFocusedPomodoro(focusedPomodoro)
								setShowList(!showList)
							}
						}/>
		}
		if (focusedPomodoro) {
			return <PomodoroView pomodoro={focusedPomodoro}/>
		}
		return <div>
			Add a new pomodoro and focus on your work.
		</div>
	}


	const getAddView = () => {
		if (focusedPomodoro && focusedPomodoro.status != PomodoroStatus.FINISHED) {
			return null
		}
		if (focusedPomodoro?.editMode) {
			return null
		}
		return <AddCircleIcon onClick={addNewPomodoro}/>
	}

	const getPauseResumeView = () => {
		if (!focusedPomodoro || focusedPomodoro.status == PomodoroStatus.FINISHED) {
			return null
		}
		if (focusedPomodoro?.editMode) {
			return null
		}
		if (focusedPomodoro.status == PomodoroStatus.RUNNING) {
			return <PauseCircleIcon onClick={pausePomodoro}/>
		} else {
			return <PlayCircleIcon onClick={resumePomodoro}/>
		}
	}

	const getStopView = () => {
		if (!focusedPomodoro || focusedPomodoro.status == PomodoroStatus.FINISHED) {
			return null
		}
		if (focusedPomodoro?.editMode) {
			return null
		}
		return <StopCircleIcon onClick={stopPomodoro}/>
	}

	const getListSwitcherView = () => {
		if (focusedPomodoro?.editMode) {
			return null
		}
		if (!showList) {
			return <TocIcon onClick={() => setShowList(!showList)}/>
		}
		return <AlarmOnIcon onClick={() => setShowList(!showList)}/>
	}

	const getSaveView = () => {
		if (focusedPomodoro?.editMode) {
			return <CheckCircleIcon onClick={savePomodoro}/>
		} else {
			return null
		}
	}

	return (
		<div>
			{getPomodoroView()}
			<Divider sx={{marginY: '3px'}}/>
			<div style={{
				width: 345,
				display: 'flex',
				flexDirection: 'row',
				justifyContent: 'center',
				alignItems: 'center',
				margin: 1
			}}>
				{getAddView()}
				{getSaveView()}
				{getPauseResumeView()}
				{getStopView()}
				{getListSwitcherView()}
			</div>
		</div>
	)
}
