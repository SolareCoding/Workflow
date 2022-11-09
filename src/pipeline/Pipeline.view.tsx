import * as React from "react";
import Box from "@mui/material/Box";
import {
	Stack,
} from "@mui/material";
import PipelineNodeView from "./PipelineNode.view";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import {PipelinesModel} from "./Pipeline.model";
import {createContext} from "react";
import {PipelineContext} from "./Pipeline.context";
import {NodeModel} from "../nodes/Node.model";

export interface PipelineProps {
	data: PipelinesModel
}

export const PLContext = createContext({
	updateNode: (node: NodeModel) => {
		console.log("Default context")
	}
})

export default function PipelineView(props: PipelineProps) {

	const [pipelines, setPipelines] = React.useState(props.data)
	const [changeFlag, setChangeFlag] = React.useState(0)

	const getDividerView = () => {
		return(<KeyboardDoubleArrowRightIcon />)
	}

	const getPipeline = () => {
		console.log("get pipe line")
		let sections = []
		for (const section of pipelines.data[0].sections) {
			sections.push(<PipelineNodeView data={section}/>)
		}
		return sections
	}

	const pipelineContext: PipelineContext = {
		updateNode: (node: NodeModel) => {
			let originPipelines = pipelines
			for (const pipeline of originPipelines.data) {
				for (const section of pipeline.sections) {
					for (let i = 0; i < section.nodes.length; i++) {
						if (section.nodes[i].id == node.id) {
							section.nodes[i] = node;
							setChangeFlag(changeFlag + 1)
							return
						}
					}
				}
			}
		}
	}

	return (
		<PLContext.Provider value={pipelineContext}>
			<Box sx={{overflow: 'scroll', margin: 3}}>
				<Stack spacing={1} sx={{alignItems: 'center'}} direction='row' divider={getDividerView()}>
					{getPipeline()}
				</Stack>
			</Box>
		</PLContext.Provider>
	);
}
