import * as React from "react";
import Box from "@mui/material/Box";
import {Card, CardActions, CardContent, CardHeader, Stack} from "@mui/material";
import NodeView from "./Node.view";
import {auto} from "@popperjs/core";

export default function NodeManagerView() {

	const [value, setValue] = React.useState(0);

	return (
		<Box sx={{marginTop: 2}}>
			<Stack spacing={2} sx={{alignItems: 'center'}}>
				<NodeView/>
				<NodeView/>
				<NodeView/>
			</Stack>
		</Box>
	);
}
