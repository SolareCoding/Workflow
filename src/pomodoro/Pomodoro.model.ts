import UUIDUtils from "../utils/UUID.utils";
import {PipelineModel} from "../pipeline/Pipeline.model";
import {TimeUtils} from "../utils/Time.utils";


export enum PomodoroStatus {
	RUNNING,
	PAUSED,
	FINISHED,
}
export class PomodoroModel {
	editMode: boolean;
	title: string;
	duration: number;
	startTime: number;
	timeleft: number;
	pipelineId: string;
	subjectId: string;
	id: string;
	status: PomodoroStatus;

	public static newInstance(pipeline: PipelineModel): PomodoroModel {
		let pomodoroModel = new PomodoroModel()
		pomodoroModel.editMode = true
		pomodoroModel.pipelineId = pipeline.id
		pomodoroModel.subjectId = pipeline.subjectID
		pomodoroModel.id = UUIDUtils.getUUID()
		pomodoroModel.title = pipeline.title + ' ' + TimeUtils.getDateTimeStr(Date.now())
		pomodoroModel.duration = 15 * 60
		pomodoroModel.timeleft = 15 * 60
		pomodoroModel.startTime = Date.now()
		pomodoroModel.status = PomodoroStatus.RUNNING
		return pomodoroModel
	}
}
