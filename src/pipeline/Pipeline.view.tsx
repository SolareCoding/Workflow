import * as React from "react";
import {useContext, useEffect, useState} from "react";
import Box from "@mui/material/Box";
import {Stack, Typography,} from "@mui/material";
import SectionView from "./Section.view";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import {PipelineModel, SectionModel} from "./Pipeline.model";
import {NodeStatusEnum} from "../nodes/NodeStatus.enum";
import PipelineColors from "../common/Pipeline.colors";
import {AddCircle} from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import {WorkPanelContext} from "../workpanel/WorkPanel.view";
import {UpdateMode} from "../workpanel/WorkPanel.controller";

export interface PipelineProps {
	pipeline: PipelineModel
}

/**
 * 单条流水线的View
 * @param props
 * @constructor
 * 工作流场景下可以被删除，
 * 模板场景下可以修改标题和删除Pipeline,增加新的Section
 */
export default function PipelineView(props: PipelineProps) {

	const { pipeline } = props
	const { sections, isTemplate } = pipeline
	const workPanelController = useContext(WorkPanelContext)

	const [title, setTitle] = useState(pipeline.title)
	useEffect(() => setTitle(pipeline.title), [pipeline])

	const getDividerView = () => {
		return !isTemplate ? <KeyboardDoubleArrowRightIcon/> : null
	}

	const getColor = () => {
		return PipelineColors.COLOR_MAP[pipeline.status]
	}

	const handlePipelineNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(event.target.value)
		const newPipeline = Object.assign({}, pipeline, {title: event.target.value})
		workPanelController.updatePipeline(newPipeline)
	}

	const handlePipelineDeleted = () => {
		workPanelController.updatePipeline(pipeline, UpdateMode.DELETE)
	}

	const getActionView = () => {
		return <Box onClick={handlePipelineDeleted}>
			<DeleteIcon/>
		</Box>
	}

	const getTitleView = () => {
		if (!isTemplate) {
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
		if (!isTemplate) {
			return <Typography sx={{fontSize: 18, color: getColor(), fontWeight: 600, marginBottom: 1, textAlign: 'center'}}>{'工作流: ' + props.pipeline.templateTitle}</Typography>
		} else {
			return <Typography sx={{fontSize: 18, fontWeight: 600, marginBottom: 1, textAlign: 'center'}}>{'编辑工作流模板'}</Typography>
		}
	}

	const getAddSectionView = (index: number) => {
		if (!isTemplate) return false
		return <Box key = {'addCircle-' + index} onClick={() => {insertNewSection(index)}}>
			<AddCircle/>
		</Box>
	}

	const insertNewSection = (index: number) => {
		sections.splice(index, 0, SectionModel.newInstance())
		const newPipeline = Object.assign({}, pipeline)
		workPanelController.updatePipeline(newPipeline)
	}

	const getSectionViews = () => {
		let sectionViews = []
		sectionViews.push(getAddSectionView(0))
		for (let i = 0; i < sections.length; i++) {
			let couldUpdate = i == 0 ? true : sections[i - 1].status == NodeStatusEnum.DONE
			sectionViews.push(<SectionView key={'section-' + sections[i].id} pipeline={pipeline} section={sections[i]} couldUpdate={couldUpdate} editorMode={isTemplate}/>)
			sectionViews.push(getAddSectionView(i + 1))
		}
		return sectionViews
	}

	const isPending = (section: SectionModel) => section.status == NodeStatusEnum.PENDING
	const isDone = (section: SectionModel) => section.status == NodeStatusEnum.DONE

	const getPipelineStatus = () => {
		if (sections.every(isPending)) {
			return  NodeStatusEnum.PENDING
		} else if (sections.every(isDone)) {
			return NodeStatusEnum.DONE
		} else {
			return NodeStatusEnum.WORKING
		}
	}

	/**
	 * 更新所有Pipelines中的对应节点
	 */
	return (
		<div >
			{getTitleView()}
			{getSubTitleView()}
			<Stack spacing={1} sx={{alignItems: 'center'}} direction='row' divider={getDividerView()}>
				{getSectionViews()}
			</Stack>
		</div>
	);
}
