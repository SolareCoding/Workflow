import * as React from "react";
import {PomodoroModel, PomodoroStatus} from "./Pomodoro.model";
import {TimeUtils} from "../utils/Time.utils";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import ListItemButton from "@mui/material/ListItemButton";

export interface PomodoroProps {
	focusedPomodoro: PomodoroModel | undefined,
	pomodoroArray: PomodoroModel[],
	setFocusPomodoro: (pomodoro: PomodoroModel) => void,
}

export default function PomodoroListView(props: PomodoroProps) {

	const { focusedPomodoro, pomodoroArray, setFocusPomodoro } = props

	const getPomodoroItemViews = () => {
		const itemViews = []
		for (const pomodoroModel of pomodoroArray) {
			if (pomodoroModel.status != PomodoroStatus.FINISHED) {
				itemViews.push(getPomodoroItemView(pomodoroModel))
			}
		}
		return itemViews
	}

	const getPomodoroItemView = (pomodoroItem: PomodoroModel) => {
		return <ListItemButton key={pomodoroItem.id}>
			<Box
				className={focusedPomodoro == pomodoroItem ? 'workflow-container-inner-accent-border' : 'workflow-container-inner'}
				sx={{
					width: '100%',
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
					id: pomodoroItem.id
				}} onClick={() => {
				setFocusPomodoro(pomodoroItem)
			}}>
				<div style={{width: '100%', fontSize: 14}}> {pomodoroItem?.title} </div>
				<div style={{minWidth: 45, fontSize: 14}}>
					{TimeUtils.getMMSSStr(pomodoroItem.timeleft)}
				</div>
			</Box>
		</ListItemButton>
	}

	return (
		<div
			className={'workflow-container-inner'}
			style={{
				maxHeight: 300,
				maxWidth: '100%',
				justifyContent: 'center',
				alignItems: 'center',
				display: 'flex',
				flexDirection: 'row',
				overflow: 'scroll'
			}}>

			<List
				sx={{ width: '100%', maxHeight: 300}}
				component="nav"
				aria-labelledby="nested-list-subheader"
				dense = {true}
			>
				{getPomodoroItemViews()}
			</List>

		</div>
	);
}
