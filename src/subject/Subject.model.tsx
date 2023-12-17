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
