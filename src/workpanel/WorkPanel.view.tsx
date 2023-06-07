import * as React from 'react';
import {useEffect} from 'react';
import WorkflowView from "../workflow/Workflow.view";
import {PipelineModel, SectionModel} from "../pipeline/Pipeline.model";
import {UpdateMode, WorkPanelController} from "./WorkPanel.controller";
import {WorkPanelModel} from "./WorkPanel.model";
import {NodeModel} from "../nodes/Node.model";
import WorkflowPlugin from "../../main";
import {PomodoroModel} from "../pomodoro/Pomodoro.model";
import {SubjectModel} from "../subject/Subject.model";

/**
 * This is the main interface of workflows.
 * 切换到底部导航方案
 * @author: solare@yeah.net
 */

interface WorkPanelProps {
	data: string
	saveData: (dataStr: string)=>void
	plugin: WorkflowPlugin
}

const defaultController: WorkPanelController = {
	plugin : undefined,
	updatePipeline(pipeline: PipelineModel) {},
	updateSection(pipeline: PipelineModel, section: SectionModel) {},
	updateNode(pipeline: PipelineModel, section: SectionModel, node: NodeModel) {},
	updatePomodoro(pomodoro: PomodoroModel) {},
	updateSubject(subject: SubjectModel, updateMode: UpdateMode = UpdateMode.UPDATE) {}
}
export const WorkPanelContext = React.createContext(defaultController)

export default function WorkPanelView(props: WorkPanelProps) {

	const parseData = (dataStr: string): WorkPanelModel => {
		return JSON.parse(dataStr)
	}

	const [workPanelData, setWorkPanelData] = React.useState(parseData(props.data))
	const ref = React.useRef<HTMLDivElement>(null);

	/**
	 * 保存文件
	 */
	useEffect(() => {
		props.saveData(JSON.stringify(workPanelData))
	}, [workPanelData])

	const workPanelController: WorkPanelController = {
		plugin : props.plugin,
		updatePipeline(pipeline: PipelineModel, updateMode: UpdateMode = UpdateMode.UPDATE) {
			const originalPipelines = pipeline.isTemplate ? workPanelData.templates : workPanelData.workflows
			const newPipelines = []
			for (let i = 0; i < originalPipelines.length; i++) {
				if (originalPipelines[i].id != pipeline.id) {
					newPipelines.push(originalPipelines[i])
                } else if (updateMode == UpdateMode.UPDATE) {
					newPipelines.push(pipeline)
				}
            }
			if (updateMode == UpdateMode.ADD) {
				newPipelines.push(pipeline)
			}
			setWorkPanelData(Object.assign({}, workPanelData, pipeline.isTemplate ? {templates: newPipelines} : {workflows: newPipelines}))
		},
		updateSection(pipeline: PipelineModel, section: SectionModel, updateMode: UpdateMode = UpdateMode.UPDATE) {
			const originalSections = pipeline.sections
            const newSections = []
            for (let i = 0; i < originalSections.length; i++) {
                if (originalSections[i].id !== section.id) {
                    newSections.push(originalSections[i])
                } else if (updateMode == UpdateMode.UPDATE) {
					newSections.push(section)
				}
            }
			if (updateMode == UpdateMode.ADD) {
				newSections.push(section)
			}
			this.updatePipeline(Object.assign({}, pipeline, {sections: newSections}))
		},
		updateNode(pipeline: PipelineModel, section: SectionModel, node: NodeModel, updateMode: UpdateMode = UpdateMode.UPDATE) {
			const originalNodes = section.nodes
			const newNodes = []
			for (let i = 0; i < originalNodes.length; i++) {
				if (originalNodes[i].id !== node.id) {
                    newNodes.push(originalNodes[i])
                } else if (updateMode == UpdateMode.UPDATE) {
                    newNodes.push(node)
                }
            }
            if (updateMode == UpdateMode.ADD) {
				newNodes.push(node)
			}
			this.updateSection(pipeline, Object.assign({}, section, {nodes: newNodes}))
		},
		updatePomodoro(pomodoro: PomodoroModel, updateMode: UpdateMode = UpdateMode.UPDATE) {
			const originalPomodoro = workPanelData.pomodoro
			const newPomodoro = []
			for (let i = 0; i < originalPomodoro.length; i++) {
				if (originalPomodoro[i].id != pomodoro.id) {
					newPomodoro.push(originalPomodoro[i])
				} else if (updateMode == UpdateMode.UPDATE) {
					newPomodoro.push(pomodoro)
				}
			}
			if (updateMode == UpdateMode.ADD) {
				newPomodoro.push(pomodoro)
			}
			setWorkPanelData(Object.assign({}, workPanelData, {pomodoro: newPomodoro}))
		},
		updateSubject(subject: SubjectModel, updateMode: UpdateMode = UpdateMode.UPDATE) {
			const originalSubject = workPanelData.subject
			const parentSubject = subject.parentID == originalSubject.id ? originalSubject
				: searchParentSubject(originalSubject, subject.parentID)
			if (!parentSubject) {
				return
			}
			const newChildren = []
			for (let i = 0; i < parentSubject.children.length; i++) {
				if (parentSubject.children[i].id != subject.id) {
					newChildren.push(parentSubject.children[i])
				} else if (updateMode == UpdateMode.UPDATE) {
					newChildren.push(subject)
				}
			}
			if (updateMode == UpdateMode.ADD) {
				newChildren.push(subject)
			}
			parentSubject.children = newChildren
			setWorkPanelData(Object.assign({}, workPanelData))
		}
	}

	const searchParentSubject = (rootSubject: SubjectModel, parentSubjectID: string): SubjectModel | null => {
		for (let i = 0; i < rootSubject.children.length; i++) {
			if (rootSubject.children[i].id == parentSubjectID) {
				return rootSubject.children[i]
			} else {
				const searchResult = searchParentSubject(rootSubject.children[i], parentSubjectID)
				if (searchResult != null) {
					return searchResult
				}
			}
		}
		return null
	}

	return (
		<WorkPanelContext.Provider value={workPanelController} >
			<div style={{ width: '100%', height: '100%'}} ref={ref}>
				<WorkflowView workflows={workPanelData.workflows} templates={workPanelData.templates} pomodoro={workPanelData.pomodoro} subject={workPanelData.subject}/>
			</div>
		</WorkPanelContext.Provider>
	);
}
