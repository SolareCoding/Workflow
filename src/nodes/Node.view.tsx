import * as React from "react";
import {useState} from "react";
import Box from "@mui/material/Box";
import {Divider, Menu, MenuItem, Typography} from "@mui/material";
import {NodeActionEnum, NodeStatusEnum} from "./NodeStatus.enum";
import {NodeModel} from "./Node.model";
import {TimeUtils} from "../utils/Time.utils";
import DeleteIcon from '@mui/icons-material/Delete';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import RunCircleIcon from '@mui/icons-material/RunCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';

interface NodeProps {
	node: NodeModel,
	couldUpdate: boolean,
	editorMode?: boolean,
	onNodeUpdate: () => void,
	onNodeRemove: (node: NodeModel) => void,
}

export default function NodeView(nodeViewProps: NodeProps) {

	const {node, couldUpdate, editorMode, onNodeUpdate, onNodeRemove} = nodeViewProps
	const [showTips, setShowTips] = useState(false)
	const [anchorEl, setAnchorEl] = useState<null | HTMLDivElement>(null);
	const open = Boolean(anchorEl);
	const [title, setTitle] = useState(node.title)
	const [tipSummary, setTipSummary] = useState(node.tips?.summary || 'Input tip summary')
	const [tipContent, setTipContent] = useState(node.tips?.content || 'Input tip content')
	const [shortCutName, setShortcutName] = useState(node.shortcut?.name || '请输入快捷指令名称')
	const [shortCutCmd, setShortCutCmd] = useState(node.shortcut?.command || '')

	const handleStatusClick = (event: React.MouseEvent<HTMLDivElement>) => {
		if (!couldUpdate || editorMode) {
			return;
		}
		if (node.status == NodeStatusEnum.DONE) {
			return;
		}
		setAnchorEl(event.currentTarget);
	};

	const handleClose = (action?: NodeActionEnum) => {
		setAnchorEl(null);
		if (!action)
			return
		switch (action) {
			case NodeActionEnum.WORK:
				node.status = NodeStatusEnum.WORKING
				node.startTime = Date.now()
				break
			case NodeActionEnum.CANCEL:
				node.status = NodeStatusEnum.PENDING
				node.startTime = 0
				break
			case NodeActionEnum.FINISH:
				node.status = NodeStatusEnum.DONE
				node.finishTime = Date.now()
				break;
		}
		onNodeUpdate();
	};

	const getColorFromNodeStatus = () => {
		if (!couldUpdate || editorMode) {
			return "#6C6C6C"
		}
		switch (node.status) {
			case NodeStatusEnum.PENDING:
				return '#7e57c2'
			case NodeStatusEnum.WORKING:
				return '#42a5f5'
			case NodeStatusEnum.DONE:
				return '#9ccc65'
		}
	};

	const getStatusIcon = () => {
		switch (node.status) {
			case NodeStatusEnum.PENDING:
				return <WatchLaterIcon htmlColor={getColorFromNodeStatus()}/>
			case NodeStatusEnum.WORKING:
				return <RunCircleIcon htmlColor={getColorFromNodeStatus()}/>
			case NodeStatusEnum.DONE:
				return <CheckCircleIcon htmlColor={getColorFromNodeStatus()}/>
		}
	}

	const getMenuItems = () => {
		let items = []
		switch (node.status) {
			case NodeStatusEnum.PENDING:
				items.push([
					<MenuItem sx={{fontSize: 13}} onClick={() => {
						handleClose(NodeActionEnum.WORK)
					}}>{NodeActionEnum.WORK}</MenuItem>,
				])
				break;
			case NodeStatusEnum.WORKING:
				items.push([
					<MenuItem sx={{fontSize: 13}} onClick={() => {
						handleClose(NodeActionEnum.CANCEL)
					}}>{NodeActionEnum.CANCEL}</MenuItem>,
					<MenuItem sx={{fontSize: 13}} onClick={() => {
						handleClose(NodeActionEnum.FINISH)
					}}>{NodeActionEnum.FINISH}</MenuItem>
				])
				break;
			case NodeStatusEnum.DONE:
				break;
		}
		return items;
	}

	const handleRemoveNode = (event: React.MouseEvent<HTMLElement>) => {
		onNodeRemove(node)
	}

	const getTipsButton = () => {
		if (showTips) {
			return <UnfoldLessIcon onClick={()=>{setShowTips(!showTips)}}/>
		} else {
			return <UnfoldMoreIcon onClick={()=>{setShowTips(!showTips)}}/>
		}
	}

	const getTipsView = () => {
		if (!editorMode && !node.tips.summary) {
			return false
		}
		return <div>
			<Divider sx={{marginY: '1px'}}/>
			<Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
				<Box sx={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}>
					{getTipSummaryView()}
					{getTipsButton()}
				</Box>
				{getTipsContentView()}
			</Box>
		</div>
	}

	const getTipSummaryView = () => {
		if (!editorMode) {
			return <Typography sx={{fontSize: 14, fontWeight: '600'}}>{node.tips.summary}</Typography>
		} else {
			return <input style={{fontSize: 14, maxWidth: 130, fontWeight: 600}} id="tip-summary" value={tipSummary} onChange={handleNodeTipSummaryChange} />
		}
	}

	const getTipsContentView = () => {
		if (!editorMode) {
			if (!node.tips.content) {
				return false
			}
			if (showTips) {
				return <Typography sx={{fontSize: 12}}>{tipContent}</Typography>
			} else {
				return false
			}
		}
		else {
			return <input style={{fontSize: 12, marginTop: 1}} id="tip-content" value={tipContent} onChange={handleNodeTipContentChange} />
		}
	}

	const getTimeDetails = () => {
		if (editorMode) {
			return false;
		}
		let details = []
		switch (node.status) {
			case NodeStatusEnum.DONE:
				details.push(
					<Typography sx={{fontSize: 12}}>
						{'Finish: ' + TimeUtils.getDateTimeStr(node.finishTime)}
					</Typography>
				)
				details.push(
					<Typography sx={{fontSize: 12}}>
						{'Start: ' + TimeUtils.getDateTimeStr(node.startTime)}
					</Typography>
				)
				break;
			case NodeStatusEnum.WORKING:
				details.push(
					<Typography sx={{fontSize: 12}}>
						{'Start: ' + TimeUtils.getDateTimeStr(node.startTime)}
					</Typography>
				)
				break;
			case NodeStatusEnum.PENDING:
				break;
		}
		if (!details || details.length == 0) {
			return false
		}
		return <div>
			<Divider sx={{marginY: '1px'}}/>
			{ details }
		</div>
	}

	// execute the stored command
	const onShortcutClick = () => {
		const execSync = require('child_process').execSync;
		const output = execSync(node.shortcut.command, { encoding: 'utf-8' });  // the default is 'buffer'
		console.log('Output was:\n', output);
	}

	const handleNodeShortcutNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setShortcutName(event.target.value)
		node.shortcut.name = event.target.value
		onNodeUpdate()
	}

	const handleNodeShortcutCommandChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setShortCutCmd(event.target.value)
		node.shortcut.command = event.target.value
		onNodeUpdate()
	}


	const getNodeShortCutView = () => {
		// if is editorMode, introduce the user to input shortcut name command
		if (editorMode) {
			return (
				<div>
					<Divider sx={{marginY: '1px'}}/>
					<div style={{
						display: 'flex',
						flexDirection: 'column',
					}}>
						<input style={{fontSize: 12, fontWeight: 600, marginBottom: 3}} id="shortcut-name" value={shortCutName} onChange={handleNodeShortcutNameChange} />
						<input style={{fontSize: 12}} id="shortcut-command" value={shortCutCmd} onChange={handleNodeShortcutCommandChange} />
					</div>
				</div>
			)
        }
		if (!shortCutCmd) {
			return false
		}
		return (
			<div>
				<Divider sx={{marginY: '1px'}}/>
				<div style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'flex-start',
					marginBottom: 1,
					marginTop: 1
				}} onClick={()=> {onShortcutClick()}}>
					<PlayCircleFilledWhiteIcon sx={{width: 16, height: 16, marginRight: 1}}/>
					<Typography sx={{fontSize: 12}}>{shortCutName} </Typography>
				</div>
			</div>
		)
	}

	const handleNodeNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(event.target.value)
		node.title = event.target.value
		onNodeUpdate()
	}

	const handleNodeTipSummaryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTipSummary(event.target.value)
		node.tips.summary = event.target.value
		onNodeUpdate()
	}

	const handleNodeTipContentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTipContent(event.target.value)
		node.tips.content = event.target.value
		onNodeUpdate()
	}

	const getHeaderView = () => {
		return <div>
			<Box sx={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'space-between',
			}}>
				{getTitleView()}
				{getActionView()}
			</Box>
		</div>

	}

	const getTitleView = () => {
		if (!editorMode) {
			return <Typography sx={{fontSize: 14, fontWeight: 600}}>{title}</Typography>
		} else {
			return <input style={{fontSize: 14, maxWidth: 130, fontWeight: 600}} id="title" value={title} onChange={handleNodeNameChange} />
		}
	}

	const getActionView = () => {
		if (!editorMode) {
			return (
				<div>
					<div onClick={handleStatusClick}>
						{ getStatusIcon() }
					</div>
					<Menu
						aria-labelledby="node-manage"
						anchorEl={anchorEl}
						open={open}
						onClose={() => {
							handleClose()
						}
						}
					>
						{getMenuItems()}
					</Menu>
				</div>
			)
		} else {
			return (
				<DeleteIcon onClick={() => onNodeRemove(node)}/>
			)
		}
	}

	return (
		<Box className={'workflow-container-inner'} sx={{width: 180, padding: 1, borderRadius: 1, boxShadow: 1, id: node.id}}>
			{getHeaderView()}
			{getTipsView()}
			{getTimeDetails()}
			{getNodeShortCutView()}
		</Box>
	);
}
