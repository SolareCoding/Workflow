import * as React from "react";
import NodeView from "../nodes/Node.view";
import {Button, Card, CardContent, CardHeader, Menu, Stack, Typography,} from "@mui/material";
import {PipelineNodeModel} from "./Pipeline.model";
import {NodeStatusEnum} from "../nodes/NodeStatus.enum";
import MoreVertIcon from "@mui/icons-material/MoreVert";
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
		let nodes = []
		for (const node of props.data.nodes) {
			nodes.push(<NodeView data={node}/>)
		}
		return nodes;
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
			return '#c6d4e5'
		} else if (doneCount == props.data.nodes.length) {
			return '#bada55'
		} else if (workingCount > 0) {
			return '#eed5b7'
		} else {
			return '#c6d4e5'
		}
	}

	return (
		<Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: 1, backgroundColor: getBackgroundColor(), borderRadius: 1}}>
			<Typography sx={{fontSize: 20, maxWidth: 120, fontWeight: 600, marginBottom: 1}}>{props.data.title}</Typography>
			<Stack spacing={1} sx={{alignItems: 'center'}}>
				{getNodes()}
			</Stack>
		</Box>
	);
}
