import { configureStore } from "@reduxjs/toolkit";
import pomodoroReducer from '../pomodoro/Pomodoro.slice'
import workflowReducer from '../workflow/Workflow.slice'
import subjectReducer from '../subject/Subject.slice'
import shortcutReducer from '../nodes/Shortcut.slice'


export const store = configureStore({
	reducer: {
		pomodoro: pomodoroReducer,
		workflow: workflowReducer,
		subject: subjectReducer,
		shortcut: shortcutReducer,
	},
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
