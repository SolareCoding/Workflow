import * as React from "react";
import Box from "@mui/material/Box";
import {
	Stack, Typography,
} from "@mui/material";
import PipelineNodeView from "./PipelineNode.view";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import {PipelineModel, PipelinesModel} from "./Pipeline.model";
import {createContext} from "react";
import {PipelineContext} from "./Pipeline.context";
import {NodeModel} from "../nodes/Node.model";

export interface PipelineProps {
	data: PipelineModel
	saveData: () => void;
}

export const PLContext = createContext({
	updateNode: () => {
		console.log("Default context")
	}
})

/**
 * 单条流水线的View
 * @param props
 * @constructor
 */
export default function PipelineView(props: PipelineProps) {

	const [changeFlag, setChangeFlag] = React.useState(false)

	const getDividerView = () => {
		return(<KeyboardDoubleArrowRightIcon />)
	}

	const getPipeline = () => {
		let sections = []
		for (const section of props.data.sections) {
			sections.push(<PipelineNodeView data={section}/>)
		}
		return sections
	}

	/**
	 * 更新所有Pipelines中的对应节点
	 */
	const pipelineContext: PipelineContext = {
		updateNode: () => {
			setChangeFlag(!changeFlag)
			props.saveData()
		}
	}

	return (
		<PLContext.Provider value={pipelineContext}>
			<Box sx={{overflow: 'scroll', margin: 3}}>
				<Typography sx={{fontSize: 20, fontWeight: 600, marginBottom: 1, textAlign: 'center'}}>{'工作流: ' + props.data.title}</Typography>
				<Stack spacing={1} sx={{alignItems: 'center'}} direction='row' divider={getDividerView()}>
					{getPipeline()}
				</Stack>
			</Box>
		</PLContext.Provider>
	);
}
