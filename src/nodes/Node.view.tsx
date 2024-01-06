import * as React from "react";
import {useEffect, useState} from "react";
import Box from "@mui/material/Box";
import {Divider, Menu, MenuItem, Typography} from "@mui/material";
import {NodeActionEnum, NodeStatusEnum} from "./NodeStatus.enum";
import {NodeModel, NodeShortcut} from "./Node.model";
import {TimeUtils} from "../utils/Time.utils";
import DeleteIcon from '@mui/icons-material/Delete';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import RunCircleIcon from '@mui/icons-material/RunCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import {PipelineModel, SectionModel} from "../pipeline/Pipeline.model";
import NodeShortcutView from "./NodeShortcut.view";
import {useAppDispatch} from "../repository/hooks";
import {UpdateMode, updateNode} from "../workflow/Workflow.slice";

interface NodeProps {
	pipeline: PipelineModel,
	section: SectionModel,
	node: NodeModel,
	couldUpdate: boolean,
	editorMode?: boolean,
}

export default function NodeView(nodeViewProps: NodeProps) {

	const dispatch = useAppDispatch()

	const {pipeline, section, node, couldUpdate, editorMode} = nodeViewProps

	const [showTips, setShowTips] = useState(false)
	const [anchorEl, setAnchorEl] = useState<null | HTMLDivElement>(null);
	const [title, setTitle] = useState(node.title)
	const [tipSummary, setTipSummary] = useState(node.tips?.summary || '')
	const [tipContent, setTipContent] = useState(node.tips?.content || '')
	const [shortCut, setShortCut] = useState(node.shortcut)

	const open = Boolean(anchorEl);

	useEffect(() => {
		setTitle(node.title)
		setTipSummary(node.tips?.summary || '')
		setTipContent(node.tips?.content || '')
	}, [node])

	const handleStatusClick = (event: React.MouseEvent<HTMLDivElement>) => {
		if (!couldUpdate || editorMode) {
			return;
		}
		if (node.status == NodeStatusEnum.DONE) {
			return;
		}
		setAnchorEl(event.currentTarget);
	};

	const onNodeUpdate = (newNode: NodeModel) => {
		dispatch(updateNode({
			pipeline: pipeline,
			section: section,
			node: newNode,
			updateMode: UpdateMode.UPDATE,
			isEditMode: editorMode || false
		}))
	}

	const onNodeDelete = () => {
		dispatch(updateNode({
			pipeline: pipeline,
			section: section,
			node: node,
			updateMode: UpdateMode.DELETE,
			isEditMode: editorMode || false
		}))
	}

	const handleClose = (action?: NodeActionEnum) => {
		setAnchorEl(null);
		if (!action)
			return
		switch (action) {
			case NodeActionEnum.WORK:
				onNodeUpdate(Object.assign({}, node, {
					status: NodeStatusEnum.WORKING,
					startTime: Date.now()
				}))
				break
			case NodeActionEnum.CANCEL:
				onNodeUpdate(Object.assign({}, node, {
					status: NodeStatusEnum.PENDING,
					startTime: 0
				}))
				break
			case NodeActionEnum.FINISH:
				onNodeUpdate(Object.assign({}, node, {
					status: NodeStatusEnum.DONE,
					startTime: Date.now()
				}))
				break;
			case NodeActionEnum.FINISH_DIRECTLY:
				onNodeUpdate(Object.assign({}, node, {
					status: NodeStatusEnum.DONE,
					startTime: Date.now(),
					finishTime: Date.now()
				}))
				break;
		}
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
					<MenuItem sx={{fontSize: 13}} onClick={() => {
						handleClose(NodeActionEnum.FINISH_DIRECTLY)
					}}>{NodeActionEnum.FINISH_DIRECTLY}</MenuItem>,
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

	const clearTips = () => {
		setTipSummary('')
		setTipContent('')
	}

	const getTipsButton = () => {
		if (!editorMode) {
			if (showTips) {
				return <UnfoldLessIcon onClick={()=>{setShowTips(!showTips)}}/>
			} else {
				return <UnfoldMoreIcon onClick={()=>{setShowTips(!showTips)}}/>
			}
		}
		else {
			return <HighlightOffIcon onClick={() => clearTips()} />
		}
	}

	const getTipsView = () => {
		if (!editorMode && !node.tips.summary) {
			return false
		}
		return <div>
			<Divider sx={{marginY: '3px'}}/>
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
			return <input className={'workflow-input'} placeholder={'Tip summary'} style={{fontSize: 14, maxWidth: 130, fontWeight: 600}} id="tip-summary" value={tipSummary} onChange={handleNodeTipSummaryChange} />
		}
	}

	const getTipsContentView = () => {
		if (!editorMode) {
			if (!node.tips.content) {
				return null
			}
			if (showTips) {
				return <Typography sx={{fontSize: 12}}>{node.tips.content}</Typography>
			} else {
				return null
			}
		}
		else {
			return <textarea placeholder={'Tip content'} style={{fontSize: 12, marginTop: 3, minWidth: 160, maxWidth: 160}} id="tip-content" value={tipContent} onChange={handleNodeTipContentChange} />
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
			<Divider sx={{marginY: '3px'}}/>
			{ details }
		</div>
	}

	const handleNodeNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(event.target.value)
		const newNode = Object.assign({}, node, {title: event.target.value})
		dispatch(updateNode({
			pipeline: pipeline,
			section: section,
			node: newNode,
			updateMode: UpdateMode.UPDATE,
			isEditMode: editorMode || false
		}))
	}

	const handleNodeTipSummaryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTipSummary(event.target.value)
		onNodeUpdate(Object.assign({}, node, {
			tips: Object.assign({}, node.tips, {
				summary: event.target.value
			})
		}))
	}

	const handleNodeTipContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setTipContent(event.target.value)
		onNodeUpdate(Object.assign({}, node, {
			tips: Object.assign({}, node.tips, {
				content: event.target.value
			})
		}))
	}

	const handleNodeShortCutChange = (nodeShortCutModel: NodeShortcut) => {
		onNodeUpdate(Object.assign({}, node, {
			shortcut: nodeShortCutModel
		}))
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
			return <Typography sx={{fontSize: 14, fontWeight: 600}}>{node.title}</Typography>
		} else {
			return <input className={'workflow-input'} style={{fontSize: 14, maxWidth: 130, fontWeight: 600}} id="title" value={title} onChange={handleNodeNameChange} />
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
				<DeleteIcon onClick={() => onNodeDelete()}/>
			)
		}
	}

	return (
		<Box className={'workflow-container-inner'} sx={{width: 180, padding: 1, borderRadius: 1, boxShadow: 1, id: node.id}}>
			{getHeaderView()}
			{getTipsView()}
			{getTimeDetails()}
			<NodeShortcutView nodeID={node.id} editorMode={editorMode} nodeShortCutModel={node.shortcut} onUpdateShortCut={handleNodeShortCutChange} />
		</Box>
	);
}
