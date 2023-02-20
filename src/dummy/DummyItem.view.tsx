import {Typography} from "@mui/material";
import * as React from 'react';
import {DummyItemModel} from "./DummyModel";
import {fromJS, Map, List} from "immutable";


export interface DummyItemProps {
	dummyItem: DummyItemModel

	updateView: (dummyItemModel: DummyItemModel) => void;
}
export function DummyItemView(props: DummyItemProps) {

	const dummyItem = props.dummyItem

	const updateView = () => {
		const newItem = Object.assign(dummyItem)
		newItem.text = dummyItem.text + 'updated '
		return newItem
	}

	return <Typography onClick={ () => props.updateView(updateView())}>
		{ dummyItem.text }
	</Typography>
}
