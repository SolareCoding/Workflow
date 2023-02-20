
export class DummyListModel {
	data: DummyModel[]

	static newInstance(): DummyListModel {
		const model = new DummyListModel()
		model.data = []
		model.data.push(DummyModel.newInstance())
		model.data.push(DummyModel.newInstance())
		return model
	}
}

export class DummyModel {
	id: string
	data: DummyItemModel[]

	static newInstance(): DummyModel {
        const model = new DummyModel()
		model.id = Math.random().toString()
        model.data = []
        model.data.push(DummyItemModel.newInstance())
		model.data.push(DummyItemModel.newInstance())
		return model
    }
}

export class DummyItemModel {
	id: string;
	text: string;

	static newInstance(): DummyItemModel {
        const model = new DummyItemModel()
        model.id = Math.random().toString()
		model.text = Math.random().toString()
		return model
    }
}
