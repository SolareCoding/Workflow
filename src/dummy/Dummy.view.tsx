import * as React from 'react';
import {DummyItemView} from "./DummyItem.view";
import {fromJS, Map, List} from "immutable";
import {DummyItemModel, DummyModel} from "./DummyModel";
import {useState} from "react";

export interface DummyItemProps {
	dummyModel: DummyModel,
	update: (dummyModel: DummyModel) => void
}
export default function DummyView(props: DummyItemProps) {

	const {dummyModel, update} = props

	const updateDummyItem = (dummyItem: DummyItemModel) => {
		const newItems = dummyModel.data     .map(item => {
            if (item.id === dummyItem.id) {
                return dummyItem
            }
            return item
        })
		const newDummyModel = Object.assign(dummyModel)
		newDummyModel.data = newItems
        update(newDummyModel)
	}

	const getDummyList = () => {
		const viewList = []
		for (const dummyListElement of dummyModel.data) {
			viewList.push(
				<li>
					<DummyItemView dummyItem={dummyListElement} updateView={updateDummyItem}/>
				</li>
			)
		}
		return viewList
	}

	return <ul>
		{getDummyList()}
	</ul>
}
