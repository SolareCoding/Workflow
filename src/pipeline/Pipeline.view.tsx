import * as React from "react";
import Box from "@mui/material/Box";
import {Stack, Typography,} from "@mui/material";
import SectionView from "./Section.view";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import {PipelineModel, PipelineNodeModel} from "./Pipeline.model";
import {NodeStatusEnum} from "../nodes/NodeStatus.enum";
import NodeView from "../nodes/Node.view";
import PipelineColors from "../common/Pipeline.colors";

export interface PipelineProps {
	data: PipelineModel
	onPipelineUpdate: () => void;
}

/**
 * 单条流水线的View
 * @param props
 * @constructor
 */
export default function PipelineView(props: PipelineProps) {

	const pipeline = props.data
	const sections = pipeline.sections
	const onPipelineUpdate = props.onPipelineUpdate

	const getDividerView = () => {
		return(<KeyboardDoubleArrowRightIcon />)
	}

	const getColor = () => {
		return PipelineColors.COLOR_MAP[pipeline.status]
	}

	const getTitle = () => {
		return <Typography sx={{fontSize: 20, fontWeight: 600, marginBottom: 1, textAlign: 'center'}}>{'任务: ' + props.data.title}</Typography>
	}

	const getSubTitle = () => {
		if (!pipeline.isTemplate) {
			return <Typography sx={{fontSize: 18, color: getColor(), fontWeight: 600, marginBottom: 1, textAlign: 'center'}}>{'工作流: ' + props.data.templateTitle}</Typography>
		}
		return null
	}

	const getSectionViews = () => {
		let sectionViews = []
		for (let i = 0; i < sections.length; i++) {
			let couldUpdate = i == 0 ? true : sections[i - 1].status == NodeStatusEnum.DONE
			sectionViews.push(<SectionView data={sections[i]} couldUpdate={couldUpdate} onSectionUpdate = {onSectionUpdate}/>)
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
		onPipelineUpdate()
	}

	/**
	 * 更新所有Pipelines中的对应节点
	 */
	return (
		<Box sx={{overflow: 'scroll', margin: 3}}>
			{getTitle()}
			{getSubTitle()}
			<Stack spacing={1} sx={{alignItems: 'center'}} direction='row' divider={getDividerView()}>
				{getSectionViews()}
			</Stack>
		</Box>
	);
}
