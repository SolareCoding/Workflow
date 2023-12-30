import * as React from 'react';
import {useEffect} from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import {PipelineModel} from "../pipeline/Pipeline.model";
import {NodeStatusEnum} from "../nodes/NodeStatus.enum";
import {FormControl, InputLabel, MenuItem} from "@mui/material";
import Select, {SelectChangeEvent} from '@mui/material/Select';
import UUIDUtils from "../utils/UUID.utils";
import {flatSubjects} from "../subject/Subject.model";
import {useAppSelector} from "../repository/hooks";
import {selectWorkflow} from "./Workflow.slice";
import {selectSubject} from "../subject/Subject.slice";
import {genPipelineFromTemplate} from "../utils/Object.utils";

export interface NewPipelineProps {
	open: boolean;
	closeDialog: () => void;
	createNewTask: (newPipeline: PipelineModel) => void;
	preSelectedTemplateID?: string;
	preSetWorkflowName?: string | null
}

export default function NewPipelineDialog(props: NewPipelineProps) {

	const workflowRepo = useAppSelector(selectWorkflow)
	const subjectRepo = useAppSelector(selectSubject)
	const flatSubjectList = flatSubjects(subjectRepo.rootSubject)
	const { closeDialog, open, preSelectedTemplateID, preSetWorkflowName } = props;
	const [templateIndex, setTemplateIndex] = React.useState('');
	const [subjectIndex, setSubjectIndex] = React.useState('');
	const [taskName, setTaskName] = React.useState('新任务')

	useEffect(() => {
		setTaskName('新任务')
	}, [open])

	useEffect(() => {
		if (!preSelectedTemplateID || !preSetWorkflowName) {
			return
		}
		const templateIndex = workflowRepo.templates.findIndex((value) => value.id == preSelectedTemplateID)
		setTemplateIndex(templateIndex.toString())
		setTaskName(preSetWorkflowName)
	}, [preSelectedTemplateID, workflowRepo.templates, preSetWorkflowName])

	const handleCreateNew = () => {
		if (templateIndex === '') {
			return
		}
		const template = workflowRepo.templates[Number.parseInt(templateIndex)]
		const subject = flatSubjectList[Number.parseInt(subjectIndex)]
		const copiedPipeline = genPipelineFromTemplate(template, taskName, subject?.id || '0')
		console.log('copiedPipeline: ', JSON.stringify(copiedPipeline))
		props.createNewTask(copiedPipeline)
	}

	const getTemplateViews = () => {
		let pipelines = []
		for (let i = 0; i < workflowRepo.templates.length; i++) {
			let pipeline = workflowRepo.templates[i]
			pipelines.push(
				<MenuItem key={'template-' + pipeline.id} sx={{color: 'var(--text-normal)', fontSize: '13px'}} value={i}>{pipeline.title}</MenuItem>
			)
		}
		return pipelines
	}

	const handleTemplateChange = (event: SelectChangeEvent) => {
		setTemplateIndex(event.target.value as string);
	};

	const getSubjectViews = () => {
		let subjectsViews = []
		for (let i = 0; i < flatSubjectList.length; i++) {
			let subject = flatSubjectList[i]
			subjectsViews.push(
				<MenuItem key={'subject-' + subject.id} sx={{color: 'var(--text-normal)', fontSize: '13px'}} value={i}>{subject.name}</MenuItem>
			)
		}
		return subjectsViews
	}

	const handleSubjectChange = (event: SelectChangeEvent) => {
		setSubjectIndex(event.target.value as string);
	};

	const handleTaskNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTaskName(event.target.value);
	};

	return (
		<Dialog onClose={closeDialog} open={open}
				PaperProps={{
					style: {
						backgroundColor: 'var(--background-secondary)',
						boxShadow: 'none',
						color: 'var(--text-normal)'
					},
				}}>
			<DialogTitle className={'workflow-text-normal'}>
				Create a new pipeline
			</DialogTitle>
			<FormControl variant="standard" sx={{margin:1}}>
				<InputLabel id="template-select-label" sx={{color: 'var(--text-normal)'}}>Select template</InputLabel>
				<Select
					style={{
						color: 'var(--text-normal)',
						fontSize: '13px'
					}}
					MenuProps={{ PaperProps: {
							sx: {
								backgroundColor: 'var(--background-secondary)',
								color: '#FFFFFF',
							},},
						}}
					id="template-select"
					value={templateIndex}
					onChange={handleTemplateChange}
				>
					{getTemplateViews()}
				</Select>
			</FormControl>
			<FormControl variant="standard" sx={{margin:1}}>
				<InputLabel id="subject-select-label" sx={{color: 'var(--text-normal)'}}>Select subject</InputLabel>
				<Select
					style={{
						color: 'var(--text-normal)',
						fontSize: '13px'
					}}
					MenuProps={{ PaperProps: {
							sx: {
								backgroundColor: 'var(--background-secondary)',
								color: '#FFFFFF',
							},},
					}}
					id="subject-select"
					value={subjectIndex}
					onChange={handleSubjectChange}
				>
					{getSubjectViews()}
				</Select>
			</FormControl>
			<FormControl variant="standard" sx={{margin:1}}>
				<input className={'workflow-input'} style={{fontSize: '13px'}} id="template-simple" value={taskName} onChange={handleTaskNameChange} />
				<button
					style={{marginTop: 10}}
					onClick={() => {
						handleCreateNew()
					}}
					disabled ={templateIndex === ''}
				>
					OK!
				</button>
			</FormControl>
		</Dialog>
	);
}
