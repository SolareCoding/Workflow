import * as React from "react";
import NodeView from "../nodes/Node.view";
import {Stack, Typography} from "@mui/material";
import {PipelineNodeModel} from "./Pipeline.model";
import {NodeStatusEnum} from "../nodes/NodeStatus.enum";
import Box from "@mui/material/Box";


export interface PipelineNodeProps {
	data: PipelineNodeModel
}

/**
 * One node in pipeline may consist of multiple nodes
 * @constructor
 */
export default function PipelineNodeView(props: PipelineNodeProps) {

	const getNodes = () => {
		let nodeViews = []
		for (const node of props.data.nodes) {
			nodeViews.push(<NodeView node={node}/>)
		}
		return nodeViews;
	}

	const getBackgroundColor = () => {
		// 全是pending
		let pendingCount = 0
		let workingCount = 0
		let doneCount = 0
		for (const node of props.data.nodes) {
			switch (node.status) {
				case NodeStatusEnum.PENDING:
					pendingCount ++;
					break;
				case NodeStatusEnum.WORKING:
					workingCount ++;
					break;
				case NodeStatusEnum.DONE:
					doneCount ++;
					break;
			}
		}
		if (pendingCount == props.data.nodes.length) {
			return '#7e57c2'
		} else if (doneCount == props.data.nodes.length) {
			return '#9ccc65'
		} else if (workingCount > 0) {
			return '#42a5f5'
		} else {
			return '#7e57c2'
		}
	}

	return (
		<Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: 1, backgroundColor: getBackgroundColor(), borderRadius: 1}}>
			<Typography sx={{fontSize: 16, maxWidth: 120, fontWeight: 600, color: 'white'}}>{props.data.title}</Typography>
			<Stack spacing={1} sx={{alignItems: 'center'}}>
				{getNodes()}
			</Stack>
		</Box>
	);
}
