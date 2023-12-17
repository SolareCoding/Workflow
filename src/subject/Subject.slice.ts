import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../repository/Workflow.store";
import {newSubjectInstance, SubjectModel} from "./Subject.model";
import {WorkPanelModel} from "../workpanel/WorkPanel.model";
import {UpdateMode} from "../workpanel/WorkPanel.controller";

export interface SubjectState {
	rootSubject: SubjectModel;
	hasLoaded: boolean
}

const initialState: SubjectState = {
	rootSubject: newSubjectInstance('0'),
	hasLoaded: false
}

export interface SubjectAction {
	subject: SubjectModel,
	updateMode: UpdateMode,
}

const searchParentSubject = (rootSubject: SubjectModel, parentSubjectID: string): SubjectModel | null => {
	for (let i = 0; i < rootSubject.children.length; i++) {
		if (rootSubject.children[i].id == parentSubjectID) {
			return rootSubject.children[i]
		} else {
			const searchResult = searchParentSubject(rootSubject.children[i], parentSubjectID)
			if (searchResult != null) {
				return searchResult
			}
		}
	}
	return null
}

export const subjectSlice = createSlice({
	name: 'subject',
	initialState,
	reducers: {
		loadSubject:  (state, action: PayloadAction<WorkPanelModel>) => {
			state.rootSubject = action.payload.subject
			state.hasLoaded = true
		},
		updateSubject: (state, action: PayloadAction<SubjectAction>) => {
			const originalSubject = state.rootSubject
			if (!originalSubject) {
				return;
			}
			const parentSubject = action.payload.subject.parentID == originalSubject.id ? originalSubject
				: searchParentSubject(originalSubject, action.payload.subject.parentID)
			if (!parentSubject) {
				return
			}
			const newChildren = []
			for (let i = 0; i < parentSubject.children.length; i++) {
				if (parentSubject.children[i].id != action.payload.subject.id) {
					newChildren.push(parentSubject.children[i])
				} else if (action.payload.updateMode == UpdateMode.UPDATE) {
					newChildren.push(action.payload.subject)
				}
			}
			if (action.payload.updateMode == UpdateMode.ADD) {
				newChildren.push(action.payload.subject)
			}
			parentSubject.children = newChildren
		},
	},
});

export const { loadSubject, updateSubject } = subjectSlice.actions;

export const selectSubject = (state: RootState) => state.subject

export default subjectSlice.reducer;
