import * as React from 'react';
import {DummyListModel, DummyModel} from "./DummyModel";
import DummyView from "./Dummy.view";

export interface DummyItemProps {
	dummyList: DummyListModel
}
export default function DummyListView(listData: DummyItemProps) {

	const dummyList = listData.dummyList.data;
	const [list, setList] = React.useState(dummyList);

	const update = (dummyModel: DummyModel) => {
		const newItems = dummyList.map(item => {
			if (item.id === dummyModel.id) {
				return dummyModel
			}
			return item
		})
		setList(newItems)
	}

	const getDummyList = () => {
		const viewList = []
		for (const dummyListElement of list) {
			viewList.push(
				<li>
					<DummyView dummyModel={dummyListElement} update={update}/>
				</li>
			)
		}
		return viewList
	}

	return <div>
		<ul>
			{getDummyList()}
		</ul>
	</div>
}
