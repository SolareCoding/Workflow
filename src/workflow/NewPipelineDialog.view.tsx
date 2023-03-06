import * as React from 'react';
import {useEffect} from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import {PipelineModel} from "../pipeline/Pipeline.model";
import {NodeStatusEnum} from "../nodes/NodeStatus.enum";
import {FormControl, InputLabel, MenuItem} from "@mui/material";
import Select, {SelectChangeEvent} from '@mui/material/Select';
import UUIDUtils from "../utils/UUID.utils";

export interface NewPipelineProps {
	open: boolean;
	templates: PipelineModel[];
	closeDialog: () => void;
	createNewTask: (newPipeline: PipelineModel) => void;
}

export default function NewPipelineDialog(props: NewPipelineProps) {

	const { closeDialog, templates, open } = props;
	const [templateIndex, setTemplateIndex] = React.useState('');
	const [taskName, setTaskName] = React.useState('新任务')

	useEffect(() => {
		setTaskName('新任务')
	}, [open])

	const handleCreateNew = () => {
		if (templateIndex === '') {
			return
		}
		const template = templates[Number.parseInt(templateIndex)]
		// deep copy template and modify uuid
		const copiedSections = []
		for (const section of template.sections) {
			const copiedSection = Object.assign({}, section)
			copiedSection.id = UUIDUtils.getUUID()
			const copiedNodes = []
			for (const node of copiedSection.nodes) {
				const copiedNode = Object.assign({}, node)
				copiedNode.id = UUIDUtils.getUUID()
				copiedNodes.push(copiedNode)
			}
			copiedSection.nodes = copiedNodes
			copiedSections.push(copiedSection)
		}
		const copiedPipeline: PipelineModel = {
			templateTitle: template.title,
			title: taskName,
			createTime: Date.now(),
			status: NodeStatusEnum.PENDING,
			isTemplate: false,
			id: UUIDUtils.getUUID(),
			sections: copiedSections
		}
		props.createNewTask(copiedPipeline)
	}

	const getTemplateViews = () => {
		let pipelines = []
		for (let i = 0; i < templates.length; i++) {
			let pipeline = templates[i]
			pipelines.push(
				<MenuItem key={'template-' + pipeline.id} sx={{color: 'var(--text-normal)', fontSize: '13px'}} value={i}>{pipeline.title}</MenuItem>
			)
		}
		return pipelines
	}

	const handleTemplateChange = (event: SelectChangeEvent) => {
		setTemplateIndex(event.target.value as string);
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
