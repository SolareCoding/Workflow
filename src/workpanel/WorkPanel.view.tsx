import * as React from 'react';
import DnsIcon from '@mui/icons-material/Dns';
import DvrIcon from '@mui/icons-material/Dvr';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import Box from '@mui/material/Box';
import NodeManagerView from "../nodes/NodeManager.view";
import {
	BottomNavigation,
	BottomNavigationAction,
	CssBaseline,
	Paper
} from "@mui/material";
import {WorkPanelEnum} from "./WorkPanel.enum";
import WorkflowView from "../workflow/Workflow.view";

/**
 * This is the main interface of workflows.
 * 切换到底部导航方案
 * @author: solare@yeah.net
 */

interface WorkPanelProps {
	data: string
	saveData: (dataStr: string)=>void
}

export const WorkPanelContext = React.createContext(0)

export default function WorkPanelView(props: WorkPanelProps) {

	const [data, setData] = React.useState(JSON.parse(props.data))
	const [panelIndex, setPanelIndex] = React.useState(WorkPanelEnum.WORKFLOWS);
	const ref = React.useRef<HTMLDivElement>(null);

	/**
	 * 异步保存
	 */
	const savePipelines = ()=> {
		return new Promise((resolve, reject) => {
			props.saveData(JSON.stringify(data))
		})
	}

	const workflowView = <WorkflowView workflows={data.workflows} templates={data.pipelines} saveData={savePipelines}/>
	const templateView = <WorkflowView workflows={data.workflows} templates={data.pipelines} saveData={savePipelines} editorMode={true}/>

	const getContent = (index: WorkPanelEnum) => {
		switch (index) {
			case WorkPanelEnum.NODES:
				return <NodeManagerView/>;
			case WorkPanelEnum.PIPELINES:
				return templateView;
			case WorkPanelEnum.WORKFLOWS:
				return workflowView;
		}
	}

	return (
		<WorkPanelContext.Provider value={data} >
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
		</WorkPanelContext.Provider>
	);
}
