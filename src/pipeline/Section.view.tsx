import * as React from "react";
import {useContext, useState} from "react";
import NodeView from "../nodes/Node.view";
import {Stack, Typography} from "@mui/material";
import {PipelineModel, SectionModel} from "./Pipeline.model";
import {NodeStatusEnum} from "../nodes/NodeStatus.enum";
import Box from "@mui/material/Box";
import {NodeModel} from "../nodes/Node.model";
import {AddCircle} from "@mui/icons-material";
import {WorkPanelContext} from "../workpanel/WorkPanel.view";
import {UpdateMode} from "../workpanel/WorkPanel.controller";
import DeleteIcon from "@mui/icons-material/Delete";


export interface SectionProps {
	pipeline: PipelineModel
	section: SectionModel
	couldUpdate: boolean
	editorMode?: boolean
}

/**
 * A section in the pipeline contains multiple nodes.
 * It manages the name, delete of the section.
 * And it provides the entrance to add new nodes.
 */
export default function SectionView(props: SectionProps) {

	const { pipeline, section, couldUpdate, editorMode} = props
	const nodes = section.nodes

	const [title, setTitle] = useState(section.title)
	const workPanelController = useContext(WorkPanelContext)

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

	const onRemoveSection = () => {
		workPanelController.updateSection(pipeline, section, UpdateMode.DELETE)
	}

	const onNodeRemoved = (node: NodeModel) => {}

	const onNodeUpdate = () => {
		// nothing changed, return immediately
		if (section.status == getSectionStatus()) {
			return
		}
		const newSection = Object.assign(section, {status: getSectionStatus()})
		workPanelController.updateSection(pipeline, newSection)
	}

	const handleSectionNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(event.target.value)
		props.section.title = event.target.value
		const newSection = Object.assign({}, section, {title: event.target.value})
		workPanelController.updateSection(pipeline, newSection)
	};

	const getSectionTitleView = () => {
		if (!editorMode) {
			return <Typography sx={{fontSize: 16, maxWidth: 120, fontWeight: 600}}>{section.title}</Typography>
		} else {
			return <input style={{fontSize: 16, maxWidth: 120, fontWeight: 600}} id="template-simple" value={title} onChange={handleSectionNameChange} />
		}
	}

	const getActionView = () => {
		if (!editorMode) {
			return null;
		}
		return <Box onClick={() => onRemoveSection()}>
			<DeleteIcon/>
		</Box>
	}

	const getNodeViews = () => {
		let nodeViews = []
		const nodeKey = editorMode ? 'editorNode-' : 'node-';
		nodeViews.push(getAddNodeView(0))
		for (let i = 0; i <nodes.length; i++) {
			nodeViews.push(<NodeView key={nodeKey + nodes[i].id} node={nodes[i]} couldUpdate={couldUpdate} editorMode={editorMode} onNodeUpdate={onNodeUpdate} onNodeRemove={onNodeRemoved}/>)
			nodeViews.push(getAddNodeView(i + 1))
		}
		return nodeViews;
	}

	const getAddNodeView = (index: number) => {
		if (!editorMode) return false
		return <Box key={'addNode-' + index} onClick={() => {
			insertNewNode(index)
		}}>
			<AddCircle/>
		</Box>
	}

	const insertNewNode = (index: number) => {
		nodes.splice(index, 0, NodeModel.newInstance())
		const newSection = Object.assign({}, section)
		workPanelController.updateSection(pipeline, newSection)
	}

	return (
		<Box className={'workflow-container-outer'} sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: 1, borderRadius: 1}}>
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
