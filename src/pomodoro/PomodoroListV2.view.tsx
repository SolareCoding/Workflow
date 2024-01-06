import {PomodoroModel, PomodoroStatus} from "./Pomodoro.model";
import {TimeUtils} from "../utils/Time.utils";
import Box from "@mui/material/Box";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import {useAppDispatch, useAppSelector} from "../repository/hooks";
import {remove, selectPomodoro} from "./Pomodoro.slice";
import * as React from "react";
import {Divider, Typography} from "@mui/material";

export interface PomodoroProps {
	focusedPomodoro: PomodoroModel | undefined,
}

/**
 * 展示当前所有的番茄
 * @param props
 * @constructor
 */
export default function PomodoroListViewV2(props: PomodoroProps) {

	const pomodoro = useAppSelector(selectPomodoro)
	const dispatch = useAppDispatch()

	const getPomodoroItemViews = () => {
		const itemViews = []
		for (const pomodoroModel of pomodoro.pomodoroArray) {
			if (pomodoroModel.status != PomodoroStatus.FINISHED) {
				itemViews.unshift(getPomodoroItemView(pomodoroModel))
			} else {
				itemViews.push(getPomodoroItemView(pomodoroModel))
			}
		}
		if (itemViews.length == 0) {
			itemViews.push(getEmptyHintItemView())
		}
		return itemViews
	}

	const getPomodoroItemView = (pomodoroItem: PomodoroModel) => {
		return <Box key={pomodoroItem.id} className={'workflow-container-inner'} sx={{width: 200, height: 60, display: 'flex', flexDirection: 'column', alignItems: 'left', justifyContent: 'space-between', id: pomodoroItem.id, margin: 1}}>
			<div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
				<div style={{width: '100%', fontSize: 14, fontWeight: 500}}> {pomodoroItem?.title} </div>
				{(pomodoroItem.status == PomodoroStatus.RUNNING) ? <DirectionsRunIcon fontSize={'inherit'}/> :
					<DeleteOutlineIcon fontSize={'inherit'} onClick={() => deletePomodoro(pomodoroItem)}/>}
			</div>
			<div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
				<div style={{minWidth: 45, fontSize: 14}}>
					{TimeUtils.getYearDateTimeStr(pomodoroItem.startTime)}
				</div>
				<Divider orientation='vertical' sx={{margin: 1}}/>
				<div style={{minWidth: 45, fontSize: 14}}>
					{TimeUtils.getMMSSStr(pomodoroItem.duration)}
				</div>
			</div>
		</Box>
	}

	const getEmptyHintItemView = () => {
		return <Box key={'pomodoroHint'} className={'workflow-container-inner'} sx={{width: 200, height: 60, display: 'flex', flexDirection: 'column', alignItems: 'left', justifyContent: 'space-between', margin: 1}}>
			<Typography>
				Start your first pomodoro by click ➕
			</Typography>
		</Box>
	}

	const deletePomodoro = (pomodoroItem: PomodoroModel) => {
		dispatch(remove(pomodoroItem))
	}

	const getItemListView = () => {
		return <div style={{
			width: '100%',
			height: '100%',
			flexWrap: 'wrap',
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'flex-start',
			justifyContent: 'flex-start'
		}}>
			{getPomodoroItemViews()}
		</div>
	}

	return (
		<div
			className={'workflow-container-inner'}
			style={{
				height: '100%',
				width: '100%',
				alignItems: 'center',
				display: 'flex',
				flexDirection: 'column',
				padding: 10,
			}}>
			<div style={{display: 'flex', width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'right', margin: 10, fontWeight: 600}}>
				<div>
					Treasure your pomodoro, it's your efforts.
				</div>
			</div>
			<div>
				{getItemListView()}
			</div>
		</div>
	);
}
