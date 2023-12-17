import * as React from "react";
import {useContext, useEffect, useState} from "react";
import Box from "@mui/material/Box";
import {Typography,} from "@mui/material";
import SectionView from "./Section.view";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import {newSectionInstance, PipelineModel, SectionModel} from "./Pipeline.model";
import {NodeStatusEnum} from "../nodes/NodeStatus.enum";
import PipelineColors from "../common/Pipeline.colors";
import {AddCircle} from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import {useAppDispatch, useAppSelector} from "../repository/hooks";
import {selectWorkflow, UpdateMode, updatePipeline, updateSection} from "../workflow/Workflow.slice";

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

	const dispatch = useAppDispatch()
	const { pipeline } = props
	const { sections, isTemplate } = pipeline
	const [title, setTitle] = useState(pipeline.title)

	useEffect(() => {
		setTitle(pipeline.title)
		updatePipelineStatus()
	}, [pipeline])

	const getColor = () => {
		return PipelineColors.COLOR_MAP[pipeline.status]
	}

	const handlePipelineNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(event.target.value)
		const newPipeline = Object.assign({}, pipeline, {title: event.target.value})
		dispatch(updatePipeline({
			pipeline: newPipeline,
			isEditMode: isTemplate,
			updateMode: UpdateMode.UPDATE
		}))
	}

	const handlePipelineDeleted = () => {
		dispatch(updatePipeline({
			pipeline: pipeline,
			isEditMode: isTemplate,
			updateMode: UpdateMode.DELETE
		}))
	}

	const getActionView = () => {
		return <Box onClick={handlePipelineDeleted}>
			<DeleteIcon/>
		</Box>
	}

	const getTitleView = () => {
		if (!isTemplate) {
			return <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
				<Typography sx={{fontSize: 20, fontWeight: 600, textAlign: 'center'}}>{'任务: ' + props.pipeline.title}</Typography>
				{ getActionView() }
			</Box>
		} else {
			return <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
				<input className={'workflow-input'} style={{fontSize: 20, fontWeight: 600}} id="template-simple" value={title} onChange={handlePipelineNameChange} />
				{ getActionView() }
			</Box>
		}
	}

	const getSubTitleView = () => {
		if (!isTemplate) {
			return <Typography sx={{fontSize: 18, color: getColor(), fontWeight: 600, marginTop: 2, textAlign: 'center'}}>{'工作流: ' + props.pipeline.templateTitle}</Typography>
		} else {
			return <Typography sx={{fontSize: 18, fontWeight: 600, marginTop: 2, textAlign: 'center'}}>{'编辑工作流模板'}</Typography>
		}
	}

	const getDividerView = (index: number, end?: number) => {
		if (!isTemplate) {
			if (index === 0 || index == end)
				return false
			return <KeyboardDoubleArrowRightIcon style={{margin: '10px 10px 10px 10px'}}/>
		}
		return <Box key = {'addCircle-' + index} onClick={() => {insertNewSection(index)}}>
			<AddCircle style={{margin: '10px 10px 10px 10px'}}/>
		</Box>
	}

	const insertNewSection = (index: number) => {
		dispatch(updateSection({
			pipeline: pipeline,
			section: newSectionInstance(),
			isEditMode: isTemplate,
			updateMode: UpdateMode.ADD,
			index: index
		}))
	}

	const getSectionViews = () => {
		let sectionViews = []
		sectionViews.push(getDividerView(0))
		for (let i = 0; i < sections.length; i++) {
			let couldUpdate = i == 0 ? true : sections[i - 1].status == NodeStatusEnum.DONE
			sectionViews.push(<SectionView key={'section-' + sections[i].id} pipeline={pipeline} section={sections[i]} couldUpdate={couldUpdate} editorMode={isTemplate}/>)
			sectionViews.push(getDividerView(i + 1, sections.length))
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
	 * 监听Pipeline，如果每个section均done，则pipeline应该为done
	 */
	const updatePipelineStatus = () => {
		if (getPipelineStatus() == pipeline.status) {
			return
		}
		dispatch(updatePipeline({
			pipeline: Object.assign({}, pipeline, {status: getPipelineStatus()}),
			isEditMode: isTemplate,
			updateMode: UpdateMode.UPDATE
		}))
	}

	/**
	 * 更新所有Pipelines中的对应节点
	 */
	return (
		<div style={{display: 'flex', width: '100%', alignItems:'center', justifyContent: 'center', height: '100%', paddingTop: '50px', flexDirection: 'column', minHeight: '1px', minWidth: 400,}}>
			{getTitleView()}
			{getSubTitleView()}
			<div style={{width: '100%',height: '100%', overflow: 'scroll', marginTop: '10px'}}>
				<div style={{display: 'inline-flex', flexDirection: 'row', alignItems: 'flex-start', margin: '0px 50px 50px 50px'}}>
					{getSectionViews()}
				</div>
			</div>
		</div>
	);
}
