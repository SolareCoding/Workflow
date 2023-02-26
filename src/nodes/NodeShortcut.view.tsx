import {NodeShortcut} from "./Node.model";
import {Divider, Typography} from "@mui/material";
import {Platform} from "obsidian";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import * as React from "react";
import {useEffect, useState} from "react";
import {CommandType} from "./Command";
import {TimeUtils} from "../utils/Time.utils";

export interface ShortCutProps {
	editorMode?: boolean,
	nodeShortCutModel: NodeShortcut,
	onUpdateShortCut: (nodeShortcut: NodeShortcut) => void,
}

export default function NodeShortcutView(nodeViewProps: ShortCutProps) {

	const {editorMode, nodeShortCutModel, onUpdateShortCut} = nodeViewProps
	const shortCutCommand = Platform.isMacOS ? nodeShortCutModel.macCommand : nodeShortCutModel.command

	const [shortCutName, setShortcutName] = useState(nodeShortCutModel.name || '')

	useEffect(() => {
		setShortcutName(nodeShortCutModel?.name || '')
	}, [nodeShortCutModel])

	// execute the stored command
	const onShortcutClick = () => {
		if (!Platform.isDesktop) {
			return;
		}
		// check if the command is valid
		if (!shortCutCommand?.commandFolder || !shortCutCommand?.commandFile) {
			return
		}
		// execute the shell command in a sub-process
		if (shortCutCommand.type === CommandType.SHELL) {
			const command = `${shortCutCommand.commandFolder} ${shortCutCommand.commandFile}`
			require('child_process').exec(command, { encoding: 'utf-8' })
		} else if (shortCutCommand.type === CommandType.COPY_FILE) {
			const originalFileName = shortCutCommand.commandFile.substring(shortCutCommand.commandFile.lastIndexOf('/') + 1)
			const newFilePath = `${shortCutCommand.commandFolder}${TimeUtils.getDateStr(Date.now())}-${originalFileName}`
			app.vault.adapter.exists(newFilePath).then((exist) =>{
				if (exist) {
					// open the file directly
				} else {
					app.vault.adapter.copy(shortCutCommand.commandFile, newFilePath).then(() => {})
				}
			})
		}
	}

	const handleNodeShortcutNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setShortcutName(event.target.value)
		nodeShortCutModel.name = event.target.value
		onUpdateShortCut(nodeShortCutModel)
	}

	const handleNodeShortcutTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		shortCutCommand.type = event.target.value == CommandType.SHELL ? CommandType.SHELL : CommandType.COPY_FILE
		onUpdateShortCut(nodeShortCutModel)
	}

	const handleNodeShortcutFileChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		console.log("file changed: " + event.target.value)
		shortCutCommand.commandFile = event.target.value
		onUpdateShortCut(nodeShortCutModel)
	}

	const handleNodeShortcutFolderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		shortCutCommand.commandFolder = event.target.value
		onUpdateShortCut(nodeShortCutModel)
	}

	const getTypeOptions = () => {
		const options = []
		options.push(<option value={CommandType.SHELL}>{CommandType.SHELL}</option>);
		options.push(<option value={CommandType.COPY_FILE}>{CommandType.COPY_FILE}</option>);
		return options;
	}

	const getFileOptions = () => {
		const options = []
		const files = app.vault.getFiles()
		for (const file of files) {
			options.push(<option key={file.path} value={file.path}>{file.path}</option>)
		}
		return options;
	}

	const getFolderOptions = () => {
		const options = []
		const folders: string[] = []
		const files = app.vault.getFiles()
		for (const file of files) {
			const folder = file.path.substring(0, file.path.lastIndexOf('/') + 1)
			if (!folders.includes(folder)) {
				folders.push(folder)
			}
		}
		for (const folder of folders) {
			options.push(<option key={folder} value={folder}>{folder} </option>)
		}
		return options;
	}

	const getEditorModeView = () => {
		console.log('getEditorModeView file')

		return (
			<div style={{
				display: 'flex',
				flexDirection: 'column',
			}}>
				<div style={{display: "flex", flexDirection: 'row', alignItems: 'center'}}>
					<text style={{fontSize: 12, height: 12, verticalAlign: "bottom", width: 60}}>Name: </text>
					<input placeholder={'Shortcut name here'} style={{width: '100%', height: 20, fontSize: 12}} id="shortcut-name" value={shortCutName} onChange={handleNodeShortcutNameChange} />
				</div>
				<div style={{display: "flex", flexDirection: 'row', alignItems: 'center'}}>
					<text style={{fontSize: 12, height: 12, verticalAlign: "bottom", width: 60}}>Type: </text>
					<select style={{width: '100%', fontSize: 10, height: 20, marginTop: 3}} name="select-type" onChange={handleNodeShortcutTypeChange}>
						{getTypeOptions()}
					</select>
				</div>
				<div style={{display: "flex", flexDirection: 'row', alignItems: 'center'}}>
					<text style={{fontSize: 12, height: 12, verticalAlign: "bottom", width: 60}}>File: </text>
					<select value={shortCutCommand.commandFile} style={{width: '100%', fontSize: 10, height: 20, marginTop: 3}} name="select-type" onChange={handleNodeShortcutFileChange}>
						{getFileOptions()}
					</select>
				</div>
				<div style={{display: "flex", flexDirection: 'row', alignItems: 'center'}}>
					<text style={{fontSize: 12, height: 12, verticalAlign: "bottom", width: 60}}>Folder: </text>
					<select value={shortCutCommand.commandFolder} style={{width: '100%', fontSize: 10, height: 20, marginTop: 3}} name="select-type" onChange={handleNodeShortcutFolderChange}>
						{getFolderOptions()}
					</select>
				</div>

			</div>
		)
	}

	const getWorkflowModeView = () => {
		if (!nodeShortCutModel.command && !Platform.isMacOS) {
			return null
		}
		// Mac且没有macShortCut,直接返回
		if (!nodeShortCutModel.macCommand && Platform.isMacOS) {
			return null
		}
		return (
			<div style={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'flex-start',
				marginBottom: 1,
				marginTop: 1
			}} onClick={()=> {onShortcutClick()}}>
				<PlayCircleFilledWhiteIcon sx={{width: 16, height: 16, marginRight: 1}}/>
				<Typography sx={{fontSize: 12}}>{nodeShortCutModel.name} </Typography>
			</div>
		);
	}

	const getShortcutView = () => {
		if (editorMode) {
			return getEditorModeView();
		} else {
			return getWorkflowModeView();
		}
	}

	return (
		<div>
			<Divider sx={{marginY: '1px'}}/>
			{ getShortcutView() }
		</div>
	);
}
