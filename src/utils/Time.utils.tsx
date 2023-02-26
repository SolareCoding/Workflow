export class TimeUtils {
	static getDateTimeStr(time: number) {
		let date = new Date(time)
		return date.getMonth() + 1 + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes()
	}

	static getDateStr(time: number) {
		let date = new Date(time)
		return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
	}
}
