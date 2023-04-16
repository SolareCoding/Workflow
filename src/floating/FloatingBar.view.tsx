import * as React from "react";
import {PomodoroModel} from "../pomodoro/Pomodoro.model";
import {PipelineModel} from "../pipeline/Pipeline.model";
import PomodoroPanelView from "../pomodoro/PomodoroPanel.view";

interface FloatingBarProps {
	focusedPipeline?: PipelineModel,
	pomodoroArray: PomodoroModel[]
}

export default function FloatingBarView(floatBarProps: FloatingBarProps) {

	const {focusedPipeline, pomodoroArray} = floatBarProps

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
				<PomodoroPanelView
				   focusedPipeline={focusedPipeline}
				   pomodoroList={pomodoroArray}/>
			</div>
		</div>
	);
}
