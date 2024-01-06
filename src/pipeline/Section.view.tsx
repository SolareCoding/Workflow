import * as React from "react";
import {useEffect, useState} from "react";
import NodeView from "../nodes/Node.view";
import {Stack, Typography} from "@mui/material";
import {PipelineModel, SectionModel} from "./Pipeline.model";
import {NodeStatusEnum} from "../nodes/NodeStatus.enum";
import Box from "@mui/material/Box";
import {newNodeInstance, NodeModel} from "../nodes/Node.model";
import {AddCircle} from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import {useAppDispatch} from "../repository/hooks";
import {UpdateMode, updateNode, updateSection} from "../workflow/Workflow.slice";


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

	const dispatch = useAppDispatch()
	const { pipeline, section, couldUpdate, editorMode} = props
	const nodes = section.nodes
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

	useEffect(() => {
		if (section.status == getSectionStatus()) {
			return
		}
		dispatch(updateSection({
			pipeline: pipeline,
			section: Object.assign({}, section, {status: getSectionStatus()}),
			isEditMode: editorMode || false,
			updateMode: UpdateMode.UPDATE
		}))
	}, [section])

	const onRemoveSection = () => {
		dispatch(updateSection({
			pipeline: pipeline,
			section: section,
			updateMode: UpdateMode.DELETE,
			isEditMode: editorMode || false
		}))
	}

	const onInsertNewNode = (index: number) => {
		dispatch(updateNode({
			pipeline: pipeline,
			section: section,
			updateMode: UpdateMode.ADD,
			isEditMode: editorMode || false,
			node: newNodeInstance(),
			index: index
		}))
	}

	const handleSectionNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(event.target.value)
		props.section.title = event.target.value
		const newSection = Object.assign({}, section, {title: event.target.value})
		dispatch(updateSection({
			pipeline: pipeline,
			isEditMode: editorMode || false,
			section: newSection,
			updateMode: UpdateMode.UPDATE
		}))
	};

	const getSectionTitleView = () => {
		if (!editorMode) {
			return <Typography sx={{fontSize: 16, width: 150, fontWeight: 600}}>{section.title}</Typography>
		} else {
			return <input className={'workflow-input'} style={{fontSize: 16, width: 150, fontWeight: 600}} id="template-simple" value={title} onChange={handleSectionNameChange} />
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

	const getAddNodeView = (index: number) => {
		if (!editorMode) return null
		return <Box key={'addNode-' + index} onClick={() => {
			onInsertNewNode(index)
		}}>
			<AddCircle/>
		</Box>
	}

	const getNodeViews = () => {
		let nodeViews = []
		const nodeKey = editorMode ? 'editorNode-' : 'node-';
		nodeViews.push(getAddNodeView(0))
		for (let i = 0; i <nodes.length; i++) {
			nodeViews.push(<NodeView key={nodeKey + nodes[i].id}
									 pipeline={pipeline}
									 section={section}
									 node={nodes[i]}
									 couldUpdate={couldUpdate}
									 editorMode={editorMode} />)
			nodeViews.push(getAddNodeView(i + 1))
		}
		return nodeViews;
	}

	return (
		<Box className={'workflow-container-outer'} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: 1, borderRadius: 1}}>
			<Box sx={{
				width: 180,
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
