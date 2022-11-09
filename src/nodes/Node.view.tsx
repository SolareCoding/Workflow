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
	Chip, Container,
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
import {useContext} from "react";
import {WorkPanelContext} from "../workpanel/WorkPanel.view";
import {PipelineContext} from "../pipeline/Pipeline.context";
import {PLContext} from "../pipeline/Pipeline.view";

interface NodeProps {
	data: NodeModel
}

export default function NodeView(node: NodeProps) {

	const context: PipelineContext = useContext(PLContext)

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
		context.updateNode(newModel)
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
		<Box sx={{width: 180, elevation: 1, backgroundColor: 'white', padding: 1, borderRadius: 1}}>
				<Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 1}}>
					<Typography sx={{fontSize: 16, maxWidth: 120, fontWeight: 600}}>{nodeModel.title}</Typography>
					<Button
						id="node-manage"
						sx={{width: 20}}
						onClick={handleClick}
					>
						<MoreVertIcon sx={{width: 20}}/>
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
				<Accordion elevation={0} sx={{margin: 0}}>
					<AccordionSummary
						expandIcon={<ExpandMoreIcon/>}
						aria-controls="panel1a-content"
						id="panel1a-header"
						sx={{padding: 0}}
					>
						<Typography sx={{fontSize: 14}}>{nodeModel.tips.summary}</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Typography sx={{fontSize: 14}}>
							{nodeModel.tips.content}
						</Typography>
					</AccordionDetails>
				</Accordion>
				<Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
					<Chip
						id="chip"
						label={nodeModel.status}
						color={getColorFromNodeStatus(nodeModel.status)}
					/>
					<Typography sx={{fontSize: 14}}>
						{getNodeTime(nodeModel)}
					</Typography>
				</Box>
			</Box>
	);
}
