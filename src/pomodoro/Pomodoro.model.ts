import {htmlToMarkdown} from "obsidian";

export class PomodoroModel {
	title: string;
	duration: number;
	startTime: number;
	timeLeft: string;

	public static getDummyModel(): PomodoroModel {
		return {
			title: "Dummy",
			duration: 15 * 60 * 1000,
			startTime: Date.now(),
			timeLeft: '0'
		}
	}

	public static parseData(data: string): PomodoroModel {
		let model: PomodoroModel =  JSON.parse(data);
		model.startTime = Date.now();
		return model;
	}
}
