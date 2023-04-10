export class TimeUtils {

	static getMMSSStr(time: number) {
		let m = Math.floor((time / 60 % 60)).toString()
		let s = Math.floor((time % 60)).toString()
		if (m.length == 1) m = '0' + m
		if (s.length == 1) s = '0' + s
		return m + ": " + s;
	}
	static getDateTimeStr(time: number) {
		let date = new Date(time)
		return date.getMonth() + 1 + '/' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes()
	}

	static getDateStr(time: number) {
		let date = new Date(time)
		return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
	}
}
