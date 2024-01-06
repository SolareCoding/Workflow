import {NodeShortcut} from "./Node.model";
import {Divider, Typography} from "@mui/material";
import {Platform, TFile, TFolder, Vault} from "obsidian";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import * as React from "react";
import {useContext, useEffect, useMemo, useState} from "react";
import {CommandType} from "./Command";
import {TimeUtils} from "../utils/Time.utils";
import {getVaultBasePath, replaceAllSlashes} from "../settings/SettingHelper";
import {WorkPanelContext} from "../workpanel/WorkPanel.view";
import {openFileInNewLeaf} from "../utils/File.utils";
import {isEmpty} from "../utils/Text.utils";
import {selectShortcut} from "./Shortcut.slice";
import {useAppSelector} from "../repository/hooks";

export interface ShortCutProps {
	nodeID: string,
	editorMode?: boolean,
	nodeShortCutModel: NodeShortcut,
	onUpdateShortCut: (nodeShortcut: NodeShortcut) => void,
}

export default function NodeShortcutView(nodeViewProps: ShortCutProps) {

	const workPanelController = useContext(WorkPanelContext)
	const shortcutRepo = useAppSelector(selectShortcut)

	const {editorMode, nodeShortCutModel, onUpdateShortCut} = nodeViewProps
	let shortCutCommand = Platform.isMacOS ? nodeShortCutModel.macCommand : nodeShortCutModel.command

	const [shortCutName, setShortcutName] = useState(nodeShortCutModel.name || '')
	const [shortCutCommandType, setShortCutCommandType] = useState(shortCutCommand.type)
	const [shortCutFile, setShortCutFile] = useState(shortCutCommand.commandFile)
	const [shortCutFolder, setShortCutFolder] = useState(shortCutCommand.commandFolder)

	const getFileOptions = useMemo(() => {
		return shortcutRepo.normalFiles.map((file) => <option key={file} value={file}>{file}</option>)
	}, [])

const getFolderOptions = useMemo(() => {
	return shortcutRepo.folderFiles.map((file) => <option key={file} value={file}>{file}</option>)
	}, [])

	const getTypeOptions = useMemo(() => {
		const options = []
		for (let commandTypeKey in CommandType) {
			options.push(<option key={commandTypeKey} value={commandTypeKey}>{commandTypeKey}</option>);
		}
		return options
	}, []);

	const isShellFile = (fileName: string) => {
		return fileName.endsWith('bat') || fileName.endsWith('sh');
	}


	const getScriptOptions = useMemo( () => {
		return shortcutRepo.shellFiles.map((file) => <option key={file} value={file}>{file}</option>)
	}, [])

	useEffect(() => updateShortCut(), [shortCutName, shortCutCommandType, shortCutFile, shortCutFolder])
	useEffect(() => {
		switch (shortCutCommandType) {
			case CommandType.SHELL:
				if (isEmpty(shortCutFile) || !isShellFile(shortCutFile)) {
					setShortCutFile(getScriptOptions.first()?.key || '')
				}
				if (isEmpty(shortCutFolder)) {
					setShortCutFolder( getFolderOptions.first()?.key || '')
				}
				break;
			case CommandType.OPEN_FILE:
			case CommandType.COPY_FILE:
				if (isEmpty(shortCutFile) || isShellFile(shortCutFile)) {
					setShortCutFile(getFileOptions.first()?.key || '')
				}
				if (isEmpty(shortCutFolder)) {
					setShortCutFolder( getFolderOptions.first()?.key || '')
				}
				break;
			case CommandType.EMPTY:
				setShortCutFile('')
				setShortCutFolder('')
				break;

		}
	}, [shortCutCommandType]);

	const updateShortCut = () => {
		const newShortCut = Platform.isMacOS ? {
			name: shortCutName,
			macCommand: {
				type: shortCutCommandType,
				commandFile: shortCutFile,
				commandFolder: shortCutFolder,
			}
		} : {
			name: shortCutName,
			command: {
				type: shortCutCommandType,
				commandFile: shortCutFile,
				commandFolder: shortCutFolder,
			}
		}
		const newShortCutOB = Object.assign({}, nodeShortCutModel, newShortCut)
		onUpdateShortCut(newShortCutOB)
	}

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
		if (shortCutCommandType === CommandType.SHELL) {
			if (!shortCutCommand.commandFile) {
				return;
			}
			if (Platform.isMacOS) {
				const result = require('child_process').execFile(getMacCommand(), [getMacCommandFolder()])
			} else {
				require('child_process').exec(getWindowsCommand(), { encoding: 'utf-8' })
			}
		} else if (shortCutCommandType === CommandType.COPY_FILE) {
			if (isEmpty(shortCutFile) || isEmpty(shortCutFolder)) {
				return;
			}
			const folderPath = shortCutFolder.endsWith('/') ? shortCutFolder : shortCutFolder + '/'
			const originalFileName = shortCutCommand.commandFile.substring(shortCutCommand.commandFile.lastIndexOf('/') + 1)
			const newFilePath = `${folderPath}${TimeUtils.getDateStr(Date.now())}-${originalFileName}`
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
	}

	const handleNodeShortcutTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		const commandType = event.target.value as CommandType
		if (commandType === shortCutCommand.type) {
			return
		}
		setShortCutCommandType(commandType)
	}

	const handleNodeShortcutFileChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setShortCutFile(event.target.value)
	}

	const handleNodeShortcutFolderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setShortCutFolder(event.target.value)
	}

	const getEditorModeView = () => {
		return (
			<div style={{
				display: 'flex',
				flexDirection: 'column',
			}}>
				<Divider sx={{marginY: '3px'}}/>
				<div style={{display: "flex", flexDirection: 'row', alignItems: 'center'}}>
					<div style={{fontSize: 12, height: 12, verticalAlign: "bottom", width: 60}}>Name: </div>
					<input className={'workflow-input'} placeholder={'Shortcut name here'} style={{width: '100%', height: 20, fontSize: 12}} id="shortcut-name" value={shortCutName} onChange={handleNodeShortcutNameChange} />
				</div>
				<div style={{display: "flex", flexDirection: 'row', alignItems: 'center'}}>
					<div style={{fontSize: 12, height: 12, verticalAlign: "bottom", width: 60}}>Type: </div>
					<select style={{width: '100%', fontSize: 10, height: 20, marginTop: 3}} name="select-type" value={shortCutCommand.type} onChange={handleNodeShortcutTypeChange}>
						{getTypeOptions}
					</select>
				</div>
				<div style={{display: "flex", flexDirection: 'row', alignItems: 'center'}}>
					<div style={{fontSize: 12, height: 12, verticalAlign: "bottom", width: 60}}>File: </div>
					<select value={shortCutCommand.commandFile} style={{width: '100%', fontSize: 10, height: 20, marginTop: 3}} name="select-type" onChange={handleNodeShortcutFileChange}>
						{shortCutCommandType == CommandType.SHELL ? getScriptOptions : getFileOptions}
					</select>
				</div>
				<div style={{display: "flex", flexDirection: 'row', alignItems: 'center'}}>
					<div style={{fontSize: 12, height: 12, verticalAlign: "bottom", width: 60}}>Folder: </div>
					<select value={shortCutCommand.commandFolder} style={{width: '100%', fontSize: 10, height: 20, marginTop: 3}} name="select-type" onChange={handleNodeShortcutFolderChange}>
						{getFolderOptions}
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
		<div key={'shortcutView' + nodeViewProps.nodeID}>
			{ getShortcutView() }
		</div>
	);
}
