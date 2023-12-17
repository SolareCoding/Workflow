import * as React from "react";
import {useContext, useEffect, useRef, useState} from "react";
import {PomodoroModel, PomodoroStatus} from "./Pomodoro.model";
import {TimeUtils} from "../utils/Time.utils";
import {WorkPanelContext} from "../workpanel/WorkPanel.view";
import {NotificationUtils} from "../utils/Notification.utils";
import {useAppDispatch, useAppSelector} from "../repository/hooks";
import {selectPomodoro, update} from "./Pomodoro.slice";

export interface PomodoroProps {
	pomodoro: PomodoroModel,
}

export default function PomodoroView(props: PomodoroProps) {

	const dispatch = useAppDispatch()

	const { pomodoro } = props
	const [title, setTitle] = useState(pomodoro.title)
	const [timeLeft, setTimeLeft] = useState(pomodoro.timeleft)

	let timer = useRef<any>()
	let pomodoroRef = useRef<PomodoroModel>(pomodoro)

	useEffect(() => {
		timer.current = setInterval(tick, 1000)
		return () => {
			clearInterval(timer.current)
		}
	}, [])

	useEffect(() => {
		pomodoroRef.current = pomodoro
	}, [props])

	const getPomodoro = () => {
		return pomodoroRef.current
	}

	const tick = () => {
		if (getPomodoro().editMode) {
			return
		}
		if (getPomodoro().status != PomodoroStatus.RUNNING) {
			return
		}
		const copiedPomodoro = Object.assign({}, getPomodoro(), {timeleft: getPomodoro().timeleft-1})
		if (copiedPomodoro.timeleft <= 0) {
			copiedPomodoro.status = PomodoroStatus.FINISHED
			NotificationUtils.sendMessage('Pomodoro [' + getPomodoro().title + '] has finished')
		}
		dispatch(update(copiedPomodoro))
	}

	const handlePomodoroTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(event.target.value)
		dispatch(update(Object.assign({}, pomodoro, {title: event.target.value})))
	}

	const handlePomodoroTimeLeftChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const timeLeft = Number(event.target.value)
		setTimeLeft(timeLeft)
		dispatch(update(Object.assign({}, pomodoro, {timeleft: timeLeft})))
	}

	const getTitleView = () => {
		if (pomodoro.editMode) {
			return <input className={'workflow-input'} placeholder={'Pomodoro title'} style={{height: 25, width: '100%', fontSize: 16, fontWeight: 600, textAlign: 'center'}} id="pomodoro-title" value={title} onChange={handlePomodoroTitleChange} />
		} else {
			return <div className={'workflow-text-accent'} style={{height: 25, width: '100%', fontSize: 16, fontWeight: 600, textAlign: 'center', verticalAlign: 'center'}}> {pomodoro?.title} </div>
		}
	}

	const getTimeLeftOptions = () => {
		const options = []
		options.push(<option key={'100'} value={'10'}>{'test'} </option>)
		options.push(<option key={'900'} value={'900'}>{'15min'} </option>)
		options.push(<option key={'1800'} value={'1800'}>{'30min'} </option>)
		options.push(<option key={'2700'} value={'2700'}>{'45min'} </option>)
		return options;
	}

	const getTimeLeftView = () => {
		if (pomodoro.editMode) {
			return <select value={timeLeft} style={{height: 25, width: 100, fontSize: 14, fontWeight: 500, marginLeft: 3, textAlign: 'center'}} name="select-type" onChange={handlePomodoroTimeLeftChange}>
				{getTimeLeftOptions()}
			</select>
		} else {
			return <div style={{width: 100, textAlign: 'center'}}>
				{TimeUtils.getMMSSStr(pomodoro.timeleft)}
			</div>
		}
	}

	return (
		<div
			className={'workflow-container-inner'}
			style={{
				width: 300,
				justifyContent: 'space-between',
				alignItems: 'center',
				display: 'flex',
				flexDirection: 'row',
		}}>
			{getTitleView()}
			{getTimeLeftView()}
		</div>
	);
}
