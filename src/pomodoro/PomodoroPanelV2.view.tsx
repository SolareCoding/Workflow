import * as React from "react";

import {
	PomodoroModel,
	PomodoroStatus,
	newPomodoroModel,
} from "./Pomodoro.model";
import { add, selectPomodoro, update } from "./Pomodoro.slice";
import { useAppDispatch, useAppSelector } from "../repository/hooks";
import { useEffect, useState } from "react";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Divider } from "@mui/material";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import { PipelineModel } from "../pipeline/Pipeline.model";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PomodoroView from "./Pomodoro.view";
import StopCircleIcon from "@mui/icons-material/StopCircle";

/**
 * 创建、管理所有的番茄时钟？
 */
export interface PomodoroPanelProps {
	focusedPipeline?: PipelineModel;
}

export default function PomodoroSnackViewV2(props: PomodoroPanelProps) {
	const pomodoroList = useAppSelector(selectPomodoro).pomodoroArray;
	const dispatch = useAppDispatch();
	const { focusedPipeline } = props;
	const [focusedPomodoro, setFocusedPomodoro] = useState<
		undefined | PomodoroModel
	>();

	useEffect(() => {
		setFocusedPomodoro(getDefaultPomodoro);
	}, [pomodoroList]);

	const getDefaultPomodoro = () => {
		for (const pomodoroModel of pomodoroList) {
			if (pomodoroModel.status != PomodoroStatus.FINISHED) {
				return pomodoroModel;
			}
		}
		return undefined;
	};

	const addNewPomodoro = () => {
		// Check focused pipeline, no pipeline or template pipeline should return
		if (!focusedPipeline || focusedPipeline.isTemplate) {
			return;
		}
		// check pomodoro
		if (focusedPomodoro && !focusedPomodoro.status) {
			return;
		}
		const newPomodoro = newPomodoroModel(focusedPipeline);
		dispatch(add(newPomodoro));
	};

	const savePomodoro = () => {
		const copiedPomodoro = Object.assign({}, focusedPomodoro, {
			editMode: false,
		});
		dispatch(update(copiedPomodoro));
	};

	const pausePomodoro = () => {
		updatePomodoroStatus(PomodoroStatus.PAUSED);
	};

	const resumePomodoro = () => {
		updatePomodoroStatus(PomodoroStatus.RUNNING);
	};

	const stopPomodoro = () => {
		updatePomodoroStatus(PomodoroStatus.FINISHED);
	};

	const updatePomodoroStatus = (status: PomodoroStatus) => {
		if (
			!focusedPomodoro ||
			focusedPomodoro.status === PomodoroStatus.FINISHED
		) {
			return;
		}
		const copiedPomodoro = Object.assign({}, focusedPomodoro, {
			status: status,
		});
		setFocusedPomodoro(copiedPomodoro);
		dispatch(update(copiedPomodoro));
	};

	const getPomodoroView = () => {
		if (focusedPomodoro) {
			return <PomodoroView pomodoro={focusedPomodoro} />;
		}
		return <div>No pomodoro is running</div>;
	};

	const getAddView = () => {
		if (
			focusedPomodoro &&
			focusedPomodoro.status != PomodoroStatus.FINISHED
		) {
			return null;
		}
		if (focusedPomodoro?.editMode) {
			return null;
		}
		return <AddCircleIcon onClick={addNewPomodoro} />;
	};

	const getPauseResumeView = () => {
		if (
			!focusedPomodoro ||
			focusedPomodoro.status == PomodoroStatus.FINISHED
		) {
			return null;
		}
		if (focusedPomodoro?.editMode) {
			return null;
		}
		if (focusedPomodoro.status == PomodoroStatus.RUNNING) {
			return <PauseCircleIcon onClick={pausePomodoro} />;
		} else {
			return <PlayCircleIcon onClick={resumePomodoro} />;
		}
	};

	const getStopView = () => {
		if (
			!focusedPomodoro ||
			focusedPomodoro.status == PomodoroStatus.FINISHED
		) {
			return null;
		}
		if (focusedPomodoro?.editMode) {
			return null;
		}
		return <StopCircleIcon onClick={stopPomodoro} />;
	};
	const getSaveView = () => {
		if (focusedPomodoro?.editMode) {
			return <CheckCircleIcon onClick={savePomodoro} />;
		} else {
			return null;
		}
	};

	return (
		<div
			style={{
				display: "flex",
				width: "100%",
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			{getPomodoroView()}
			<Divider
				flexItem
				orientation="vertical"
				sx={{ marginLeft: 1, marginRight: 1 }}
			/>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				{getAddView()}
				{getSaveView()}
				{getPauseResumeView()}
				{getStopView()}
			</div>
		</div>
	);
}
