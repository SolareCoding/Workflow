import {NodeShortcut} from "./Node.model";
import {Divider, Typography} from "@mui/material";
import {Platform, TFile, TFolder, Vault} from "obsidian";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import * as React from "react";
import {useContext, useEffect, useState} from "react";
import {CommandType} from "./Command";
import {TimeUtils} from "../utils/Time.utils";
import {getVaultBasePath, replaceAllSlashes} from "../settings/SettingHelper";
import {WorkPanelContext} from "../workpanel/WorkPanel.view";
import {getAllFolders, openFileInNewLeaf} from "../utils/File.utils";

export interface ShortCutProps {
	editorMode?: boolean,
	nodeShortCutModel: NodeShortcut,
	onUpdateShortCut: (nodeShortcut: NodeShortcut) => void,
}

export default function NodeShortcutView(nodeViewProps: ShortCutProps) {

	const workPanelController = useContext(WorkPanelContext)

	const {editorMode, nodeShortCutModel, onUpdateShortCut} = nodeViewProps
	const shortCutCommand = Platform.isMacOS ? nodeShortCutModel.macCommand : nodeShortCutModel.command

	const [shortCutName, setShortcutName] = useState(nodeShortCutModel.name || '')
	const [shortCutCommandType, setShortCutCommandType] = useState(shortCutCommand.type)

	useEffect(() => {
		setShortcutName(nodeShortCutModel?.name || '')
		setShortCutCommandType(shortCutCommand.type)
	}, [nodeShortCutModel])

	/**
	 * here are the order sequence on Windows
	 * 1. switch volume (like D:)
	 * 2. cd to the folder that contains the script
	 * 3. run the script with commandFolder as argument
	 * Only .bat file is supported
	 */
	const getWindowsCommand = (): string => {
		const vaultPath = getVaultBasePath(app)
		const commandPath = `${vaultPath}/${shortCutCommand.commandFile}`
		const commandFolderPath = replaceAllSlashes(commandPath.substring(0, commandPath.lastIndexOf('/')))
		const scriptName = shortCutCommand.commandFile.substring(shortCutCommand.commandFile.lastIndexOf('/') + 1)
		const commandFolder = `${vaultPath}/${shortCutCommand.commandFolder}`
		const commandDescFolderPath = replaceAllSlashes(commandFolder.substring(0, commandFolder.lastIndexOf('/')))
		let switchVolume = vaultPath.substring(0, vaultPath.lastIndexOf(':')+1)
		return `${switchVolume} & cd ${commandFolderPath} & ${scriptName} "${commandDescFolderPath}"`
	}

	/**
	 * to be decided on MacOS
	 */
	const getMacCommand = (): string => {
		const vaultPath = getVaultBasePath(app)
		const commandPath = `${vaultPath}/${shortCutCommand.commandFile}`
		const commandFolder = `${vaultPath}/${shortCutCommand.commandFolder}`
		return `${commandPath}`
	}

	const getMacCommandFolder = (): string => {
		const vaultPath = getVaultBasePath(app)
		const commandFolder = `${vaultPath}/${shortCutCommand.commandFolder}`
		return `"${commandFolder}"`

	}

	// execute the stored command
	const onShortcutClick = () => {
		if (!Platform.isDesktop) {
			return;
		}
		// execute the shell command in a sub-process, folder is passed as an argument
		// can`t be used because not enter the folder
		if (shortCutCommand.type === CommandType.SHELL) {
			if (!shortCutCommand.commandFile) {
				return;
			}
			if (Platform.isMacOS) {
				console.log("file path: ", getMacCommand())
				const result = require('child_process').execFile(getMacCommand(), [getMacCommandFolder()])
			} else {
				require('child_process').exec(getWindowsCommand(), { encoding: 'utf-8' })
			}
		} else if (shortCutCommand.type === CommandType.COPY_FILE) {
			if (!shortCutCommand.commandFile || !shortCutCommand.commandFolder) {
				return;
			}
			const originalFileName = shortCutCommand.commandFile.substring(shortCutCommand.commandFile.lastIndexOf('/') + 1)
			const newFilePath = `${shortCutCommand.commandFolder}${TimeUtils.getDateStr(Date.now())}-${originalFileName}`
			app.vault.adapter.exists(newFilePath).then((exist) =>{
				if (exist) {
					openFileInNewLeaf(newFilePath, app)
				} else {
					app.vault.adapter.copy(shortCutCommand.commandFile, newFilePath).then(() => {
						openFileInNewLeaf(newFilePath, app)
					})
				}
			})
		} else if (shortCutCommand.type === CommandType.OPEN_FILE) {
			if (!shortCutCommand.commandFile) {
				return
			}
			openFileInNewLeaf(shortCutCommand.commandFile, app)
		}
	}

	const handleNodeShortcutNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setShortcutName(event.target.value)
		nodeShortCutModel.name = event.target.value
		onUpdateShortCut(nodeShortCutModel)
	}

	const handleNodeShortcutTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const commandType = event.target.value == CommandType.SHELL ? CommandType.SHELL : CommandType.COPY_FILE
		if (commandType === shortCutCommand.type) {
			return
		}
		setShortCutCommandType(commandType)
		shortCutCommand.type = commandType
		onUpdateShortCut(nodeShortCutModel)
	}

	const handleNodeShortcutFileChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
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
		options.push(<option value={CommandType.OPEN_FILE}>{CommandType.OPEN_FILE}</option>)
		return options;
	}

	useEffect(() => {
		getScriptOptions()
	})

	const getScriptOptions = () => {
		const options: JSX.Element[] = []
		const settings = workPanelController.plugin?.settings
		const shellFolder = app.vault.getAbstractFileByPath(settings?.scriptPath || '') as TFolder
		Vault.recurseChildren(shellFolder, (f) => {
			if (f instanceof TFile) {
				if (!Platform.isMacOS && f.extension.toLowerCase() !== 'bat') {
					return
				}
				if (Platform.isMacOS && f.extension.toLowerCase() !== 'sh') {
					return
				}
				options.push(<option value={f.path}>{f.path}</option>);
			}
		});
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
		for (const folder of getAllFolders(app)) {
			options.push(<option key={folder} value={folder}>{folder} </option>)
		}
		return options;
	}

	const getEditorModeView = () => {
		return (
			<div style={{
				display: 'flex',
				flexDirection: 'column',
			}}>
				<Divider sx={{marginY: '3px'}}/>
				<div style={{display: "flex", flexDirection: 'row', alignItems: 'center'}}>
					<text style={{fontSize: 12, height: 12, verticalAlign: "bottom", width: 60}}>Name: </text>
					<input className={'workflow-input'} placeholder={'Shortcut name here'} style={{width: '100%', height: 20, fontSize: 12}} id="shortcut-name" value={shortCutName} onChange={handleNodeShortcutNameChange} />
				</div>
				<div style={{display: "flex", flexDirection: 'row', alignItems: 'center'}}>
					<text style={{fontSize: 12, height: 12, verticalAlign: "bottom", width: 60}}>Type: </text>
					<select style={{width: '100%', fontSize: 10, height: 20, marginTop: 3}} name="select-type" value={shortCutCommand.type} onChange={handleNodeShortcutTypeChange}>
						{getTypeOptions()}
					</select>
				</div>
				<div style={{display: "flex", flexDirection: 'row', alignItems: 'center'}}>
					<text style={{fontSize: 12, height: 12, verticalAlign: "bottom", width: 60}}>File: </text>
					<select value={shortCutCommand.commandFile} style={{width: '100%', fontSize: 10, height: 20, marginTop: 3}} name="select-type" onChange={handleNodeShortcutFileChange}>
						{shortCutCommandType == CommandType.SHELL ? getScriptOptions() : getFileOptions()}
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

	// modify the conditions here.
	const getWorkflowModeView = () => {
		if (shortCutCommand.type == CommandType.SHELL && !shortCutCommand.commandFile) {
			return null
		}
		// Mac且没有macShortCut,直接返回
		if (shortCutCommand.type == CommandType.COPY_FILE && (!shortCutCommand.commandFile || !shortCutCommand.commandFolder)) {
			return null
		}
		return (
			<div>
				<Divider sx={{marginY: '3px'}}/>
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
			{ getShortcutView() }
		</div>
	);
}
