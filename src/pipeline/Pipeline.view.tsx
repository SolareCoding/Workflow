import * as React from "react";
import Box from "@mui/material/Box";
import {
	Stack,
} from "@mui/material";
import PipelineNodeView from "./PipelineNode.view";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

export default function PipelineView() {

	function getDividerView() {
		return(<KeyboardDoubleArrowRightIcon />)
	}

	return (
		<Box sx={{overflow: 'scroll'}}>
			<Stack spacing={1} sx={{alignItems: 'center'}} direction='row' divider={getDividerView()}>
				<PipelineNodeView/>
				<PipelineNodeView/>
				<PipelineNodeView/>
				<PipelineNodeView/>
				<PipelineNodeView/>
				<PipelineNodeView/>
				<PipelineNodeView/>
			</Stack>
		</Box>
	);
}
