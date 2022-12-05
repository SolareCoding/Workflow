import * as React from "react";
import {useState} from "react";
import NodeView from "../nodes/Node.view";
import {Stack, Typography} from "@mui/material";
import {PipelineNodeModel} from "./Pipeline.model";
import {NodeStatusEnum} from "../nodes/NodeStatus.enum";
import Box from "@mui/material/Box";
import {NodeModel} from "../nodes/Node.model";
import PipelineColors from "../common/Pipeline.colors";


export interface PipelineNodeProps {
	data: PipelineNodeModel
	couldUpdate: boolean
	onSectionUpdate: () => void
}

/**
 * One node in pipeline may consist of multiple nodes
 * @constructor
 */
export default function SectionView(props: PipelineNodeProps) {

	const { couldUpdate, onSectionUpdate } = props
	const section = props.data
	const nodes = section.nodes

	const [bgColor, setBgColor] = useState(PipelineColors.COLOR_MAP[section.status])
	const [flag, setFlag] = useState(false)

	const isPending = (node: NodeModel) => node.status == NodeStatusEnum.PENDING
	const isDone = (node: NodeModel) => node.status == NodeStatusEnum.DONE

	const getSectionStatus = () => {
		if (nodes.every(isPending)) {
			return NodeStatusEnum.PENDING
		} else if (nodes.every(isDone)) {
			return NodeStatusEnum.DONE
		} else {
			return NodeStatusEnum.WORKING
		}
	}

	const onNodeUpdate = () => {
		let status: NodeStatusEnum = getSectionStatus()
		section.status = status
		setBgColor(PipelineColors.COLOR_MAP[status])
		setFlag(!flag)
		onSectionUpdate()
	}

	const getNodes = () => {
		let nodeViews = []
		for (let i = 0; i <nodes.length; i++) {
			nodeViews.push(<NodeView node={nodes[i]} couldUpdate={couldUpdate} onNodeUpdate={onNodeUpdate}/>)
		}
		return nodeViews;
	}

	return (
		<Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: 1, backgroundColor: bgColor, borderRadius: 1}}>
			<Typography sx={{fontSize: 16, maxWidth: 120, fontWeight: 600, color: 'white'}}>{props.data.title}</Typography>
			<Stack spacing={1} sx={{alignItems: 'center'}}>
				{getNodes()}
			</Stack>
		</Box>
	);
}
