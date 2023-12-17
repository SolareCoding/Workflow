import * as React from 'react';
import {useEffect, useMemo} from 'react';
import {UpdateMode, WorkPanelController} from "./WorkPanel.controller";
import {WorkPanelModel} from "./WorkPanel.model";
import WorkflowPlugin from "../../main";
import {SubjectModel} from "../subject/Subject.model";
import WorkflowViewV2 from "../workflow/WorkflowV2.view";
import {useAppDispatch, useAppSelector} from "../repository/hooks";
import {loadPomodoro, selectPomodoro} from "../pomodoro/Pomodoro.slice";
import {loadWorkflow, selectWorkflow} from "../workflow/Workflow.slice";
import {loadSubject, selectSubject} from "../subject/Subject.slice";

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
	updateSubject(subject: SubjectModel, updateMode: UpdateMode = UpdateMode.UPDATE) {}
}
export const WorkPanelContext = React.createContext(defaultController)

export default function WorkPanelView(props: WorkPanelProps) {

	const pomodoro = useAppSelector(selectPomodoro)
	const workflow = useAppSelector(selectWorkflow)
	const subject=  useAppSelector(selectSubject)
	const dispatch = useAppDispatch()

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

	useEffect(() => {
		const data = parseData(props.data)
		dispatch(loadPomodoro(data.pomodoro))
		dispatch(loadWorkflow(data))
		dispatch(loadSubject(data))
	}, [])

	/**
	 * 监听pomodoro,保存数据
	 */
	useEffect(() => {
		if (pomodoro.hasLoaded) {
			props.saveData(JSON.stringify(Object.assign({}, workPanelData, {pomodoro: pomodoro.pomodoroArray})))
		}
	}, [pomodoro])

	/**
	 * 监听pipelines和templates，保存数据
	 */
	useEffect(() => {
		if (workflow.hasLoaded) {
			props.saveData(JSON.stringify(Object.assign({}, workPanelData, {
				workflows: workflow.pipelines,
				templates: workflow.templates
			})))
		}
	}, [workflow])

	useEffect(() => {
		if (subject.hasLoaded) {
			props.saveData(JSON.stringify(Object.assign({}, workPanelData, {
				subject: subject.rootSubject,
			})))
		}
	}, [subject]);


	return (
		<div style={{ width: '100%', height: '100%'}} ref={ref}>
			<WorkflowViewV2 subject={workPanelData.subject}/>
		</div>
	);
}
