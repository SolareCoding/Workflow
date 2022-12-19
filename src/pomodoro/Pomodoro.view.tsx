import * as React from "react";
import {PomodoroModel} from "./Pomodoro.model";
import {PomodoroStyle} from "./Pomodoro.style.tx";
import Box from "@mui/material/Box";
import {Card, CardContent, CardHeader, Typography} from "@mui/material";
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

	useEffect(()=> startTimer())

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
		<Box>
			<Card style={PomodoroStyle.root}>
				<CardHeader style={PomodoroStyle.header} title={pomodoro?.title}/>
				<CardContent>
					<Typography>
						{timeLeft}
					</Typography>
				</CardContent>
			</Card>
		</Box>
	);

}
