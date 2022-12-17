export default class UUIDUtils {
	static getUUID = () => {
		return Date.now().toString() + (Array(4).join('0') + (Math.random() * 1000).toFixed(0)).slice(-4)
	}
}
