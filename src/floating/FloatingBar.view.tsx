import * as React from "react";
import {PomodoroModel} from "../pomodoro/Pomodoro.model";
import {PipelineModel} from "../pipeline/Pipeline.model";
import {SubjectModel} from "../subject/Subject.model";
import SubjectView from "../subject/Subject.view";
import {useState} from "react";
import PomodoroPanelView from "../pomodoro/PomodoroPanel.view";

interface FloatingBarProps {
	focusedPipeline?: PipelineModel,
	pomodoroArray: PomodoroModel[],
	subject: SubjectModel
}

enum SelectTabEnum {
	Subject = 'Subject',
	Pomodoro = 'Pomodoro',
}

export default function FloatingBarView(floatBarProps: FloatingBarProps) {

	const {focusedPipeline, pomodoroArray} = floatBarProps

	const [selectedTab, setSelectedTab] = useState(SelectTabEnum.Pomodoro)

	const rootSubject = SubjectModel.newInstance()
	for (let i = 0; i < 5; i++) {
		const localSubject = SubjectModel.newInstance()
		for (let j = 0; j < 3; j++) {
			localSubject.children.push(SubjectModel.newInstance())
		}
		rootSubject.children.push(localSubject)
	}

	const getSelectedTabOptions = () => {
		const options = []
		options.push(<option key={'Pomodoro'} value={SelectTabEnum.Pomodoro}>{'Pomodoro'} </option>)
		options.push(<option key={'Subject'} value={SelectTabEnum.Subject}>{'Subject'} </option>)
		return options;
	}

	const handleSelectTabChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedTab(event.target.value as SelectTabEnum)
	}

	const getTabSelectView = () => {
		return <select value={selectedTab} style={{height: 18, fontSize: 14, textAlign: 'start', marginBottom: 3}} name="select-type" onChange={handleSelectTabChanged}>
			{getSelectedTabOptions()}
		</select>
	}

	const getFloatingView = () => {
		switch (selectedTab) {
			case SelectTabEnum.Pomodoro:
				return <PomodoroPanelView focusedPipeline={focusedPipeline} pomodoroList={pomodoroArray} />
			case SelectTabEnum.Subject:
				return <SubjectView subject={floatBarProps.subject} />
		}
	}

	return (
		<div style={{
			flexDirection: 'column',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center'
		}}>
			<div className={'workflow-container-floating'}>
				{getTabSelectView()}
				<div style={{width: '100%', height: '0.5px', backgroundColor: 'var(--background-modifier-border)', marginBottom: '3px', marginTop: '3px'}} />
				{getFloatingView()}
			</div>
		</div>
	);
}
