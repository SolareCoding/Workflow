import * as React from "react";
import {useContext, useEffect, useState} from "react";
import {PomodoroModel, PomodoroStatus} from "./Pomodoro.model";
import {TimeUtils} from "../utils/Time.utils";
import {WorkPanelContext} from "../workpanel/WorkPanel.view";

export interface PomodoroProps {
	pomodoro: PomodoroModel,
}

export default function PomodoroView(props: PomodoroProps) {

	const { pomodoro } = props
	const workPanelController = useContext(WorkPanelContext)

	let timerID: any

	useEffect(() => {
			timerID = setTimeout(() => tick(), 1000)
			return () => clearTimeout(timerID)
		}
	)

	const tick = () => {
		clearTimeout(timerID)
		if (pomodoro.status != PomodoroStatus.RUNNING) {
			return
		}
		const copiedPomodoro = Object.assign({}, pomodoro, {timeleft: pomodoro.timeleft-1})
		workPanelController.updatePomodoro(copiedPomodoro)
		if (copiedPomodoro.timeleft > 0) {
			timerID = setTimeout(() => tick(), 1000)
		} else {
			pomodoro.status = PomodoroStatus.FINISHED
		}
	}

	return (
		<div
			className={'workflow-container-inner'}
			style={{
				maxWidth: 400,
				justifyContent: 'center',
				alignItems: 'center',
				display: 'flex',
				flexDirection: 'row',
		}}>
				<div className={'workflow-text-accent'} style={{width: '100%', fontSize: 16, fontWeight: 600}}> {pomodoro?.title} </div>
				<div style={{minWidth: 45}}>
					{TimeUtils.getMMSSStr(pomodoro.timeleft)}
				</div>
		</div>
	);
}
