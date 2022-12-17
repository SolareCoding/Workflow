import * as React from "react";
import Box from "@mui/material/Box";
import {Button, Divider, Input, Menu, MenuItem, Typography} from "@mui/material";
import {NodeActionEnum, NodeStatusEnum} from "./NodeStatus.enum";
import {NodeModel} from "./Node.model";
import {TimeUtils} from "../utils/Time.utils";
import {useState} from "react";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";

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
	const [anchorEl, setAnchorEl] = useState<null | HTMLButtonElement>(null);
	const open = Boolean(anchorEl);
	const [title, setTitle] = useState(node.title)
	const [tipSummary, setTipSummary] = useState(node.tips.summary)
	const [tipContent, setTipContent] = useState(node.tips.content || '请输入Tips')

	const handleStatusClick = (event: React.MouseEvent<HTMLButtonElement>) => {
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

	const getMenuItems = () => {
		let items = []
		switch (node.status) {
			case NodeStatusEnum.PENDING:
				items.push([
					<MenuItem onClick={() => {
						handleClose(NodeActionEnum.WORK)
					}}>{NodeActionEnum.WORK}</MenuItem>,
				])
				break;
			case NodeStatusEnum.WORKING:
				items.push([
					<MenuItem onClick={() => {
						handleClose(NodeActionEnum.CANCEL)
					}}>{NodeActionEnum.CANCEL}</MenuItem>,
					<MenuItem onClick={() => {
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
			return "收起"
		} else {
			return "展开"
		}
	}

	const getTipSummary = () => {
		if (!editorMode) {
			return <Typography sx={{fontSize: 14, fontWeight: '600'}}>{node.tips.summary}</Typography>
		} else {
			return <Input sx={{fontSize: 14, maxWidth: 120, fontWeight: 600, color: 'white'}} id="template-simple" value={tipSummary} onChange={handleNodeTipSummaryChange} />
		}
	}

	const getTipsContent = () => {
		if (!editorMode) {
			if (showTips) {
				return <Typography sx={{fontSize: 14}}>{tipContent}</Typography>
			} else {
				return false
			}
		}
		else {
			return <Input sx={{fontSize: 14, color: 'white'}} id="template-simple" value={tipContent} onChange={handleNodeTipContentChange} />
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
					<Typography sx={{fontSize: 14}}>
						{'Finish: ' + TimeUtils.getDateTimeStr(node.finishTime)}
					</Typography>
				)
				details.push(
					<Typography sx={{fontSize: 14}}>
						{'Start: ' + TimeUtils.getDateTimeStr(node.startTime)}
					</Typography>
				)
				break;
			case NodeStatusEnum.WORKING:
				details.push(
					<Typography sx={{fontSize: 14}}>
						{'Start: ' + TimeUtils.getDateTimeStr(node.startTime)}
					</Typography>
				)
				break;
			case NodeStatusEnum.PENDING:
				break;
		}
		return details
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

	const getTitleView = () => {
		if (!editorMode) {
			return <Typography sx={{fontSize: 14, fontWeight: 600}}>{title}</Typography>
		} else {
			return <Input sx={{fontSize: 14, maxWidth: 120, fontWeight: 600, color: 'white'}} id="template-simple" value={title} onChange={handleNodeNameChange} />
		}
	}

	const getActionView = () => {
		if (!editorMode) {
			return (
				<Box sx={{backgroundColor: getColorFromNodeStatus(), paddingX: 1, borderRadius: 1}}>
					<Typography onClick={handleStatusClick} sx={{fontSize: 14, fontWeight: 600, color:'white'}}>{node.status}</Typography>
				</Box>
			)
		} else {
			return (
				<Box sx={{paddingX: 1, borderRadius: 1}} onClick={() => onNodeRemove(node)}>
					<DeleteForeverOutlinedIcon/>
				</Box>
			)
		}
	}

	return (
		<Box sx={{width: 180, bgcolor: 'background.paper', padding: 1, borderRadius: 1, boxShadow: 1, id: node.id}}>
			<Box sx={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'space-between',
				marginBottom: 1
			}}>
				{getTitleView()}
				{getActionView()}
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
			</Box>
			<Divider sx={{marginY: '1px'}}/>
			<Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
				<Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
					{getTipSummary()}
					<Typography sx={{fontSize: 14, minWidth: 40, fontWeight: '600', color: "#6c6c6c"}} onClick={()=>{setShowTips(!showTips)}}>{getTipsButton()}</Typography>
				</Box>
				<Box>
					{getTipsContent()}
				</Box>
			</Box>
			<Divider sx={{marginY: '1px'}}/>
			<Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
				{getTimeDetails()}
			</Box>
		</Box>
	);
}
