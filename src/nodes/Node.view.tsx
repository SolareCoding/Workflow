import * as React from "react";
import Box from "@mui/material/Box";
import {
	Accordion, AccordionDetails, AccordionSummary,
	Button,
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
import {NodeStatusEnum} from "./NodeStatus.enum";

export default function NodeView() {

	const [nodeStatus, setNodeStatus] = React.useState(NodeStatusEnum.PENDING);
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
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

	return (
			<Card sx={{minWidth: 250, maxWidth: 300}}>
				<CardHeader
					sx={{paddingBottom: 0}}
					action={
						<Button aria-label="settings" disableElevation={true}>
							<MoreVertIcon/>
						</Button>
					}
					title="节点名"
					titleTypographyProps={{ variant: 'h6' }}
				/>
				<CardContent sx={{ padding: 1}}>
					<Accordion>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel1a-content"
							id="panel1a-header"
						>
							<Typography>吃饭</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<Typography>
								吃饭要吃饱
							</Typography>
						</AccordionDetails>
					</Accordion>
					<Accordion>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel1a-content"
							id="panel1a-header"
						>
							<Typography>吃饭</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<Typography>
								吃饭要吃饱
							</Typography>
						</AccordionDetails>
					</Accordion>
					<Accordion>
						<AccordionSummary
							expandIcon={<ExpandMoreIcon />}
							aria-controls="panel1a-content"
							id="panel1a-header"
						>
							<Typography>吃饭</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<Typography>
								吃饭要吃饱
							</Typography>
						</AccordionDetails>
					</Accordion>
				</CardContent>
				<CardActions sx={{justifyContent: 'space-between'}}>
					<Chip
						id="chip"
						label={nodeStatus}
						color={getColorFromNodeStatus(nodeStatus)}
						onClick={handleClick}
					/>
					<Menu
						id="basic-menu"
						anchorEl={anchorEl}
						open={open}
						onClose={handleClose}
						MenuListProps={{
							'aria-labelledby': 'basic-button',
						}}
					>
						<MenuItem onClick={handleClose}>Start</MenuItem>
						<MenuItem onClick={handleClose}>Cancel</MenuItem>
					</Menu>
					<Typography sx={{marginLeft: 1}}>
						开始时间: 19:30
					</Typography>
				</CardActions>
			</Card>
	);
}
