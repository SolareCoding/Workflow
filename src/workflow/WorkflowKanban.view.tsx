import Box from "@mui/material/Box";
import {Divider, IconButton, Stack, Typography} from "@mui/material";
import * as React from "react";
import {PipelineModel} from "../pipeline/Pipeline.model";
import {NodeStatusEnum} from "../nodes/NodeStatus.enum";
import {TimeUtils} from "../utils/Time.utils";

export interface WorkflowKanbanProps {
	title: string,
	data: PipelineModel[],
	onPipelineClick: (pipeline: PipelineModel) => void
}

/**
 * A workflow kanban consists
 * @constructor
 */
export default function WorkflowKanbanView(props: WorkflowKanbanProps) {

	const getProgress = (pipeline: PipelineModel) => {
		let totalNodes = 0;
		let doneNodes = 0;
		for (const section of pipeline.sections) {
			for (const sectionElement of section.nodes) {
				totalNodes ++
				if (sectionElement.status == NodeStatusEnum.DONE) {
					doneNodes ++
				}
			}
		}
		return doneNodes + '/' + totalNodes
	}

	const addNewWorkflow = () => {
		console.log("add new")

	}

	const addNewView = <Box onClick={(event) => addNewWorkflow()}>
		<Typography variant="body2" sx={{fontWeight: '600', color: "#336666", textAlign: 'center'}}>
			Add new
		</Typography>
	</Box>

	const getPipelines = () => {
		let pipelines = []
		for (const pipeline of props.data) {
			pipelines.push(
				<Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', id: pipeline.id}} onClick={()=>{
					props.onPipelineClick(pipeline)}}>
					<Box>
						<Typography>
							{pipeline.title}
						</Typography>
					</Box>
					<Box sx={{width: 110, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
						<Typography variant="body2">
							{TimeUtils.getDateTimeStr(pipeline.createTime)}
						</Typography>
						<Typography variant="body2" sx={{fontWeight: '600', color: "#336666"}}>
							{getProgress(pipeline)}
						</Typography>
					</Box>
				</Box>
			)
		}
		if (props.title == NodeStatusEnum.PENDING) {
			pipelines.push(addNewView)
		}
		return pipelines
	}

	return (
		<Box sx={{width: 300, bgcolor: 'background.paper', padding: 1, borderRadius: 1, boxShadow: 1}}>
			<Typography variant="h5" gutterBottom color={'#333366'}>
				{'Kanban: ' + props.title}
			</Typography>
			<Divider sx={{marginY: 1}}/>
			<Stack spacing={1} divider={<Divider orientation="horizontal" flexItem />}>
				{getPipelines()}
			</Stack>
		</Box>
	);
}
