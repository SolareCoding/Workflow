import { __awaiter } from "tslib";
import { TextFileView } from "obsidian";
import { createRoot } from "react-dom/client";
import * as React from "react";
import SwipeableEdgeDrawer from "../workflow/MyPopupDrawer";
export const WORK_FLOW_VIEW = 'WorkFlowView';
/**
 * 主页面，从workflow文件进入的初始页面
 */
export class WorkPanelEntry extends TextFileView {
    constructor(leaf, plugin) {
        super(leaf);
        this.root = createRoot(this.containerEl);
        this.getContainer = () => {
            return this.containerEl;
        };
        this.plugin = plugin;
    }
    getViewType() {
        return WORK_FLOW_VIEW;
    }
    onOpen() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    onClose() {
        return __awaiter(this, void 0, void 0, function* () {
            this.root.unmount();
        });
    }
    onLoadFile(file) {
        return super.onLoadFile(file);
    }
    clear() {
        this.data = "{}";
    }
    getViewData() {
        return this.data;
    }
    updateData(data) {
        this.data = data;
        this.requestSave();
    }
    setViewData(data, clear) {
        this.contentEl.empty();
        this.data = data;
        this.root.render(React.createElement(React.StrictMode, null,
            React.createElement(SwipeableEdgeDrawer, { container: this.getContainer })));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV29ya1BhbmVsLmVudHJ5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiV29ya1BhbmVsLmVudHJ5LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFDLFlBQVksRUFBdUIsTUFBTSxVQUFVLENBQUM7QUFDNUQsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBQzVDLE9BQU8sS0FBSyxLQUFLLE1BQU0sT0FBTyxDQUFDO0FBTy9CLE9BQU8sbUJBQW1CLE1BQU0sMkJBQTJCLENBQUM7QUFHNUQsTUFBTSxDQUFDLE1BQU0sY0FBYyxHQUFHLGNBQWMsQ0FBQTtBQUU1Qzs7R0FFRztBQUNILE1BQU0sT0FBTyxjQUFlLFNBQVEsWUFBWTtJQUkvQyxZQUFZLElBQW1CLEVBQUUsTUFBc0I7UUFDdEQsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBSWIsU0FBSSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUE7UUE4Qm5DLGlCQUFZLEdBQUcsR0FBRyxFQUFFO1lBQ25CLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUN6QixDQUFDLENBQUE7UUFuQ0EsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDdEIsQ0FBQztJQUlELFdBQVc7UUFDVixPQUFPLGNBQWMsQ0FBQztJQUN2QixDQUFDO0lBRUssTUFBTTs7UUFDWixDQUFDO0tBQUE7SUFFSyxPQUFPOztZQUNaLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUE7UUFDcEIsQ0FBQztLQUFBO0lBRVEsVUFBVSxDQUFDLElBQVc7UUFDOUIsT0FBTyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCxLQUFLO1FBQ0osSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUE7SUFDakIsQ0FBQztJQUVELFdBQVc7UUFDVixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDbEIsQ0FBQztJQUVELFVBQVUsQ0FBQyxJQUFZO1FBQ3RCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBTUQsV0FBVyxDQUFDLElBQVksRUFBRSxLQUFjO1FBQ3ZDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQ2Ysb0JBQUMsS0FBSyxDQUFDLFVBQVU7WUFLaEIsb0JBQUMsbUJBQW1CLElBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxZQUFZLEdBQUksQ0FDbkMsQ0FDbkIsQ0FBQTtJQUNGLENBQUM7Q0FFRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7VGV4dEZpbGVWaWV3LCBURmlsZSwgV29ya3NwYWNlTGVhZn0gZnJvbSBcIm9ic2lkaWFuXCI7XHJcbmltcG9ydCB7Y3JlYXRlUm9vdH0gZnJvbSBcInJlYWN0LWRvbS9jbGllbnRcIjtcclxuaW1wb3J0ICogYXMgUmVhY3QgZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCBXb3JrUGFuZWxWaWV3IGZyb20gXCIuL1dvcmtQYW5lbC52aWV3XCI7XHJcbmltcG9ydCB7XHJcblx0UGx1Z2luLFxyXG59IGZyb20gJ29ic2lkaWFuJztcclxuaW1wb3J0IFdvcmtmbG93UGx1Z2luIGZyb20gXCIuLi8uLi9tYWluXCI7XHJcbmltcG9ydCBQZXJzaXN0ZW50RHJhd2VyTGVmdCBmcm9tIFwiLi4vd29ya2Zsb3cvTXlEcmF3ZXJcIjtcclxuaW1wb3J0IFN3aXBlYWJsZUVkZ2VEcmF3ZXIgZnJvbSBcIi4uL3dvcmtmbG93L015UG9wdXBEcmF3ZXJcIjtcclxuaW1wb3J0IElubmVyU3dpcGVhYmxlRWRnZURyYXdlciBmcm9tIFwiLi4vd29ya2Zsb3cvSW5uZXJEcmF3ZXJcIjtcclxuXHJcbmV4cG9ydCBjb25zdCBXT1JLX0ZMT1dfVklFVyA9ICdXb3JrRmxvd1ZpZXcnXHJcblxyXG4vKipcclxuICog5Li76aG16Z2i77yM5LuOd29ya2Zsb3fmlofku7bov5vlhaXnmoTliJ3lp4vpobXpnaJcclxuICovXHJcbmV4cG9ydCBjbGFzcyBXb3JrUGFuZWxFbnRyeSBleHRlbmRzIFRleHRGaWxlVmlldyB7XHJcblxyXG5cdHBsdWdpbjogV29ya2Zsb3dQbHVnaW47XHJcblxyXG5cdGNvbnN0cnVjdG9yKGxlYWY6IFdvcmtzcGFjZUxlYWYsIHBsdWdpbjogV29ya2Zsb3dQbHVnaW4pIHtcclxuXHRcdHN1cGVyKGxlYWYpO1xyXG5cdFx0dGhpcy5wbHVnaW4gPSBwbHVnaW47XHJcblx0fVxyXG5cclxuXHRyb290ID0gY3JlYXRlUm9vdCh0aGlzLmNvbnRhaW5lckVsKVxyXG5cclxuXHRnZXRWaWV3VHlwZSgpOiBzdHJpbmcge1xyXG5cdFx0cmV0dXJuIFdPUktfRkxPV19WSUVXO1xyXG5cdH1cclxuXHJcblx0YXN5bmMgb25PcGVuKCkge1xyXG5cdH1cclxuXHJcblx0YXN5bmMgb25DbG9zZSgpIHtcclxuXHRcdHRoaXMucm9vdC51bm1vdW50KClcclxuXHR9XHJcblxyXG5cdG92ZXJyaWRlIG9uTG9hZEZpbGUoZmlsZTogVEZpbGUpOiBQcm9taXNlPHZvaWQ+IHtcclxuXHRcdHJldHVybiBzdXBlci5vbkxvYWRGaWxlKGZpbGUpO1xyXG5cdH1cclxuXHJcblx0Y2xlYXIoKTogdm9pZCB7XHJcblx0XHR0aGlzLmRhdGEgPSBcInt9XCJcclxuXHR9XHJcblxyXG5cdGdldFZpZXdEYXRhKCk6IHN0cmluZyB7XHJcblx0XHRyZXR1cm4gdGhpcy5kYXRhO1xyXG5cdH1cclxuXHJcblx0dXBkYXRlRGF0YShkYXRhOiBzdHJpbmcpIHtcclxuXHRcdHRoaXMuZGF0YSA9IGRhdGE7XHJcblx0XHR0aGlzLnJlcXVlc3RTYXZlKCk7XHJcblx0fVxyXG5cclxuXHRnZXRDb250YWluZXIgPSAoKSA9PiB7XHJcblx0XHRyZXR1cm4gdGhpcy5jb250YWluZXJFbDtcclxuXHR9XHJcblxyXG5cdHNldFZpZXdEYXRhKGRhdGE6IHN0cmluZywgY2xlYXI6IGJvb2xlYW4pOiB2b2lkIHtcclxuXHRcdHRoaXMuY29udGVudEVsLmVtcHR5KCk7XHJcblx0XHR0aGlzLmRhdGEgPSBkYXRhO1xyXG5cdFx0dGhpcy5yb290LnJlbmRlcihcclxuXHRcdFx0PFJlYWN0LlN0cmljdE1vZGU+XHJcblx0XHRcdFx0ey8qPFdvcmtQYW5lbFZpZXcgZGF0YT17dGhpcy5kYXRhfSBzYXZlRGF0YT17KGRhdGEpID0+IHt0aGlzLnVwZGF0ZURhdGEoZGF0YSl9fSBwbHVnaW49e3RoaXMucGx1Z2lufS8+Ki99XHJcblx0XHRcdFx0ey8qPER1bW15TGlzdFZpZXcgZHVtbXlMaXN0PXtEdW1teUxpc3RNb2RlbC5uZXdJbnN0YW5jZSgpfS8+Ki99XHJcblx0XHRcdFx0ey8qPFBlcnNpc3RlbnREcmF3ZXJMZWZ0IC8+Ki99XHJcblx0XHRcdFx0ey8qPElubmVyU3dpcGVhYmxlRWRnZURyYXdlciAvPiovfVxyXG5cdFx0XHRcdDxTd2lwZWFibGVFZGdlRHJhd2VyIGNvbnRhaW5lcj17dGhpcy5nZXRDb250YWluZXJ9IC8+XHJcblx0XHRcdDwvUmVhY3QuU3RyaWN0TW9kZT5cclxuXHRcdClcclxuXHR9XHJcblxyXG59XHJcbiJdfQ==