import * as React from "react";
import PomodoroView from "../pomodoro/Pomodoro.view";
import {PomodoroModel, PomodoroStatus} from "../pomodoro/Pomodoro.model";
import {PipelineModel} from "../pipeline/Pipeline.model";
import PomodoroPanelView from "../pomodoro/PomodoroPanel.view";
import {Divider} from "@mui/material";
import {useEffect, useState} from "react";
import PomodoroListView from "../pomodoro/PomodoroList.view";

interface FloatingBarProps {
	focusedPipeline?: PipelineModel,
	pomodoroArray: PomodoroModel[]
}

export default function FloatingBarView(floatBarProps: FloatingBarProps) {

	const {focusedPipeline, pomodoroArray} = floatBarProps
	const [showList, setShowList] = useState(false)
	const [focusedPomodoro, setFocusedPomodoro] = useState<undefined | PomodoroModel>()

	useEffect(()=> {
		// no prev focus pipeline
		if (!focusedPomodoro) {
			setFocusedPomodoro(undefined)
			return
		}
		if (!pomodoroArray.contains(focusedPomodoro)) {
			const samePipelineIndex = pomodoroArray.findIndex((value, index, object) => value.id === focusedPomodoro.id)
			if (samePipelineIndex === -1) {
				setFocusedPomodoro(undefined)
			} else {
				setFocusedPomodoro(pomodoroArray[samePipelineIndex])
			}
			return
		}
	}, [floatBarProps])

	const getPomodoroView = () => {
		if (showList) {
			return <PomodoroListView focusedPomodoro={focusedPomodoro} pomodoroArray={pomodoroArray}
									 setFocusPomodoro={(focusedPomodoro: PomodoroModel) => {
									 		setFocusedPomodoro(focusedPomodoro)
										 	setShowList(!showList)
									 	}
									 }/>
		}
		if (focusedPomodoro) {
			return <PomodoroView pomodoro={focusedPomodoro}/>
		}
		return null
	}


	return (
		<div style={{
			width: '100%',
			position: 'absolute',
			flexDirection: 'column',
			bottom: 50,
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center'
		}}>
			<div className={'workflow-container-floating'}>
				{getPomodoroView()}
				<Divider sx={{marginY: '3px'}}/>
				<PomodoroPanelView setFocusedPomodoro={(pomodoro: PomodoroModel) => setFocusedPomodoro(pomodoro)}
								   focusedPomodoro={focusedPomodoro}
								   focusedPipeline={focusedPipeline}
								   showList={showList}
								   setShowList={(showList: boolean) => setShowList(showList)}
								   pomodoroList={pomodoroArray}/>
			</div>
		</div>
	);
}
