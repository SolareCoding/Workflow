import {htmlToMarkdown} from "obsidian";
import UUIDUtils from "../utils/UUID.utils";
import {NodeModel} from "../nodes/Node.model";

export class PomodoroModel {
	title: string;
	duration: number;
	startTime: number;
	nodeID: string;
	pomodoroID: string;
	finished: boolean;

	public static newInstance(node: NodeModel): PomodoroModel {
		let pomodoroModel = new PomodoroModel()
		pomodoroModel.nodeID = node.id
		pomodoroModel.pomodoroID = UUIDUtils.getUUID()
		pomodoroModel.title = node.title
		pomodoroModel.duration = 15 * 60 * 1000
		pomodoroModel.startTime = Date.now()
		pomodoroModel.finished = false
		return pomodoroModel
	}
}

export class PomodorosModel {
	data: PomodoroModel[];
	running: boolean;
}
