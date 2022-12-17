import * as React from "react";
import {useEffect, useState} from "react";
import NodeView from "../nodes/Node.view";
import {Input, Stack, TextField, Typography} from "@mui/material";
import {PipelineNodeModel} from "./Pipeline.model";
import {NodeStatusEnum} from "../nodes/NodeStatus.enum";
import Box from "@mui/material/Box";
import {NodeModel} from "../nodes/Node.model";
import PipelineColors from "../common/Pipeline.colors";
import {AddCircle} from "@mui/icons-material";
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';


export interface PipelineNodeProps {
	data: PipelineNodeModel
	couldUpdate: boolean
	editorMode?: boolean
	onSectionUpdate: () => void
	onSectionRemove: (section: PipelineNodeModel) => void
}

/**
 * One node in pipeline may consist of multiple nodes
 * @constructor
 */
export default function SectionView(props: PipelineNodeProps) {

	const { couldUpdate, editorMode, onSectionUpdate, onSectionRemove } = props
	const section = props.data
	const nodes = section.nodes

	const [bgColor, setBgColor] = useState(PipelineColors.COLOR_MAP[section.status])
	useEffect(()=> setBgColor(PipelineColors.COLOR_MAP[section.status]))

	const [title, setTitle] = useState(section.title)

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
		onSectionUpdate()
	}

	const onNodeRemoved = (node: NodeModel) => {
		section.nodes.remove(node);
		onSectionUpdate()
	}

	const getAddNodeView = (index: number) => {
		if (!editorMode) return false
		return <Box sx={{
			display: 'flex',
			padding: 1,
			borderRadius: 1,
			alignItems: 'center',
			justifyContent: 'center'
		}} onClick={() => {
			insertNewSection(index)
		}}>
			<AddCircle/>
		</Box>
	}

	const insertNewSection = (index: number) => {
		nodes.splice(index, 0, NodeModel.newInstance())
		onSectionUpdate()
	}

	const handleSectionNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(event.target.value)
		props.data.title = event.target.value
		onSectionUpdate()
	};

	const getSectionTitleView = () => {
		if (!editorMode) {
			return <Typography sx={{fontSize: 16, maxWidth: 120, fontWeight: 600, color: 'white'}}>{title}</Typography>
		} else {
			return <Input sx={{fontSize: 16, maxWidth: 120, fontWeight: 600, color: 'white'}} id="template-simple" value={title} onChange={handleSectionNameChange} />
		}
	}

	const getActionView = () => {
		if (editorMode) {
			return <Box sx={{paddingX: 1, borderRadius: 1}} onClick={() => onSectionRemove(section)}>
				<DeleteForeverOutlinedIcon/>
			</Box>
		} else {
			return false
		}
	}

	const getNodeViews = () => {
		let nodeViews = []
		nodeViews.push(getAddNodeView(0))
		for (let i = 0; i <nodes.length; i++) {
			nodeViews.push(<NodeView node={nodes[i]} couldUpdate={couldUpdate} editorMode={editorMode} onNodeUpdate={onNodeUpdate} onNodeRemove={onNodeRemoved}/>)
			nodeViews.push(getAddNodeView(i + 1))
		}
		return nodeViews;
	}

	return (
		<Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: 1, backgroundColor: bgColor, borderRadius: 1}}>
			<Box sx={{
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				justifyContent: 'space-between',
				marginBottom: 1,
			}}>
				{getSectionTitleView()}
				{getActionView()}
			</Box>
			<Stack spacing={1} sx={{alignItems: 'center'}}>
				{getNodeViews()}
			</Stack>
		</Box>
	);
}
