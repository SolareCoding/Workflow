import * as React from 'react';
import List from '@mui/material/List';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import {PipelineModel} from "../pipeline/Pipeline.model";
import {NodeStatusEnum} from "../nodes/NodeStatus.enum";
import Box from "@mui/material/Box";
import {Button, FormControl, Input, InputLabel, MenuItem, TextField, Typography} from "@mui/material";
import {TimeUtils} from "../utils/Time.utils";
import Select, { SelectChangeEvent } from '@mui/material/Select';

const emails = ['username@gmail.com', 'user02@gmail.com'];

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

	const handleCreateNew = () => {
		if (templateIndex === '') {
			return
		}
		let copied = Object.assign({}, templates[Number.parseInt(templateIndex)])
		copied.title = taskName
		copied.createTime = Date.now()
		copied.status = NodeStatusEnum.PENDING
		props.createNewTask(copied)
	}

	const getTemplateViews = () => {
		let pipelines = []
		for (let i = 0; i < templates.length; i++) {
			let pipeline = templates[i]
			pipelines.push(
				<MenuItem value={i}>{pipeline.title}</MenuItem>
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
		<Dialog onClose={closeDialog} open={open}>
			<DialogTitle>Create a new pipeline</DialogTitle>
			<FormControl variant="standard" sx={{margin:1}}>
				<InputLabel id="template-select-label">Template</InputLabel>
				<Select
					labelId="template-select-label"
					id="template-select"
					value={templateIndex}
					label="Template"
					onChange={handleTemplateChange}
				>
					{getTemplateViews()}
				</Select>
			</FormControl>
			<FormControl variant="standard" sx={{margin:1}}>
				<InputLabel htmlFor="template-simple">Task Name</InputLabel>
				<Input id="template-simple" value={taskName} onChange={handleTaskNameChange} />
				<Button
					sx={{marginY: 1}}
					onClick={() => {
						handleCreateNew()
					}}
					disabled ={templateIndex === ''}
				>
					OK!
				</Button>
			</FormControl>
		</Dialog>
	);
}
