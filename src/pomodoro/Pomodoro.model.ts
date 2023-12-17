import UUIDUtils from "../utils/UUID.utils";
import {PipelineModel} from "../pipeline/Pipeline.model";
import {TimeUtils} from "../utils/Time.utils";


export enum PomodoroStatus {
	RUNNING,
	PAUSED,
	FINISHED,
}
export interface PomodoroModel {
	editMode: boolean;
	title: string;
	duration: number;
	startTime: number;
	timeleft: number;
	pipelineId: string;
	subjectId: string;
	id: string;
	status: PomodoroStatus;
}

export function newPomodoroModel(pipeline: PipelineModel): PomodoroModel {
	return {
		editMode : true,
		pipelineId : pipeline.id,
		subjectId : pipeline.subjectID,
		id : UUIDUtils.getUUID(),
		title : '🍅' + pipeline.title,
		duration : 15 * 60,
		timeleft : 15 * 60,
		startTime : Date.now(),
		status : PomodoroStatus.RUNNING,
	}
}
