import * as React from "react";
import Box from "@mui/material/Box";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary, Button,
	Card,
	CardActions,
	CardContent,
	CardHeader,
	Chip,
	IconButton,
	Menu,
	MenuItem,
	Typography
} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {NodeActionEnum, NodeStatusEnum} from "./NodeStatus.enum";
import {NodeModel} from "./Node.model";
import {TimeUtils} from "../utils/Time.utils";

interface NodeProps {
	data: NodeModel
}

export default function NodeView(node: NodeProps) {

	const [nodeModel, setNodeModel] = React.useState(node.data)
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLButtonElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = (action?: NodeActionEnum) => {
		setAnchorEl(null);
		let newModel = nodeModel
		if (!action)
			return
		switch (action) {
			case NodeActionEnum.WORK:
				newModel.status = NodeStatusEnum.WORKING
				newModel.startTime = Date.now()
				break
			case NodeActionEnum.CANCEL:
				newModel.status = NodeStatusEnum.PENDING
				newModel.startTime = 0
				break
			case NodeActionEnum.FINISH:
				newModel.status = NodeStatusEnum.DONE
				newModel.finishTime = Date.now()
		}
		setNodeModel(newModel)
	};

	const getColorFromNodeStatus = (status: NodeStatusEnum) => {
		switch (status) {
			case NodeStatusEnum.PENDING:
				return 'secondary'
			case NodeStatusEnum.WORKING:
				return 'primary'
			case NodeStatusEnum.DONE:
				return 'success'
		}
	};

	const getNodeTime = (nodeModel: NodeModel) => {
		switch (nodeModel.status) {
			case NodeStatusEnum.PENDING:
				return ''
			case NodeStatusEnum.WORKING:
				return 'since ' + TimeUtils.getDateTimeStr(nodeModel.startTime)
			case NodeStatusEnum.DONE:
				return 'at ' + TimeUtils.getDateTimeStr(nodeModel.finishTime)
		}
	}

	const getMenuItems = (nodeModel: NodeModel) => {
		let items = []
		switch (nodeModel.status) {
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

	return (
		<Card sx={{width: 200}}>
			<CardHeader
				sx={{paddingBottom: 0}}
				action={
					<Box>
						<Button
							id="node-manage"
							onClick={handleClick}
						>
							<MoreVertIcon/>
						</Button>
						<Menu
							aria-labelledby="node-manage"
							anchorEl={anchorEl}
							open={open}
							onClose={() => {
								handleClose()
							}
							}
						>
							{getMenuItems(nodeModel)}
						</Menu>
					</Box>
				}
				title={nodeModel.title}
				titleTypographyProps={{variant: 'h6'}}
			/>
			<CardContent sx={{padding: 0}}>
				<Accordion elevation={0}>
					<AccordionSummary
						expandIcon={<ExpandMoreIcon/>}
						aria-controls="panel1a-content"
						id="panel1a-header"
					>
						<Typography>{nodeModel.tips.summary}</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Typography>
							{nodeModel.tips.content}
						</Typography>
					</AccordionDetails>
				</Accordion>
			</CardContent>
			<CardActions sx={{justifyContent: 'space-between'}}>
				<Chip
					id="chip"
					label={nodeModel.status}
					color={getColorFromNodeStatus(nodeModel.status)}
				/>
				<Typography sx={{fontSize: 14}}>
					{getNodeTime(nodeModel)}
				</Typography>
			</CardActions>
		</Card>
	);
}
