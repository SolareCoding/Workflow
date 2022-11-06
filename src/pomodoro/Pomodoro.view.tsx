import * as React from "react";
import {PomodoroModel} from "./Pomodoro.model";
import {PomodoroStyle} from "./Pomodoro.style.tx";


export interface PomodoroProperty {
	data: string,
	updateData: (data: string) => void
}

export class PomodoroView extends React.Component<PomodoroProperty, PomodoroModel>{

	private timerID: any;

	constructor(props: any) {
		super(props);
	}

	componentDidMount() {
		this.setState(PomodoroModel.parseData(this.props.data))
		this.startTimer();
	}

	componentWillUnmount() {
		if (this.timerID) {
			clearInterval(this.timerID);
		}
	}

	render() {
		return ( null
			// <Container>
			// 	<Card style={PomodoroStyle.root}>
			// 		<CardHeader style={PomodoroStyle.header} title={this.state?.title}/>
			// 		<CardContent>
			// 			<Typography>
			// 				{this.state?.timeLeft}
			// 			</Typography>
			// 		</CardContent>
			// 	</Card>
			// </Container>
		);
	}

	private startTimer() {
		if (this.timerID) {
			clearInterval(this.timerID);
		}
		this.timerID = setInterval(
			() => this.tick(),
			1000
		)
	}

	private tick() {
		this.setState(
			{
				timeLeft: this.getTimeLeft()
			}
		)
	}

	private getTimeLeft(): string {
		let leftTime = this.state.startTime + this.state.duration - new Date().getTime();
		let minutes = (leftTime / 1000 / 60).toFixed(0);
		let seconds = (leftTime % 60000 / 1000).toFixed(0);
		return minutes + ':' + seconds;
	}

}
