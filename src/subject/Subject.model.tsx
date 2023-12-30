import UUIDUtils from "../utils/UUID.utils";

export interface SubjectModel {
	id: string;
	parentID: string;
	name: string;
	children: SubjectModel[];
	score: number;
}

export function newSubjectInstance(parentID ?: string): SubjectModel {
	return {
		id: UUIDUtils.getUUID(),
		parentID: parentID || '0',
		name: 'New Subject',
		children: [],
		score: 0,
	}
}

export function flatSubjects(rootSubject: SubjectModel): SubjectModel[] {
	const flatList: SubjectModel[] = [];
	innerFlatterSubjects(rootSubject, flatList);
	return flatList;
}

export function innerFlatterSubjects(subject: SubjectModel, list: SubjectModel[]) {
	for (const child of subject.children) {
		list.push(child);
		innerFlatterSubjects(child, list);
	}
}
