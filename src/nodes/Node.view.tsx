import * as React from "react";
import Box from "@mui/material/Box";
import {Button, Divider, Menu, MenuItem, Typography} from "@mui/material";
import {NodeActionEnum, NodeStatusEnum} from "./NodeStatus.enum";
import {NodeModel} from "./Node.model";
import {TimeUtils} from "../utils/Time.utils";

interface NodeProps {
	node: NodeModel,
	couldUpdate: boolean,
	onNodeUpdate: () => void
}

export default function NodeView(nodeViewProps: NodeProps) {

	const {node, couldUpdate, onNodeUpdate} = nodeViewProps
	const [showTips, setShowTips] = React.useState(false)
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLButtonElement>(null);
	const open = Boolean(anchorEl);

	const handleStatusClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		if (!couldUpdate) {
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
		if (!couldUpdate) {
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

	const getTipsButton = () => {
		if (showTips) {
			return "收起"
		} else {
			return "展开"
		}
	}

	const getTipsContent = () => {
		let tips = []
		if (showTips) {
			for (const tip of node.tips.content) {
				tips.push(
					<Typography sx={{fontSize: 14}}>
						{'- ' + tip}
					</Typography>
				)
			}
		}
		return tips;
	}

	const getTimeDetails = () => {
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

	return (
		<Box sx={{width: 180, bgcolor: 'background.paper', padding: 1, borderRadius: 1, boxShadow: 1, id: node.id}}>
			<Box sx={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'space-between',
				marginBottom: 1
			}}>
				<Typography sx={{fontSize: 14, fontWeight: 600}}>{node.title}</Typography>
				<Box sx={{backgroundColor: getColorFromNodeStatus(), paddingX: 1, borderRadius: 1}}>
					<Typography onClick={handleStatusClick} sx={{fontSize: 14, fontWeight: 600, color:'white'}}>{node.status}</Typography>
				</Box>

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
					<Typography sx={{fontSize: 14, fontWeight: '600'}}>{node.tips.summary}</Typography>
					<Typography sx={{fontSize: 14, minWidth: 40, fontWeight: '600', color: "#6c6c6c"}} onClick={()=>{setShowTips(!showTips)}}>{getTipsButton()}</Typography>
				</Box>
				<Box>
					<Typography sx={{fontSize: 14}}>
						{getTipsContent()}
					</Typography>
				</Box>
			</Box>
			<Divider sx={{marginY: '1px'}}/>
			<Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
				{getTimeDetails()}
			</Box>
		</Box>
	);
}
