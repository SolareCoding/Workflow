import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {PomodoroModel} from "./Pomodoro.model";
import {RootState} from "../repository/Workflow.store";

export interface PomodoroState {
	pomodoroArray: PomodoroModel[]
	hasLoaded: boolean
}

const initialState: PomodoroState = {
	pomodoroArray: [],
	hasLoaded: false
}

export const pomodoroSlice = createSlice({
	name: 'pomodoro',
	initialState,
	reducers: {
		loadPomodoro:  (state, action: PayloadAction<PomodoroModel[]>) => {
			state.pomodoroArray = action.payload
			state.hasLoaded = true
		},
		add: (state, action: PayloadAction<PomodoroModel>) => {
			state.pomodoroArray.push(action.payload);
		},
		remove: (state, action: PayloadAction<PomodoroModel>) => {
			const index = state.pomodoroArray.findIndex((value) => value.id == action.payload.id)
			if (index > -1) {
				state.pomodoroArray.splice(index, 1);
			}
		},
		update: (state, action: PayloadAction<PomodoroModel>) => {
			const index = state.pomodoroArray.findIndex((value) => value.id == action.payload.id)
			if (index > -1) {
				Object.assign(state.pomodoroArray[index], action.payload)
			}
		},
		updateStatus: (state, action: PayloadAction<PomodoroModel>) => {
			const index = state.pomodoroArray.findIndex((value) => value.id == action.payload.id)
			if (index > -1) {
				state.pomodoroArray[index].status = action.payload.status
				console.log('found item to update')
			}
		},
	},
});

export const { loadPomodoro,  add, remove, update, updateStatus } = pomodoroSlice.actions;

export const selectPomodoro = (state: RootState) => state.pomodoro

export default pomodoroSlice.reducer;
