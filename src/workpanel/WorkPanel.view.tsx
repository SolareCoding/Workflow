import * as React from 'react';
import {WorkPanelEnum} from "./WorkPanel.enum";
import WorkflowView from "../workflow/Workflow.view";
import PomodoroPanelView from "../pomodoro/PomodoroPanel.view";

/**
 * This is the main interface of workflows.
 * 切换到底部导航方案
 * @author: solare@yeah.net
 */

interface WorkPanelProps {
	data: string
	saveData: (dataStr: string)=>void
}

export const WorkPanelContext = React.createContext(0)

export default function WorkPanelView(props: WorkPanelProps) {

	const [data, setData] = React.useState(JSON.parse(props.data))
	const [panelIndex, setPanelIndex] = React.useState(WorkPanelEnum.WORKFLOWS);
	const ref = React.useRef<HTMLDivElement>(null);

	/**
	 * 异步保存
	 */
	const savePipelines = ()=> {
		return new Promise((resolve, reject) => {
			props.saveData(JSON.stringify(data))
		})
	}

	const pomodoroView = <PomodoroPanelView pomodoroData={data.pomodoros} saveData={()=>{}}/>
	const workflowView = <WorkflowView workflows={data.workflows} templates={data.pipelines} saveData={savePipelines}/>
	const templateView = <WorkflowView workflows={data.workflows} templates={data.pipelines} saveData={savePipelines} editorMode={true}/>

	const getContent = (index: WorkPanelEnum) => {
		switch (index) {
			case WorkPanelEnum.POMODORO:
				return pomodoroView
			case WorkPanelEnum.PIPELINES:
				return templateView
			case WorkPanelEnum.WORKFLOWS:
				return workflowView
		}
	}

	return (
		<WorkPanelContext.Provider value={data} >
			<div style={{ display: 'flex', flexDirection:'column', width: '100%', height: '100%'}} ref={ref}>
				<div style={{height: '100%', width: '100%', overflow: 'scroll', paddingTop: 0}}>
					{getContent(panelIndex)}
				</div>
				<div className={'workflow-container-bg'} style={{ height: 60, width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', padding: 10}}>
					<button onClick={() => setPanelIndex(WorkPanelEnum.POMODORO)}> Pomodoro </button>
					<button style={{marginLeft: 10, marginRight: 10}} onClick={() => setPanelIndex(WorkPanelEnum.WORKFLOWS)}> Workflows </button>
					<button onClick={() => setPanelIndex(WorkPanelEnum.PIPELINES)}> Pipelines </button>
				</div>
			</div>
		</WorkPanelContext.Provider>
	);
}
