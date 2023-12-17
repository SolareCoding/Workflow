import { __awaiter } from "tslib";
import { WorkflowModal } from "./WorkflowModal";
import { WORKFLOW_FILE_NAME } from "./WorkflowSettings";
import { WORK_FLOW_VIEW } from "../workpanel/WorkPanel.entry";
export function openWorkflowPanel(app, plugin) {
    return __awaiter(this, void 0, void 0, function* () {
        let filePath = plugin.settings.filePath;
        if (!filePath.endsWith('/')) {
            filePath += '/';
        }
        filePath += WORKFLOW_FILE_NAME;
        yield app.vault.adapter.exists(filePath).then(exist => {
            if (exist) {
                let hasLeaf = false;
                app.workspace.iterateAllLeaves(leaf => {
                    if (leaf.getViewState().type == WORK_FLOW_VIEW) {
                        hasLeaf = true;
                        app.workspace.revealLeaf(leaf);
                    }
                });
                if (hasLeaf) {
                    return;
                }
                const leaf = app.workspace.getLeaf(true);
                leaf.openFile(this.app.vault.getAbstractFileByPath(filePath), {
                    active: true,
                });
            }
            else {
                new WorkflowModal(app, 'The workflow file has not been created yet').open();
            }
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV29ya2Zsb3dSaWJib25IZWxwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJXb3JrZmxvd1JpYmJvbkhlbHBlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBRUEsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzlDLE9BQU8sRUFBQyxrQkFBa0IsRUFBQyxNQUFNLG9CQUFvQixDQUFDO0FBQ3RELE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSw4QkFBOEIsQ0FBQztBQUU1RCxNQUFNLFVBQWdCLGlCQUFpQixDQUFDLEdBQVEsRUFBRSxNQUFzQjs7UUFDdkUsSUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUM7UUFDeEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDNUIsUUFBUSxJQUFJLEdBQUcsQ0FBQTtTQUNmO1FBQ0QsUUFBUSxJQUFJLGtCQUFrQixDQUFBO1FBQzlCLE1BQU0sR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNyRCxJQUFJLEtBQUssRUFBRTtnQkFDVixJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUE7Z0JBQ25CLEdBQUcsQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQ3JDLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLElBQUksSUFBSSxjQUFjLEVBQUU7d0JBQy9DLE9BQU8sR0FBRyxJQUFJLENBQUE7d0JBQ2QsR0FBRyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUE7cUJBQzlCO2dCQUNGLENBQUMsQ0FBQyxDQUFBO2dCQUNGLElBQUksT0FBTyxFQUFFO29CQUNaLE9BQU07aUJBQ047Z0JBQ0QsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3pDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMscUJBQXFCLENBQUMsUUFBUSxDQUFDLEVBQUU7b0JBQzdELE1BQU0sRUFBRSxJQUFJO2lCQUNaLENBQUMsQ0FBQTthQUNGO2lCQUFNO2dCQUNOLElBQUksYUFBYSxDQUFDLEdBQUcsRUFBRSw0Q0FBNEMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFBO2FBQzNFO1FBQ0YsQ0FBQyxDQUFDLENBQUE7SUFDSCxDQUFDO0NBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0FwcH0gZnJvbSBcIm9ic2lkaWFuXCI7XHJcbmltcG9ydCBXb3JrZmxvd1BsdWdpbiBmcm9tIFwiLi4vLi4vbWFpblwiO1xyXG5pbXBvcnQge1dvcmtmbG93TW9kYWx9IGZyb20gXCIuL1dvcmtmbG93TW9kYWxcIjtcclxuaW1wb3J0IHtXT1JLRkxPV19GSUxFX05BTUV9IGZyb20gXCIuL1dvcmtmbG93U2V0dGluZ3NcIjtcclxuaW1wb3J0IHtXT1JLX0ZMT1dfVklFV30gZnJvbSBcIi4uL3dvcmtwYW5lbC9Xb3JrUGFuZWwuZW50cnlcIjtcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBvcGVuV29ya2Zsb3dQYW5lbChhcHA6IEFwcCwgcGx1Z2luOiBXb3JrZmxvd1BsdWdpbikge1xyXG5cdGxldCBmaWxlUGF0aCA9IHBsdWdpbi5zZXR0aW5ncy5maWxlUGF0aDtcclxuXHRpZiAoIWZpbGVQYXRoLmVuZHNXaXRoKCcvJykpIHtcclxuXHRcdGZpbGVQYXRoICs9ICcvJ1xyXG5cdH1cclxuXHRmaWxlUGF0aCArPSBXT1JLRkxPV19GSUxFX05BTUVcclxuXHRhd2FpdCBhcHAudmF1bHQuYWRhcHRlci5leGlzdHMoZmlsZVBhdGgpLnRoZW4oZXhpc3QgPT4ge1xyXG5cdFx0aWYgKGV4aXN0KSB7XHJcblx0XHRcdGxldCBoYXNMZWFmID0gZmFsc2VcclxuXHRcdFx0YXBwLndvcmtzcGFjZS5pdGVyYXRlQWxsTGVhdmVzKGxlYWYgPT4ge1xyXG5cdFx0XHRcdGlmIChsZWFmLmdldFZpZXdTdGF0ZSgpLnR5cGUgPT0gV09SS19GTE9XX1ZJRVcpIHtcclxuXHRcdFx0XHRcdGhhc0xlYWYgPSB0cnVlXHJcblx0XHRcdFx0XHRhcHAud29ya3NwYWNlLnJldmVhbExlYWYobGVhZilcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pXHJcblx0XHRcdGlmIChoYXNMZWFmKSB7XHJcblx0XHRcdFx0cmV0dXJuXHJcblx0XHRcdH1cclxuXHRcdFx0Y29uc3QgbGVhZiA9IGFwcC53b3Jrc3BhY2UuZ2V0TGVhZih0cnVlKTtcclxuXHRcdFx0bGVhZi5vcGVuRmlsZSh0aGlzLmFwcC52YXVsdC5nZXRBYnN0cmFjdEZpbGVCeVBhdGgoZmlsZVBhdGgpLCB7XHJcblx0XHRcdFx0YWN0aXZlOiB0cnVlLFxyXG5cdFx0XHR9KVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0bmV3IFdvcmtmbG93TW9kYWwoYXBwLCAnVGhlIHdvcmtmbG93IGZpbGUgaGFzIG5vdCBiZWVuIGNyZWF0ZWQgeWV0Jykub3BlbigpXHJcblx0XHR9XHJcblx0fSlcclxufVxyXG4iXX0=