
export class NotificationUtils {
	static sendMessage (msg: string) {
		Notification.requestPermission(function() {
				if (Notification.permission === 'granted') {
					// 用户点击了允许
					let n = new Notification('Solare`s Workflow', {
						body: msg,
					})

					// setTimeout(() => {
					// 	n.close();
					// }, 5000)

					n.onclick = function (e) {
						window.open("obsidian://open?vault=BrainAttic")
						console.log(1, e);
					}

					n.onerror = function (e) {
						console.log(2, e);
					}

					n.onshow = function (e) {
						console.log(3, e);
					}

					n.onclose = function (e) {
						console.log(4, e);
					}

				} else if (Notification.permission === 'denied') {
					// 用户点击了拒绝
				} else {
					// 用户没有做决定
				}
			}
		)
	}
}
