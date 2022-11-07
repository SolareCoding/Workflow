import * as React from 'react';
import DnsIcon from '@mui/icons-material/Dns';
import DvrIcon from '@mui/icons-material/Dvr';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import Box from '@mui/material/Box';
import NodeManagerView from "../nodes/NodeManager.view";
import {
	Avatar,
	BottomNavigation,
	BottomNavigationAction, Button,
	CssBaseline,
	List,
	ListItem,
	ListItemAvatar, ListItemText, Paper
} from "@mui/material";
import {WorkPanelEnum} from "./WorkPanel.enum";
import PipelineNodeView from "../pipeline/PipelineNode.view";
import PipelineView from "../pipeline/Pipeline.view";

/**
 * This is the main interface of workflows.
 * 切换到底部导航方案
 * @author: solare@yeah.net
 */

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

export default function WorkPanelView() {

	const [panelIndex, setPanelIndex] = React.useState(WorkPanelEnum.PIPELINES);
	const ref = React.useRef<HTMLDivElement>(null);

	const getContent = (index: WorkPanelEnum) => {
		switch (index) {
			case WorkPanelEnum.NODES:
				return <NodeManagerView/>;
			case WorkPanelEnum.PIPELINES:
				return <PipelineView />;
			case WorkPanelEnum.WORKFLOWS:
				return null;
		}
	}

	return (
		<Box sx={{ pb: 7, overflow: 'scroll'}} ref={ref}>
			<CssBaseline />
			<Box sx={{alignItems: 'center'}}>
				{getContent(panelIndex)}
			</Box>
			<Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, paddingY: 1}} elevation={3}>
				<BottomNavigation
					showLabels
					value={panelIndex}
					onChange={(event, newValue) => {
						setPanelIndex(newValue);
					}}
				>
					<BottomNavigationAction sx={{paddingY: 3}} label="Nodes" icon={<DnsIcon />} />
					<BottomNavigationAction sx={{paddingY: 3}} label="Workflows" icon={<DvrIcon />} />
					<BottomNavigationAction sx={{paddingY: 3}} label="Pipelines" icon={<AccountTreeIcon />} />
				</BottomNavigation>
			</Paper>
		</Box>
	);
}
