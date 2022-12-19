import {Box, Divider, Stack} from "@mui/material";
import * as React from "react";
import {useEffect, useState} from "react";
import {PomodoroModel, PomodorosModel} from "./Pomodoro.model";
import PomodoroView from "./Pomodoro.view";

export interface PomodoroPanelProps {
	pomodoroData: PomodorosModel
	saveData: () => void
}

export default function PomodoroPanelView(props: PomodoroPanelProps) {

	const { pomodoroData, saveData } = props
	const pomodoros = pomodoroData.data

	const getKanbanPipelines = () => {
		const result = []
		for (const pomodoro of pomodoros) {
			result.push(pomodoro);
		}
		return result;
	}

	const getFocusPipeline = () => {
		if (focusPomodoro) {
			return <Box>
				<PomodoroView pomodoro={focusPomodoro}/>
			</Box>
		}
		return null
	}

	const getDefaultPomodoro = () => {
		if (pomodoros.length > 0) {
			return pomodoros[0]
		} else {
			return null
		}
	}

	const [focusPomodoro, setFocusPomodoro] = useState(getDefaultPomodoro())
	const [flag, setFlag] = useState(false)

	useEffect(()=> setFocusPomodoro(getDefaultPomodoro()))

	// update workflows
	const save = () => {
		saveData()
	}

	// /**
	//  * 更新Selected Pipeline
	//  */
	// const onPipelineUpdate = () => {
	// 	save()
	// }
	//
	// const onPipelineRemove = (pipeline: PipelineModel, editorMode?: boolean) => {
	// 	if (!editorMode) {
	// 		pipelines.remove(pipeline)
	// 	} else {
	// 		templatePLs.remove(pipeline)
	// 	}
	// 	setFocusPomodoro(getDefaultPomodoro)
	// 	save()
	// }
	//
	// const insertPipeline = (pipeline: PipelineModel, editorMode: boolean) => {
	// 	if (!editorMode) {
	// 		pipelines.push(pipeline)
	// 	} else {
	// 		templatePLs.push(pipeline)
	// 	}
	// 	save()
	// }
	const selectPipeline = (pomodoro: PomodoroModel) => {
		setFocusPomodoro(pomodoro)
		setFlag(!flag)
	}

	// const templateKanban = <WorkflowKanbanView editorMode={true} kanbanTitle={'Template'} pipelines={templateWF} selectPipeline={selectPipeline} templates={templatePLs} addNewPipeline={(pipeline) => insertPipeline(pipeline, true)} />

	return(
		<Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'background.paper', margin: 3}}>
			{/*{ getKanbanViews() }*/}
			{ getFocusPipeline() }
		</Box>
	)
}
