import { __awaiter } from "tslib";
import { PluginSettingTab, Setting } from "obsidian";
import { getFolderChoices } from "./SettingHelper";
import { WorkPanelModel } from "../workpanel/WorkPanel.model";
import { WorkflowModal } from "./WorkflowModal";
export const DEFAULT_SETTINGS = {
    filePath: '/',
    scriptPath: '/',
};
export const WORKFLOW_FILE_NAME = 'Workflow.workflow';
export class WorkflowSettingTab extends PluginSettingTab {
    constructor(app, plugin) {
        super(app, plugin);
        this.plugin = plugin;
    }
    getDropdownOptions() {
        const folders = getFolderChoices(this.app);
        const pathOptions = {};
        for (const folder of folders) {
            pathOptions[folder.label] = folder.value;
        }
        return pathOptions;
    }
    createWorkflowFile() {
        let filePath = this.plugin.settings.filePath;
        if (!filePath.endsWith('/')) {
            filePath += '/';
        }
        filePath += WORKFLOW_FILE_NAME;
        this.app.vault.adapter.exists(filePath).then(exist => {
            if (exist) {
                new WorkflowModal(app, 'The workflow file has already been created. Try open the workflow panel from ribbon').open();
            }
            else {
                let workflow = WorkPanelModel.newInstance();
                this.app.vault.adapter.write(filePath, JSON.stringify(workflow));
            }
        });
    }
    display() {
        const { containerEl } = this;
        containerEl.empty();
        containerEl.createEl('h2', { text: 'Workflow settings' });
        new Setting(containerEl)
            .setName('Workflow save place')
            .setDesc('Choose the path where the workflow file is saved')
            .addDropdown(dropDown => {
            dropDown
                .addOptions(this.getDropdownOptions())
                .setValue(this.plugin.settings.filePath)
                .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.filePath = value;
                yield this.plugin.saveSettings();
            }));
        });
        new Setting(containerEl)
            .setName('Create workflow file')
            .setDesc('Create your workflow file')
            .addButton(button => {
            button
                .setButtonText('Create')
                .onClick(cb => {
                this.createWorkflowFile();
            });
        });
        new Setting(containerEl)
            .setName('Scripts storage place')
            .setDesc('Choose the path where your scripts are stored')
            .addDropdown(dropDown => {
            dropDown
                .addOptions(this.getDropdownOptions())
                .setValue(this.plugin.settings.scriptPath)
                .onChange((value) => __awaiter(this, void 0, void 0, function* () {
                this.plugin.settings.scriptPath = value;
                yield this.plugin.saveSettings();
            }));
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV29ya2Zsb3dTZXR0aW5ncy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIldvcmtmbG93U2V0dGluZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLE9BQU8sRUFBTSxnQkFBZ0IsRUFBRSxPQUFPLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFFeEQsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDakQsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLDhCQUE4QixDQUFDO0FBQzVELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQU85QyxNQUFNLENBQUMsTUFBTSxnQkFBZ0IsR0FBcUI7SUFDakQsUUFBUSxFQUFFLEdBQUc7SUFDYixVQUFVLEVBQUUsR0FBRztDQUNmLENBQUE7QUFFRCxNQUFNLENBQUMsTUFBTSxrQkFBa0IsR0FBRyxtQkFBbUIsQ0FBQTtBQUVyRCxNQUFNLE9BQU8sa0JBQW1CLFNBQVEsZ0JBQWdCO0lBSXZELFlBQVksR0FBUSxFQUFFLE1BQXNCO1FBQzNDLEtBQUssQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDbkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDdEIsQ0FBQztJQUVELGtCQUFrQjtRQUNqQixNQUFNLE9BQU8sR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDM0MsTUFBTSxXQUFXLEdBQTJCLEVBQUUsQ0FBQTtRQUM5QyxLQUFLLE1BQU0sTUFBTSxJQUFJLE9BQU8sRUFBRTtZQUM3QixXQUFXLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUE7U0FDeEM7UUFDRCxPQUFPLFdBQVcsQ0FBQztJQUNwQixDQUFDO0lBRUQsa0JBQWtCO1FBQ2pCLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQztRQUM3QyxJQUFJLENB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bSBcIm9ic2lkaWFuXCI7XHJcbmltcG9ydCBXb3JrZmxvd1BsdWdpbiBmcm9tIFwiLi4vLi4vbWFpblwiO1xyXG5pbXBvcnQge2dldEZvbGRlckNob2ljZXN9IGZyb20gXCIuL1NldHRpbmdIZWxwZXJcIjtcclxuaW1wb3J0IHtXb3JrUGFuZWxNb2RlbH0gZnJvbSBcIi4uL3dvcmtwYW5lbC9Xb3JrUGFuZWwubW9kZWxcIjtcclxuaW1wb3J0IHtXb3JrZmxvd01vZGFsfSBmcm9tIFwiLi9Xb3JrZmxvd01vZGFsXCI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFdvcmtmbG93U2V0dGluZ3Mge1xyXG5cdGZpbGVQYXRoOiBzdHJpbmc7XHJcblx0c2NyaXB0UGF0aDogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgREVGQVVMVF9TRVRUSU5HUzogV29ya2Zsb3dTZXR0aW5ncyA9IHtcclxuXHRmaWxlUGF0aDogJy8nLFxyXG5cdHNjcmlwdFBhdGg6ICcvJyxcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IFdPUktGTE9XX0ZJTEVfTkFNRSA9ICdXb3JrZmxvdy53b3JrZmxvdydcclxuXHJcbmV4cG9ydCBjbGFzcyBXb3JrZmxvd1NldHRpbmdUYWIgZXh0ZW5kcyBQbHVnaW5TZXR0aW5nVGFiIHtcclxuXHJcblx0cGx1Z2luOiBXb3JrZmxvd1BsdWdpbjtcclxuXHJcblx0Y29uc3RydWN0b3IoYXBwOiBBcHAsIHBsdWdpbjogV29ya2Zsb3dQbHVnaW4pIHtcclxuXHRcdHN1cGVyKGFwcCwgcGx1Z2luKTtcclxuXHRcdHRoaXMucGx1Z2luID0gcGx1Z2luO1xyXG5cdH1cclxuXHJcblx0Z2V0RHJvcGRvd25PcHRpb25zKCkge1xyXG5cdFx0Y29uc3QgZm9sZGVycyA9IGdldEZvbGRlckNob2ljZXModGhpcy5hcHApO1xyXG5cdFx0Y29uc3QgcGF0aE9wdGlvbnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fVxyXG5cdFx0Zm9yIChjb25zdCBmb2xkZXIgb2YgZm9sZGVycykge1xyXG5cdFx0XHRwYXRoT3B0aW9uc1tmb2xkZXIubGFiZWxdID0gZm9sZGVyLnZhbHVlXHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcGF0aE9wdGlvbnM7XHJcblx0fVxyXG5cclxuXHRjcmVhdGVXb3JrZmxvd0ZpbGUoKSB7XHJcblx0XHRsZXQgZmlsZVBhdGggPSB0aGlzLnBsdWdpbi5zZXR0aW5ncy5maWxlUGF0aDtcclxuXHRcdGlmICghZmlsZVBhdGguZW5kc1dpdGgoJy8nKSkge1xyXG5cdFx0XHRmaWxlUGF0aCArPSAnLydcclxuXHRcdH1cclxuXHRcdGZpbGVQYXRoICs9IFdPUktGTE9XX0ZJTEVfTkFNRVxyXG5cdFx0dGhpcy5hcHAudmF1bHQuYWRhcHRlci5leGlzdHMoZmlsZVBhdGgpLnRoZW4oZXhpc3QgPT4ge1xyXG5cdFx0XHRpZiAoZXhpc3QpIHtcclxuXHRcdFx0XHRuZXcgV29ya2Zsb3dNb2RhbChhcHAsICdUaGUgd29ya2Zsb3cgZmlsZSBoYXMgYWxyZWFkeSBiZWVuIGNyZWF0ZWQuIFRyeSBvcGVuIHRoZSB3b3JrZmxvdyBwYW5lbCBmcm9tIHJpYmJvbicpLm9wZW4oKVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGxldCB3b3JrZmxvdyA9IFdvcmtQYW5lbE1vZGVsLm5ld0luc3RhbmNlKCk7XHJcblx0XHRcdFx0dGhpcy5hcHAudmF1bHQuYWRhcHRlci53cml0ZShmaWxlUGF0aCwgSlNPTi5zdHJpbmdpZnkod29ya2Zsb3cpKTtcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHR9XHJcblxyXG5cdGRpc3BsYXkoKTogdm9pZCB7XHJcblx0XHRjb25zdCB7Y29udGFpbmVyRWx9ID0gdGhpcztcclxuXHRcdGNvbnRhaW5lckVsLmVtcHR5KCk7XHJcblx0XHRjb250YWluZXJFbC5jcmVhdGVFbCgnaDInLCB7dGV4dDogJ1dvcmtmbG93IHNldHRpbmdzJ30pO1xyXG5cclxuXHRcdG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG5cdFx0XHQuc2V0TmFtZSgnV29ya2Zsb3cgc2F2ZSBwbGFjZScpXHJcblx0XHRcdC5zZXREZXNjKCdDaG9vc2UgdGhlIHBhdGggd2hlcmUgdGhlIHdvcmtmbG93IGZpbGUgaXMgc2F2ZWQnKVxyXG5cdFx0XHQuYWRkRHJvcGRvd24oZHJvcERvd24gPT4ge1xyXG5cdFx0XHRcdGRyb3BEb3duXHJcblx0XHRcdFx0XHQuYWRkT3B0aW9ucyh0aGlzLmdldERyb3Bkb3duT3B0aW9ucygpKVxyXG5cdFx0XHRcdFx0LnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmZpbGVQYXRoKVxyXG5cdFx0XHRcdFx0Lm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xyXG5cdFx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy5maWxlUGF0aCA9IHZhbHVlO1xyXG5cdFx0XHRcdFx0XHRhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcclxuXHRcdFx0XHRcdH0pXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxyXG5cdFx0XHQuc2V0TmFtZSgnQ3JlYXRlIHdvcmtmbG93IGZpbGUnKVxyXG5cdFx0XHQuc2V0RGVzYygnQ3JlYXRlIHlvdXIgd29ya2Zsb3cgZmlsZScpXHJcblx0XHRcdC5hZGRCdXR0b24oYnV0dG9uID0+IHtcclxuXHRcdFx0XHRidXR0b25cclxuXHRcdFx0XHRcdC5zZXRCdXR0b25UZXh0KCdDcmVhdGUnKVxyXG5cdFx0XHRcdFx0Lm9uQ2xpY2soY2IgPT4ge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmNyZWF0ZVdvcmtmbG93RmlsZSgpXHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRuZXcgU2V0dGluZyhjb250YWluZXJFbClcclxuXHRcdFx0LnNldE5hbWUoJ1NjcmlwdHMgc3RvcmFnZSBwbGFjZScpXHJcblx0XHRcdC5zZXREZXNjKCdDaG9vc2UgdGhlIHBhdGggd2hlcmUgeW91ciBzY3JpcHRzIGFyZSBzdG9yZWQnKVxyXG5cdFx0XHQuYWRkRHJvcGRvd24oZHJvcERvd24gPT4ge1xyXG5cdFx0XHRcdGRyb3BEb3duXHJcblx0XHRcdFx0XHQuYWRkT3B0aW9ucyh0aGlzLmdldERyb3Bkb3duT3B0aW9ucygpKVxyXG5cdFx0XHRcdFx0LnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLnNjcmlwdFBhdGgpXHJcblx0XHRcdFx0XHQub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XHJcblx0XHRcdFx0XHRcdHRoaXMucGx1Z2luLnNldHRpbmdzLnNjcmlwdFBhdGggPSB2YWx1ZTtcclxuXHRcdFx0XHRcdFx0YXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHR9KTtcclxuXHR9XHJcbn1cclxuIl19