export class NotificationUtils {
    static sendMessage(msg) {
        Notification.requestPermission(function () {
            if (Notification.permission === 'granted') {
                // 用户点击了允许
                let n = new Notification('Solare`s Workflow', {
                    body: msg,
                });
                // setTimeout(() => {
                // 	n.close();
                // }, 5000)
                n.onclick = function (e) {
                    window.open("obsidian://open?vault=BrainAttic");
                    console.log(1, e);
                };
                n.onerror = function (e) {
                    console.log(2, e);
                };
                n.onshow = function (e) {
                    console.log(3, e);
                };
                n.onclose = function (e) {
                    console.log(4, e);
                };
            }
            else if (Notification.permission === 'denied') {
                // 用户点击了拒绝
            }
            else {
                // 用户没有做决定
            }
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTm90aWZpY2F0aW9uLnV0aWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiTm90aWZpY2F0aW9uLnV0aWxzLnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxNQUFNLE9BQU8saUJBQWlCO0lBQzdCLE1BQU0sQ0FBQyxXQUFXLENBQUUsR0FBVztRQUM5QixZQUFZLENBQUMsaUJBQWlCLENBQUM7WUFDN0IsSUFBSSxZQUFZLENBQUMsVUFBVSxLQUFLLFNBQVMsRUFBRTtnQkFDMUMsVUFBVTtnQkFDVixJQUFJLENBQUMsR0FBRyxJQUFJLFlBQVksQ0FBQyxtQkFBbUIsRUFBRTtvQkFDN0MsSUFBSSxFQUFFLEdBQUc7aUJBQ1QsQ0FBQyxDQUFBO2dCQUVGLHFCQUFxQjtnQkFDckIsY0FBYztnQkFDZCxXQUFXO2dCQUVYLENBQUMsQ0FBQyxPQUFPLEdBQUcsVUFBVSxDQUFDO29CQUN0QixNQUFNLENBQUMsSUFBSSxDQUFDLGtDQUFrQyxDQUFDLENBQUE7b0JBQy9DLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixDQUFDLENBQUE7Z0JBRUQsQ0FBQyxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUM7b0JBQ3RCLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixDQUFDLENBQUE7Z0JBRUQsQ0FBQyxDQUFDLE1BQU0sR0FBRyxVQUFVLENBQUM7b0JBQ3JCLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixDQUFDLENBQUE7Z0JBRUQsQ0FBQyxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUM7b0JBQ3RCLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNuQixDQUFDLENBQUE7YUFFRDtpQkFBTSxJQUFJLFlBQVksQ0FBQyxVQUFVLEtBQUssUUFBUSxFQUFFO2dCQUNoRCxVQUFVO2FBQ1Y7aUJBQU07Z0JBQ04sVUFBVTthQUNWO1FBQ0YsQ0FBQyxDQUNELENBQUE7SUFDRixDQUFDO0NBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuZXhwb3J0IGNsYXNzIE5vdGlmaWNhdGlvblV0aWxzIHtcclxuXHRzdGF0aWMgc2VuZE1lc3NhZ2UgKG1zZzogc3RyaW5nKSB7XHJcblx0XHROb3RpZmljYXRpb24ucmVxdWVzdFBlcm1pc3Npb24oZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0aWYgKE5vdGlmaWNhdGlvbi5wZXJtaXNzaW9uID09PSAnZ3JhbnRlZCcpIHtcclxuXHRcdFx0XHRcdC8vIOeUqOaIt+eCueWHu+S6huWFgeiuuFxyXG5cdFx0XHRcdFx0bGV0IG4gPSBuZXcgTm90aWZpY2F0aW9uKCdTb2xhcmVgcyBXb3JrZmxvdycsIHtcclxuXHRcdFx0XHRcdFx0Ym9keTogbXNnLFxyXG5cdFx0XHRcdFx0fSlcclxuXHJcblx0XHRcdFx0XHQvLyBzZXRUaW1lb3V0KCgpID0+IHtcclxuXHRcdFx0XHRcdC8vIFx0bi5jbG9zZSgpO1xyXG5cdFx0XHRcdFx0Ly8gfSwgNTAwMClcclxuXHJcblx0XHRcdFx0XHRuLm9uY2xpY2sgPSBmdW5jdGlvbiAoZSkge1xyXG5cdFx0XHRcdFx0XHR3aW5kb3cub3BlbihcIm9ic2lkaWFuOi8vb3Blbj92YXVsdD1CcmFpbkF0dGljXCIpXHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKDEsIGUpO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdG4ub25lcnJvciA9IGZ1bmN0aW9uIChlKSB7XHJcblx0XHRcdFx0XHRcdGNvbnNvbGUubG9nKDIsIGUpO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdG4ub25zaG93ID0gZnVuY3Rpb24gKGUpIHtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coMywgZSk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0bi5vbmNsb3NlID0gZnVuY3Rpb24gKGUpIHtcclxuXHRcdFx0XHRcdFx0Y29uc29sZS5sb2coNCwgZSk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdH0gZWxzZSBpZiAoTm90aWZpY2F0aW9uLnBlcm1pc3Npb24gPT09ICdkZW5pZWQnKSB7XHJcblx0XHRcdFx0XHQvLyDnlKjmiLfngrnlh7vkuobmi5Lnu51cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Ly8g55So5oi35rKh5pyJ5YGa5Yaz5a6aXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHQpXHJcblx0fVxyXG59XHJcbiJdfQ==