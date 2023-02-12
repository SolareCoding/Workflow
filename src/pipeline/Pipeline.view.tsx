import * as React from "react";
import Box from "@mui/material/Box";
import {Input, Stack, Typography,} from "@mui/material";
import SectionView from "./Section.view";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import {PipelineModel, PipelineNodeModel} from "./Pipeline.model";
import {NodeStatusEnum} from "../nodes/NodeStatus.enum";
import PipelineColors from "../common/Pipeline.colors";
import {AddCircle} from "@mui/icons-material";
import {number} from "prop-types";
import {useState} from "react";
import DeleteIcon from "@mui/icons-material/Delete";

export interface PipelineProps {
	pipeline: PipelineModel
	editorMode?: boolean;
	onPipelineUpdate: () => void;
	onPipelineRemove: (pipeline: PipelineModel, editorMode?: boolean) => void;
}

/**
 * 单条流水线的View
 * @param props
 * @constructor
 */
export default function PipelineView(props: PipelineProps) {

	const { pipeline, editorMode, onPipelineUpdate, onPipelineRemove } = props
	const sections = pipeline.sections

	const [flag, setFlag] = useState(false)
	const [title, setTitle] = useState(pipeline.title)

	const getDividerView = () => {
		if (!editorMode) {
			return (<KeyboardDoubleArrowRightIcon/>)
		}
		return false
	}

	const getColor = () => {
		return PipelineColors.COLOR_MAP[pipeline.status]
	}

	const handlePipelineNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(event.target.value)
		pipeline.title = event.target.value
		onPipelineUpdate()
	}

	const getActionView = () => {
		return <Box onClick={() => onPipelineRemove(pipeline, editorMode)}>
			<DeleteIcon/>
		</Box>
	}

	const getTitleView = () => {
		if (!editorMode) {
			return <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', marginBottom: 1}}>
				<Typography sx={{fontSize: 20, fontWeight: 600, textAlign: 'center'}}>{'任务: ' + props.pipeline.title}</Typography>
				{ getActionView() }
			</Box>
		} else {
			return <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', marginBottom: 2}}>
				<input style={{fontSize: 20, fontWeight: 600}} id="template-simple" value={title} onChange={handlePipelineNameChange} />
				{ getActionView() }
			</Box>
		}
	}

	const getSubTitleView = () => {
		if (!pipeline.isTemplate) {
			return <Typography sx={{fontSize: 18, color: getColor(), fontWeight: 600, marginBottom: 1, textAlign: 'center'}}>{'工作流: ' + props.pipeline.templateTitle}</Typography>
		}
		return null
	}

	const getAddSectionView = (index: number) => {
		if (!props.editorMode) return false
		return <Box key = {'addCircle-' + index} onClick={() => {insertNewSection(index)}}>
			<AddCircle/>
		</Box>
	}

	const insertNewSection = (index: number) => {
		props.pipeline.sections.splice(index, 0, PipelineNodeModel.newInstance())
		onPipelineUpdate()
		setFlag(!flag)
	}

	const getSectionViews = () => {
		let sectionViews = []
		sectionViews.push(getAddSectionView(0))
		for (let i = 0; i < sections.length; i++) {
			let couldUpdate = i == 0 ? true : sections[i - 1].status == NodeStatusEnum.DONE
			sectionViews.push(<SectionView key={'section-' + i} data={sections[i]} couldUpdate={couldUpdate} editorMode={editorMode} onSectionUpdate = {onSectionUpdate} onSectionRemove={onSectionRemove}/>)
			sectionViews.push(getAddSectionView(i + 1))
		}
		return sectionViews
	}

	const isPending = (section: PipelineNodeModel) => section.status == NodeStatusEnum.PENDING
	const isDone = (section: PipelineNodeModel) => section.status == NodeStatusEnum.DONE

	const getPipelineStatus = () => {
		if (sections.every(isPending)) {
			return  NodeStatusEnum.PENDING
		} else if (sections.every(isDone)) {
			return NodeStatusEnum.DONE
		} else {
			return NodeStatusEnum.WORKING
		}
	}


	const onSectionUpdate = () => {
		pipeline.status = getPipelineStatus()
		setFlag(!flag)
		onPipelineUpdate()
	}

	const onSectionRemove = (section: PipelineNodeModel) => {
		pipeline.sections.remove(section)
		setFlag(!flag)
		onPipelineUpdate()
	}

	/**
	 * 更新所有Pipelines中的对应节点
	 */
	return (
		<Box sx={{overflow: 'scroll', margin: 3}}>
			{getTitleView()}
			{getSubTitleView()}
			<Stack spacing={1} sx={{alignItems: 'center'}} direction='row' divider={getDividerView()}>
				{getSectionViews()}
			</Stack>
		</Box>
	);
}
