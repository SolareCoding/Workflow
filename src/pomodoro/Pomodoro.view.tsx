import * as React from "react";
import {PomodoroModel} from "./Pomodoro.model";
import {useEffect, useState} from "react";

export interface PomodoroProps {
	pomodoro: PomodoroModel,
	updateData?: (data: string) => void
}

export default function PomodoroView(props: PomodoroProps) {

	const pomodoro = props.pomodoro

	const getTimeLeft = (pomodoro: PomodoroModel): string => {
		let leftTime = pomodoro.startTime + pomodoro.duration - new Date().getTime();
		let minutes = (leftTime / 1000 / 60).toFixed(0);
		let seconds = (leftTime % 60000 / 1000).toFixed(0);
		return minutes + ':' + seconds;
	}

	const [timeLeft, setTimeleft] = useState(getTimeLeft(pomodoro))

	let timerID: any

	useEffect(() => startTimer())

	const startTimer = () => {
		if (timerID) {
			clearInterval(this.timerID);
		}
		timerID = setInterval(
			() => tick(),
			1000
		)
	}

	const tick = () => {
		setTimeleft(getTimeLeft(pomodoro))
	}

	return (
		<div
			className={'workflow-container-outer'}
			style={{
			marginTop: 30,
			maxWidth: 345,
			display: 'flex',
			flexDirection: 'column',
		}}>
			<div style={{width: '100%', }}> {pomodoro?.title} </div>
			<p>
				{timeLeft}
			</p>
		</div>
	);
}
