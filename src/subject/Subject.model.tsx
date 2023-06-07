import UUIDUtils from "../utils/UUID.utils";

export class SubjectModel {
	id: string;
	parentID: string;
	name: string;
	children: SubjectModel[];
	score: number;

	public static newInstance(): SubjectModel {
		const subject = new SubjectModel();
		subject.children = []
		subject.id = UUIDUtils.getUUID()
		subject.parentID = '0'
		subject.name = 'New Subject'
		subject.score = 0
		return subject;
	}
}
