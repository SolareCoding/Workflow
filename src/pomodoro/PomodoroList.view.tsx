import * as React from "react";
import {useContext, useState} from "react";
import {PomodoroModel, PomodoroStatus} from "./Pomodoro.model";
import {TimeUtils} from "../utils/Time.utils";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import ListItemButton from "@mui/material/ListItemButton";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {WorkPanelContext} from "../workpanel/WorkPanel.view";
import {UpdateMode} from "../workpanel/WorkPanel.controller";

export interface PomodoroProps {
	focusedPomodoro: PomodoroModel | undefined,
	pomodoroArray: PomodoroModel[],
	setFocusPomodoro: (pomodoro: PomodoroModel) => void,
}

export default function PomodoroListView(props: PomodoroProps) {

	const { focusedPomodoro, pomodoroArray, setFocusPomodoro } = props
	const [showAll, setShowAll] = useState(false)
	const workPanelController = useContext(WorkPanelContext)

	const getPomodoroItemViews = () => {
		const itemViews = []
		for (const pomodoroModel of pomodoroArray) {
			if (pomodoroModel.status != PomodoroStatus.FINISHED) {
				itemViews.push(getPomodoroItemView(pomodoroModel))
			}
		}
		return itemViews
	}

	const getPomodoroDoneItemViews = () => {
		const itemViews = []
		for (const pomodoroModel of pomodoroArray) {
			if (pomodoroModel.status == PomodoroStatus.FINISHED) {
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
					alignItems: 'center',
					id: pomodoroItem.id
				}} onClick={() => {
				if (pomodoroItem.status == PomodoroStatus.RUNNING) {
					setFocusPomodoro(pomodoroItem)
				}
			}}>
				<div style={{width: '100%', fontSize: 14}}> {pomodoroItem?.title} </div>
				<div style={{minWidth: 45, fontSize: 14}}>
					{TimeUtils.getMMSSStr(pomodoroItem.timeleft)}
				</div>
				{(pomodoroItem.status == PomodoroStatus.RUNNING) ? null :
					<DeleteOutlineIcon fontSize={'inherit'} onClick={() => deletePomodoro(pomodoroItem)}/>}
			</Box>
		</ListItemButton>
	}

	const deletePomodoro = (pomodoroItem: PomodoroModel) => {
		workPanelController.updatePomodoro(pomodoroItem, UpdateMode.DELETE)
	}

	const getShowFinishedItemListButton = () => {
		const hintText = showAll? 'Hide finished items' : 'Show finished items'
		return <div style={{marginRight: 25, width: '100%', textAlign: "end"}} onClick={() => setShowAll(!showAll)}> { hintText }</div>
	}

	const getDoneItemListView = () => {
		return !showAll ? null :
			<List
				sx={{ width: '100%', maxHeight: 300}}
				component="nav"
				aria-labelledby="nested-list-subheader"
				dense = {true}
			>
				{getPomodoroDoneItemViews()}
			</List>
	}

	return (
		<div
			className={'workflow-container-inner'}
			style={{
				maxHeight: 600,
				maxWidth: '100%',
				justifyContent: 'center',
				alignItems: 'center',
				display: 'flex',
				flexDirection: 'column',
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
			{getShowFinishedItemListButton()}
			{getDoneItemListView()}
		</div>
	);
}
