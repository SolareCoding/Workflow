import * as React from "react";
import NodeView from "../nodes/Node.view";
import {
	Card,
	CardContent,
	CardHeader,
	Stack,
} from "@mui/material";
import {NodeModel} from "../nodes/Node.model";

/**
 * One node in pipeline may consist of multiple nodes
 * @constructor
 */
export default function PipelineNodeView() {

	return (
		<Card sx={{minWidth: 220, backgroundColor: "#f2f2f2"}}>
			<CardHeader
				sx={{paddingBottom: 1, justifyContent: 'center'}}
				title="Stage name"
				titleTypographyProps={{ variant: 'h5', align: 'center'}}
			/>
			<CardContent sx={{ padding: 0}}>
				<Stack spacing={1} sx={{alignItems: 'center'}}>
					<NodeView data={NodeModel.getDummyNode()}/>
					<NodeView data={NodeModel.getDummyNode()}/>
					<NodeView data={NodeModel.getDummyNode()}/>
				</Stack>
			</CardContent>
		</Card>
	);
}
