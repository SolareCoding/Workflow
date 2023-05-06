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
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';

export interface PomodoroProps {
	focusedPomodoro: PomodoroModel | undefined,
	pomodoroArray: PomodoroModel[],
	setFocusPomodoro: (pomodoro: PomodoroModel) => void,
}

export default function PomodoroListView(props: PomodoroProps) {

	const { focusedPomodoro, pomodoroArray, setFocusPomodoro } = props
	const [showAllFinishedItems, setShowAllFinishedItems] = useState(false)
	const [showAllRunningItems, setShowAllRunningItems] = useState(true)
	const workPanelController = useContext(WorkPanelContext)

	const getPomodoroItemViews = () => {
		const itemViews = []
		for (const pomodoroModel of pomodoroArray) {
			if (pomodoroModel.status != PomodoroStatus.FINISHED) {
				itemViews.push(getPomodoroItemView(pomodoroModel))
			}
		}
		if (itemViews.length == 0) {
			itemViews.push(getEmptyHintItemView())
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
		if (itemViews.length == 0) {
			itemViews.push(getEmptyHintItemView())
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

	const getEmptyHintItemView = () => {
		return <ListItemButton key={'emptyHintItem'}>
			<Box
				className={'workflow-container-inner'}
				sx={{
					width: '100%',
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					id: 'emptyHintItem'
				}}>
				<div style={{width: '100%', fontSize: 14}}> No pomodoro</div>
			</Box>
		</ListItemButton>
	}

	const deletePomodoro = (pomodoroItem: PomodoroModel) => {
		workPanelController.updatePomodoro(pomodoroItem, UpdateMode.DELETE)
	}

	const getShowRunningItemListButton = () => {
		const hintIcon = showAllRunningItems ? <UnfoldLessIcon fontSize={'inherit'} /> : <UnfoldMoreIcon fontSize={'inherit'}/>
		return <div style={{marginRight: 25, width: '100%', flexDirection: 'row-reverse', display: "flex", alignItems: 'center'}}
					onClick={() => setShowAllRunningItems(!showAllRunningItems)}>
			{hintIcon}
			<div style={{textAlign: "end"}}> Running pomodoro </div>
		</div>
	}

	const getShowFinishedItemListButton = () => {
		const hintIcon = showAllFinishedItems ? <UnfoldLessIcon fontSize={'inherit'} /> : <UnfoldMoreIcon fontSize={'inherit'}/>
		return <div style={{marginRight: 25, width: '100%', flexDirection: 'row-reverse', display: "flex", alignItems: 'center'}}
					onClick={() => setShowAllFinishedItems(!showAllFinishedItems)}>
			{hintIcon}
			<div style={{textAlign: "end"}}> Finished pomodoro </div>
		</div>
	}

	const getItemListView = (itemStatus: PomodoroStatus, show: boolean) => {
		return !show ? null :
			<List
				sx={{ width: '100%', maxHeight: 300}}
				component="nav"
				aria-labelledby="nested-list-subheader"
				dense = {true}
			>
				{itemStatus == PomodoroStatus.RUNNING ? getPomodoroItemViews() : getPomodoroDoneItemViews()}
			</List>
	}

	return (
		<div
			className={'workflow-container-inner'}
			style={{
				maxHeight: 600,
				width: '100%',
				justifyContent: 'center',
				alignItems: 'center',
				display: 'flex',
				flexDirection: 'column',
				overflowY: 'scroll',
				overflowX: 'hidden'
			}}>
			{getShowRunningItemListButton()}
			{getItemListView(PomodoroStatus.RUNNING, showAllRunningItems)}
			<div style={{width: '100%', height: '0.5px', backgroundColor: 'var(--background-modifier-border)', marginBottom: '3px', marginTop: '3px'}} />
			{getShowFinishedItemListButton()}
			{getItemListView(PomodoroStatus.FINISHED, showAllFinishedItems)}
		</div>
	);
}
