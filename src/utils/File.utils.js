import { TFile, TFolder, Vault } from "obsidian";
export function getAllFolders(app) {
    const folders = [];
    Vault.recurseChildren(app.vault.getRoot(), (f) => {
        if (f instanceof TFolder) {
            folders.push(f.path);
        }
    });
    return folders;
}
export function openFileInNewLeaf(filePath, app) {
    const file = app.vault.getAbstractFileByPath(filePath);
    if (!file || !(file instanceof TFile)) {
        return;
    }
    // open the file directly
    console.log("newFilePath: ", filePath);
    const leaf = app.workspace.getLeaf(true);
    leaf.openFile(file, {
        active: true,
    }).then(() => {
    }).catch((reason) => {
        console.log(reason);
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmlsZS51dGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIkZpbGUudXRpbHMudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBTSxLQUFLLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUdwRCxNQUFNLFVBQVUsYUFBYSxDQUFDLEdBQVE7SUFDckMsTUFBTSxPQUFPLEdBQVksRUFBRSxDQUFDO0lBQzVCLEtBQUssQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFO1FBQ2hELElBQUksQ0FBQyxZQUFZLE9BQU8sRUFBRTtZQUN6QixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNyQjtJQUNGLENBQUMsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxPQUFPLENBQUM7QUFDaEIsQ0FBQztBQUVELE1BQU0sVUFBVSxpQkFBaUIsQ0FBQyxRQUFnQixFQUFFLEdBQVE7SUFDM0QsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUN0RCxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLFlBQVksS0FBSyxDQUFDLEVBQUU7UUFDdEMsT0FBTTtLQUNOO0lBQ0QseUJBQXlCO0lBQ3pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxFQUFFLFFBQVEsQ0FBQyxDQUFBO0lBQ3RDLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3pDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFO1FBQ25CLE1BQU0sRUFBRSxJQUFJO0tBQ1osQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUU7SUFFYixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtRQUNuQixPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQ3BCLENBQUMsQ0FBQyxDQUFBO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7QXBwLCBURmlsZSwgVEZvbGRlciwgVmF1bHR9IGZyb20gXCJvYnNpZGlhblwiO1xyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRBbGxGb2xkZXJzKGFwcDogQXBwKSB7XHJcblx0Y29uc3QgZm9sZGVyczpzdHJpbmdbXSA9IFtdO1xyXG5cdFZhdWx0LnJlY3Vyc2VDaGlsZHJlbihhcHAudmF1bHQuZ2V0Um9vdCgpLCAoZikgPT4ge1xyXG5cdFx0aWYgKGYgaW5zdGFuY2VvZiBURm9sZGVyKSB7XHJcblx0XHRcdGZvbGRlcnMucHVzaChmLnBhdGgpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cdHJldHVybiBmb2xkZXJzO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gb3BlbkZpbGVJbk5ld0xlYWYoZmlsZVBhdGg6IHN0cmluZywgYXBwOiBBcHApIHtcclxuXHRjb25zdCBmaWxlID0gYXBwLnZhdWx0LmdldEFic3RyYWN0RmlsZUJ5UGF0aChmaWxlUGF0aClcclxuXHRpZiAoIWZpbGUgfHwgIShmaWxlIGluc3RhbmNlb2YgVEZpbGUpKSB7XHJcblx0XHRyZXR1cm5cclxuXHR9XHJcblx0Ly8gb3BlbiB0aGUgZmlsZSBkaXJlY3RseVxyXG5cdGNvbnNvbGUubG9nKFwibmV3RmlsZVBhdGg6IFwiLCBmaWxlUGF0aClcclxuXHRjb25zdCBsZWFmID0gYXBwLndvcmtzcGFjZS5nZXRMZWFmKHRydWUpO1xyXG5cdGxlYWYub3BlbkZpbGUoZmlsZSwge1xyXG5cdFx0YWN0aXZlOiB0cnVlLFxyXG5cdH0pLnRoZW4oKCkgPT4ge1xyXG5cclxuXHR9KS5jYXRjaCgocmVhc29uKSA9PiB7XHJcblx0XHRjb25zb2xlLmxvZyhyZWFzb24pXHJcblx0fSlcclxufVxyXG4iXX0=