import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../repository/Workflow.store";
import {PipelineModel, SectionModel} from "../pipeline/Pipeline.model";
import {WorkPanelModel} from "../workpanel/WorkPanel.model";
import {NodeModel} from "./Node.model";
import WorkflowPlugin from "../../main";
import {getAllFolders} from "../utils/File.utils";
import {Platform, TFile, TFolder, Vault} from "obsidian";
import {WorkflowSettings} from "../settings/WorkflowSettings";

export interface ShortCutState {
	shellFiles: string[]
	normalFiles: string[]
	folderFiles: string[]
}

const initialState: ShortCutState = {
	shellFiles: [],
	normalFiles: [],
	folderFiles: [],
}

export const shortCutSlice = createSlice({
	name: 'shortcut',
	initialState,
	reducers: {
		loadShortCut:  (state, action: PayloadAction<WorkflowSettings>) => {
			const shellFiles :string[] = []
			const shellFolder = app.vault.getAbstractFileByPath(action.payload.scriptPath || '') as TFolder
			Vault.recurseChildren(shellFolder, (f) => {
				if (f instanceof TFile) {
					if (!Platform.isMacOS && f.extension.toLowerCase() !== 'bat') {
						return
					}
					if (Platform.isMacOS && f.extension.toLowerCase() !== 'sh') {
						return
					}
					shellFiles.push(f.path);
				}
			});
			state.shellFiles = shellFiles;
			state.normalFiles = app.vault.getFiles().map((value) => value.path)
			state.folderFiles = getAllFolders(app)
		},
	},
});

export const { loadShortCut} = shortCutSlice.actions;

export const selectShortcut = (state: RootState) => state.shortcut

export default shortCutSlice.reducer;
