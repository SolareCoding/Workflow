import Box from "@mui/material/Box";
import { Divider, Typography } from "@mui/material";
import * as React from "react";
import { useContext, useState } from "react";
import { PipelineModel } from "../pipeline/Pipeline.model";
import { NodeStatusEnum } from "../nodes/NodeStatus.enum";
import { TimeUtils } from "../utils/Time.utils";
import NewPipelineDialog from "./NewPipelineDialog.view";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import { WorkPanelContext } from "../workpanel/WorkPanel.view";
import { UpdateMode } from "../workpanel/WorkPanel.controller";
import AddCircleIcon from '@mui/icons-material/AddCircle';
/**
 * A workflow kanban consists
 * @constructor
 */
export default function WorkflowKanbanView(props) {
    const { editorMode, kanbanTitle, sectionPipelines, selectedPipeline, templates, selectPipeline, subjects } = props;
    const [openDialog, setOpenDialog] = useState(false);
    const [pendingCollapse, setPendingCollapse] = useState(true);
    const [workingCollapse, setWorkingCollapse] = useState(true);
    const [doneCollapse, setDoneCollapse] = useState(true);
    const [preSelectedTemplate, setPreSelectedTemplate] = useState(null);
    const [preSetWorkflowName, setPreSetWorkflowName] = useState(null);
    const workPanelController = useContext(WorkPanelContext);
    const getProgress = (pipeline) => {
        let totalNodes = 0;
        let doneNodes = 0;
        for (const section of pipeline.sections) {
            for (const sectionElement of section.nodes) {
                totalNodes++;
                if (sectionElement.status == NodeStatusEnum.DONE) {
                    doneNodes++;
                }
            }
        }
        return doneNodes + '/' + totalNodes;
    };
    const openNewPipelineDialog = () => {
        setPreSelectedTemplate(null);
        setPreSetWorkflowName(null);
        setOpenDialog(true);
    };
    const closeNewPipelineDialog = () => {
        setOpenDialog(false);
    };
    // show a dialog for user to choose a template, and add it to the current Kanban
    const handleCreateNewPipeline = (pipeline) => {
        setOpenDialog(false);
        selectPipeline(pipeline);
        workPanelController.updatePipeline(pipeline, UpdateMode.ADD);
    };
    const handleCreateNewTemplate = () => {
        const newTemplatePipeline = PipelineModel.newInstance();
        selectPipeline(newTemplatePipeline);
        workPanelController.updatePipeline(newTemplatePipeline, UpdateMode.ADD);
    };
    const addNewView = React.createElement(Box, { className: 'workflow-accent', sx: { width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }, onClick: () => {
            !editorMode ? openNewPipelineDialog() : handleCreateNewTemplate();
        } },
        React.createElement(AddCircleIcon, null),
        React.createElement(Typography, { variant: "body1" }, !editorMode ? 'Add a new pipeline' : 'Add a new template'));
    const getFoldStatus = (sectionName) => {
        switch (sectionName) {
            case NodeStatusEnum.PENDING:
                return pendingCollapse;
            case NodeStatusEnum.WORKING:
                return workingCollapse;
            case NodeStatusEnum.DONE:
                return doneCollapse;
            default:
                return true;
        }
    };
    const setFoldStatus = (sectionName) => {
        switch (sectionName) {
            case NodeStatusEnum.PENDING:
                setPendingCollapse(!pendingCollapse);
                break;
            case NodeStatusEnum.WORKING:
                setWorkingCollapse(!workingCollapse);
                break;
            case NodeStatusEnum.DONE:
                setDoneCollapse(!doneCollapse);
                break;
            default:
                break;
        }
    };
    const getExtraInfoView = (pipeline) => {
        if (!editorMode) {
            return React.createElement(Typography, { variant: "body2", sx: { fontWeight: '600', color: "#336666" } }, getProgress(pipeline));
        }
        else {
            return React.createElement(AddCircleIcon, { onClick: () => {
                    setPreSelectedTemplate(pipeline);
                    setPreSetWorkflowName(`${pipeline.title} - ${TimeUtils.getDateStr(Date.now())}`);
                    setOpenDialog(true);
                    return true;
                } });
        }
    };
    const getPipelineKanbanItems = () => {
        const menuItemViews = [];
        menuItemViews.push(React.createElement(ListItemButton, { key: 'add new' }, addNewView));
        for (const sectionPipeline of sectionPipelines) {
            const { sectionName, pipelines } = sectionPipeline;
            // create a new fordable item
            menuItemViews.push(React.createElement(ListItemButton, { key: 'section-' + sectionName, onClick: () => { setFoldStatus(sectionName); } },
                React.createElement(ListItemText, { primary: sectionName }),
                getFoldStatus(sectionName) ? React.createElement(ExpandLess, null) : React.createElement(ExpandMore, null)));
            const sectionItemViews = [];
            for (const pipeline of pipelines) {
                sectionItemViews.push(React.createElement(ListItemButton, { sx: { pl: 4 }, key: pipeline.id },
                    React.createElement(Box, { className: selectedPipeline == pipeline ? 'workflow-container-inner-accent-border' : 'workflow-container-inner', sx: { width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', id: pipeline.id }, onClick: () => {
                            selectPipeline(pipeline);
                        } },
                        React.createElement(Typography, { variant: "body2" }, pipeline.title),
                        React.createElement(Box, { sx: { width: 110, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' } },
                            React.createElement(Typography, { variant: "body2" }, TimeUtils.getDateTimeStr(pipeline.createTime)),
                            getExtraInfoView(pipeline)))));
            }
            menuItemViews.push(React.createElement(Collapse, { key: 'collapse-' + sectionName, in: getFoldStatus(sectionName), timeout: "auto", unmountOnExit: true },
                React.createElement(List, { component: "div", disablePadding: true, dense: true }, sectionItemViews)));
        }
        return menuItemViews;
    };
    const getListView = () => {
        return (React.createElement(List, { sx: { width: '100%', maxWidth: 360 }, component: "nav", "aria-labelledby": "nested-list-subheader", dense: true }, getPipelineKanbanItems()));
    };
    return (React.createElement("div", { style: { width: 300, height: '100%', overflowY: 'scroll' } },
        React.createElement(Typography, { variant: "h5", gutterBottom: true }, 'Kanban: ' + kanbanTitle),
        React.createElement(Divider, null),
        getListView(),
        React.createElement(NewPipelineDialog, { templates: templates, open: openDialog, closeDialog: closeNewPipelineDialog, createNewTask: handleCreateNewPipeline, subjects: subjects, preSelectedTemplate: preSelectedTemplate, preSetWorkflowName: preSetWorkflowName })));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV29ya2Zsb3dLYW5iYW4udmlldy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIldvcmtmbG93S2FuYmFuLnZpZXcudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sR0FBRyxNQUFNLG1CQUFtQixDQUFDO0FBQ3BDLE9BQU8sRUFBQyxPQUFPLEVBQUUsVUFBVSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ2xELE9BQU8sS0FBSyxLQUFLLE1BQU0sT0FBTyxDQUFDO0FBQy9CLE9BQU8sRUFBQyxVQUFVLEVBQUUsUUFBUSxFQUFDLE1BQU0sT0FBTyxDQUFDO0FBQzNDLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSw0QkFBNEIsQ0FBQztBQUN6RCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDeEQsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQzlDLE9BQU8saUJBQWlCLE1BQU0sMEJBQTBCLENBQUM7QUFDekQsT0FBTyxJQUFJLE1BQU0sb0JBQW9CLENBQUM7QUFDdEMsT0FBTyxjQUFjLE1BQU0sOEJBQThCLENBQUM7QUFDMUQsT0FBTyxZQUFZLE1BQU0sNEJBQTRCLENBQUM7QUFDdEQsT0FBTyxVQUFVLE1BQU0sZ0NBQWdDLENBQUM7QUFDeEQsT0FBTyxVQUFVLE1BQU0sZ0NBQWdDLENBQUM7QUFDeEQsT0FBTyxRQUFRLE1BQU0sd0JBQXdCLENBQUM7QUFDOUMsT0FBTyxFQUFDLGdCQUFnQixFQUFDLE1BQU0sNkJBQTZCLENBQUM7QUFDN0QsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLG1DQUFtQyxDQUFDO0FBRTdELE9BQU8sYUFBYSxNQUFNLCtCQUErQixDQUFDO0FBaUIxRDs7O0dBR0c7QUFDSCxNQUFNLENBQUMsT0FBTyxVQUFVLGtCQUFrQixDQUFDLEtBQTBCO0lBRXBFLE1BQU0sRUFBQyxVQUFVLEVBQUUsV0FBVyxFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFLFNBQVMsRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLEdBQUcsS0FBSyxDQUFBO0lBQ2pILE1BQU0sQ0FBQyxVQUFVLEVBQUUsYUFBYSxDQUFDLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3BELE1BQU0sQ0FBQyxlQUFlLEVBQUUsa0JBQWtCLENBQUMsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDN0QsTUFBTSxDQUFDLGVBQWUsRUFBRSxrQkFBa0IsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM3RCxNQUFNLENBQUMsWUFBWSxFQUFFLGVBQWUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN2RCxNQUFNLENBQUMsbUJBQW1CLEVBQUUsc0JBQXNCLENBQUMsR0FBRyxRQUFRLENBQXVCLElBQUksQ0FBQyxDQUFBO0lBQzFGLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxxQkFBcUIsQ0FBQyxHQUFHLFFBQVEsQ0FBaUIsSUFBSSxDQUFDLENBQUE7SUFFbEYsTUFBTSxtQkFBbUIsR0FBRyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtJQUV4RCxNQUFNLFdBQVcsR0FBRyxDQUFDLFFBQXVCLEVBQUUsRUFBRTtRQUMvQyxJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7UUFDbkIsSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO1FBQ2xCLEtBQUssTUFBTSxPQUFPLElBQUksUUFBUSxDQUFDLFFBQVEsRUFBRTtZQUN4QyxLQUFLLE1BQU0sY0FBYyxJQUFJLE9BQU8sQ0FBQyxLQUFLLEVBQUU7Z0JBQzNDLFVBQVUsRUFBRyxDQUFBO2dCQUNiLElBQUksY0FBYyxDQUFDLE1BQU0sSUFBSSxjQUFjLENBQUMsSUFBSSxFQUFFO29CQUNqRCxTQUFTLEVBQUcsQ0FBQTtpQkFDWjthQUNEO1NBQ0Q7UUFDRCxPQUFPLFNBQVMsR0FBRyxHQUFHLEdBQUcsVUFBVSxDQUFBO0lBQ3BDLENBQUMsQ0FBQTtJQUVELE1BQU0scUJBQXFCLEdBQUcsR0FBRyxFQUFFO1FBQ2xDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxDQUFBO1FBQzVCLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFBO1FBQzNCLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNyQixDQUFDLENBQUE7SUFFRCxNQUFNLHNCQUFzQixHQUFHLEdBQUcsRUFBRTtRQUNuQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdEIsQ0FBQyxDQUFBO0lBRUQsZ0ZBQWdGO0lBQ2hGLE1BQU0sdUJBQXVCLEdBQUcsQ0FBQyxRQUF1QixFQUFFLEVBQUU7UUFDM0QsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JCLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUN4QixtQkFBbUIsQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQTtJQUM3RCxDQUFDLENBQUE7SUFFRCxNQUFNLHVCQUF1QixHQUFHLEdBQUcsRUFBRTtRQUNwQyxNQUFNLG1CQUFtQixHQUFHLGFBQWEsQ0FBQyxXQUFXLEVBQUUsQ0FBQTtRQUN2RCxjQUFjLENBQUMsbUJBQW1CLENBQUMsQ0FBQTtRQUNuQyxtQkFBbUIsQ0FBQyxjQUFjLENBQUMsbUJBQW1CLEVBQUUsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQ3hFLENBQUMsQ0FBQTtJQUVELE1BQU0sVUFBVSxHQUFHLG9CQUFDLEdBQUcsSUFBQyxTQUFTLEVBQUMsaUJBQWlCLEVBQUMsRUFBRSxFQUFFLEVBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUMsUUFBUSxFQUFDLEVBQUUsT0FBTyxFQUFFLEdBQUUsRUFBRTtZQUMxSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxDQUFDLENBQUMsdUJBQXVCLEVBQUUsQ0FBQTtRQUNsRSxDQUFDO1FBQ0Esb0JBQUMsYUFBYSxPQUFHO1FBQ2pCLG9CQUFDLFVBQVUsSUFBQyxPQUFPLEVBQUMsT0FBTyxJQUN4QixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLG9CQUFvQixDQUMvQyxDQUNSLENBQUE7SUFFUCxNQUFNLGFBQWEsR0FBRyxDQUFDLFdBQW1CLEVBQUUsRUFBRTtRQUM3QyxRQUFRLFdBQVcsRUFBRTtZQUNwQixLQUFLLGNBQWMsQ0FBQyxPQUFPO2dCQUMxQixPQUFPLGVBQWUsQ0FBQTtZQUN2QixLQUFLLGNBQWMsQ0FBQyxPQUFPO2dCQUMxQixPQUFPLGVBQWUsQ0FBQTtZQUN2QixLQUFLLGNBQWMsQ0FBQyxJQUFJO2dCQUN2QixPQUFPLFlBQVksQ0FBQTtZQUNwQjtnQkFDQyxPQUFPLElBQUksQ0FBQTtTQUNaO0lBQ0YsQ0FBQyxDQUFBO0lBRUQsTUFBTSxhQUFhLEdBQUcsQ0FBQyxXQUFtQixFQUFFLEVBQUU7UUFDN0MsUUFBUSxXQUFXLEVBQUU7WUFDcEIsS0FBSyxjQUFjLENBQUMsT0FBTztnQkFDMUIsa0JBQWtCLENBQUMsQ0FBQyxlQUFlLENBQUMsQ0FBQTtnQkFDcEMsTUFBSztZQUNOLEtBQUssY0FBYyxDQUFDLE9BQU87Z0JBQzFCLGtCQUFrQixDQUFDLENBQUMsZUFBZSxDQUFDLENBQUE7Z0JBQ3BDLE1BQUs7WUFDTixLQUFLLGNBQWMsQ0FBQyxJQUFJO2dCQUN2QixlQUFlLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQTtnQkFDOUIsTUFBSztZQUNOO2dCQUNDLE1BQUs7U0FDTjtJQUNGLENBQUMsQ0FBQTtJQUVELE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxRQUF1QixFQUFFLEVBQUU7UUFDcEQsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNoQixPQUFPLG9CQUFDLFVBQVUsSUFBQyxPQUFPLEVBQUMsT0FBTyxFQUFDLEVBQUUsRUFBRSxFQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBQyxJQUMxRSxXQUFXLENBQUMsUUFBUSxDQUFDLENBQ1YsQ0FBQTtTQUNiO2FBQU07WUFDTixPQUFPLG9CQUFDLGFBQWEsSUFBQyxPQUFPLEVBQUUsR0FBRyxFQUFFO29CQUNuQyxzQkFBc0IsQ0FBQyxRQUFRLENBQUMsQ0FBQTtvQkFDaEMscUJBQXFCLENBQUMsR0FBRyxRQUFRLENBQUMsS0FBSyxNQUFNLFNBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFBO29CQUNoRixhQUFhLENBQUMsSUFBSSxDQUFDLENBQUE7b0JBQ25CLE9BQU8sSUFBSSxDQUFBO2dCQUNaLENBQUMsR0FBSSxDQUFBO1NBQ0w7SUFDRixDQUFDLENBQUE7SUFFRCxNQUFNLHNCQUFzQixHQUFHLEdBQUcsRUFBRTtRQUNuQyxNQUFNLGFBQWEsR0FBRyxFQUFFLENBQUE7UUFDeEIsYUFBYSxDQUFDLElBQUksQ0FDakIsb0JBQUMsY0FBYyxJQUFDLEdBQUcsRUFBRSxTQUFTLElBQzVCLFVBQVUsQ0FDSyxDQUFDLENBQUE7UUFDbkIsS0FBSyxNQUFNLGVBQWUsSUFBSSxnQkFBZ0IsRUFBRTtZQUMvQyxNQUFNLEVBQUMsV0FBVyxFQUFFLFNBQVMsRUFBQyxHQUFHLGVBQWUsQ0FBQTtZQUNoRCw2QkFBNkI7WUFDN0IsYUFBYSxDQUFDLElBQUksQ0FDakIsb0JBQUMsY0FBYyxJQUFDLEdBQUcsRUFBRSxVQUFVLEdBQUcsV0FBVyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsR0FBRSxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUEsQ0FBQSxDQUFDO2dCQUN6RixvQkFBQyxZQUFZLElBQUMsT0FBTyxFQUFFLFdBQVcsR0FBSTtnQkFDckMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxvQkFBQyxVQUFVLE9BQUcsQ0FBQyxDQUFDLENBQUMsb0JBQUMsVUFBVSxPQUFHLENBQzdDLENBQ2pCLENBQUE7WUFDRCxNQUFNLGdCQUFnQixHQUFHLEVBQUUsQ0FBQTtZQUMzQixLQUFLLE1BQU0sUUFBUSxJQUFJLFNBQVMsRUFBRTtnQkFDakMsZ0JBQWdCLENBQUMsSUFBSSxDQUNwQixvQkFBQyxjQUFjLElBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxRQUFRLENBQUMsRUFBRTtvQkFDOUMsb0JBQUMsR0FBRyxJQUFDLFNBQVMsRUFBRyxnQkFBZ0IsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLHdDQUF3QyxDQUFDLENBQUMsQ0FBQywwQkFBMEIsRUFBRSxFQUFFLEVBQUUsRUFBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLGNBQWMsRUFBRSxlQUFlLEVBQUUsRUFBRSxFQUFFLFFBQVEsQ0FBQyxFQUFFLEVBQUMsRUFBRSxPQUFPLEVBQUUsR0FBRSxFQUFFOzRCQUN2USxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUE7d0JBQUEsQ0FBQzt3QkFDekIsb0JBQUMsVUFBVSxJQUFDLE9BQU8sRUFBQyxPQUFPLElBQ3pCLFFBQVEsQ0FBQyxLQUFLLENBQ0g7d0JBQ2Isb0JBQUMsR0FBRyxJQUFDLEVBQUUsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBRSxlQUFlLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBQzs0QkFDbEgsb0JBQUMsVUFBVSxJQUFDLE9BQU8sRUFBQyxPQUFPLElBQ3pCLFNBQVMsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUNsQzs0QkFDWCxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FDdkIsQ0FDRCxDQUNVLENBQ2pCLENBQUE7YUFDRDtZQUNELGFBQWEsQ0FBQyxJQUFJLENBQ2pCLG9CQUFDLFFBQVEsSUFBQyxHQUFHLEVBQUUsV0FBVyxHQUFHLFdBQVcsRUFBRSxFQUFFLEVBQUUsYUFBYSxDQUFDLFdBQVcsQ0FBQyxFQUFFLE9BQU8sRUFBQyxNQUFNLEVBQUMsYUFBYTtnQkFDckcsb0JBQUMsSUFBSSxJQUFDLFNBQVMsRUFBQyxLQUFLLEVBQUMsY0FBYyxRQUFDLEtBQUssRUFBSSxJQUFJLElBQ2hELGdCQUFnQixDQUNYLENBQ0csQ0FDWCxDQUFDO1NBQ0Y7UUFDRCxPQUFPLGFBQWEsQ0FBQTtJQUNyQixDQUFDLENBQUE7SUFFRCxNQUFNLFdBQVcsR0FBRyxHQUFHLEVBQUU7UUFDeEIsT0FBTyxDQUNOLG9CQUFDLElBQUksSUFDSixFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUUsRUFDcEMsU0FBUyxFQUFDLEtBQUsscUJBQ0MsdUJBQXVCLEVBQ3ZDLEtBQUssRUFBSSxJQUFJLElBRVosc0JBQXNCLEVBQUUsQ0FDbkIsQ0FDUCxDQUFDO0lBQ0gsQ0FBQyxDQUFBO0lBRUQsT0FBTyxDQUNOLDZCQUFLLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFDO1FBQzVELG9CQUFDLFVBQVUsSUFBQyxPQUFPLEVBQUMsSUFBSSxFQUFDLFlBQVksVUFDbkMsVUFBVSxHQUFHLFdBQVcsQ0FDYjtRQUNiLG9CQUFDLE9BQU8sT0FBRTtRQUNULFdBQVcsRUFBRTtRQUNkLG9CQUFDLGlCQUFpQixJQUNqQixTQUFTLEVBQUUsU0FBUyxFQUNwQixJQUFJLEVBQUUsVUFBVSxFQUNoQixXQUFXLEVBQUUsc0JBQXNCLEVBQ25DLGFBQWEsRUFBRSx1QkFBdUIsRUFDdEMsUUFBUSxFQUFFLFFBQVEsRUFDbEIsbUJBQW1CLEVBQUUsbUJBQW1CLEVBQ3hDLGtCQUFrQixFQUFFLGtCQUFrQixHQUNyQyxDQUNHLENBQ04sQ0FBQztBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQm94IGZyb20gXCJAbXVpL21hdGVyaWFsL0JveFwiO1xyXG5pbXBvcnQge0RpdmlkZXIsIFR5cG9ncmFwaHl9IGZyb20gXCJAbXVpL21hdGVyaWFsXCI7XHJcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQge3VzZUNvbnRleHQsIHVzZVN0YXRlfSBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHtQaXBlbGluZU1vZGVsfSBmcm9tIFwiLi4vcGlwZWxpbmUvUGlwZWxpbmUubW9kZWxcIjtcclxuaW1wb3J0IHtOb2RlU3RhdHVzRW51bX0gZnJvbSBcIi4uL25vZGVzL05vZGVTdGF0dXMuZW51bVwiO1xyXG5pbXBvcnQge1RpbWVVdGlsc30gZnJvbSBcIi4uL3V0aWxzL1RpbWUudXRpbHNcIjtcclxuaW1wb3J0IE5ld1BpcGVsaW5lRGlhbG9nIGZyb20gXCIuL05ld1BpcGVsaW5lRGlhbG9nLnZpZXdcIjtcclxuaW1wb3J0IExpc3QgZnJvbSBcIkBtdWkvbWF0ZXJpYWwvTGlzdFwiO1xyXG5pbXBvcnQgTGlzdEl0ZW1CdXR0b24gZnJvbSBcIkBtdWkvbWF0ZXJpYWwvTGlzdEl0ZW1CdXR0b25cIjtcclxuaW1wb3J0IExpc3RJdGVtVGV4dCBmcm9tIFwiQG11aS9tYXRlcmlhbC9MaXN0SXRlbVRleHRcIjtcclxuaW1wb3J0IEV4cGFuZExlc3MgZnJvbSBcIkBtdWkvaWNvbnMtbWF0ZXJpYWwvRXhwYW5kTGVzc1wiO1xyXG5pbXBvcnQgRXhwYW5kTW9yZSBmcm9tIFwiQG11aS9pY29ucy1tYXRlcmlhbC9FeHBhbmRNb3JlXCI7XHJcbmltcG9ydCBDb2xsYXBzZSBmcm9tIFwiQG11aS9tYXRlcmlhbC9Db2xsYXBzZVwiO1xyXG5pbXBvcnQge1dvcmtQYW5lbENvbnRleHR9IGZyb20gXCIuLi93b3JrcGFuZWwvV29ya1BhbmVsLnZpZXdcIjtcclxuaW1wb3J0IHtVcGRhdGVNb2RlfSBmcm9tIFwiLi4vd29ya3BhbmVsL1dvcmtQYW5lbC5jb250cm9sbGVyXCI7XHJcbmltcG9ydCB7U3ViamVjdE1vZGVsfSBmcm9tIFwiLi4vc3ViamVjdC9TdWJqZWN0Lm1vZGVsXCI7XHJcbmltcG9ydCBBZGRDaXJjbGVJY29uIGZyb20gJ0BtdWkvaWNvbnMtbWF0ZXJpYWwvQWRkQ2lyY2xlJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgU2VjdGlvblBpcGVsaW5lcyB7XHJcblx0c2VjdGlvbk5hbWU6IHN0cmluZztcclxuXHRwaXBlbGluZXM6IFBpcGVsaW5lTW9kZWxbXTtcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBXb3JrZmxvd0thbmJhblByb3BzIHtcclxuXHRlZGl0b3JNb2RlPzogYm9vbGVhbixcclxuXHRrYW5iYW5UaXRsZTogc3RyaW5nLFxyXG5cdHNlY3Rpb25QaXBlbGluZXM6IFNlY3Rpb25QaXBlbGluZXNbXSxcclxuXHR0ZW1wbGF0ZXM6IFBpcGVsaW5lTW9kZWxbXSxcclxuXHRzdWJqZWN0czogU3ViamVjdE1vZGVsW10sXHJcblx0c2VsZWN0ZWRQaXBlbGluZT86IFBpcGVsaW5lTW9kZWwsXHJcblx0c2VsZWN0UGlwZWxpbmU6IChwaXBlbGluZTogUGlwZWxpbmVNb2RlbCkgPT4gdm9pZCxcclxufVxyXG5cclxuLyoqXHJcbiAqIEEgd29ya2Zsb3cga2FuYmFuIGNvbnNpc3RzXHJcbiAqIEBjb25zdHJ1Y3RvclxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gV29ya2Zsb3dLYW5iYW5WaWV3KHByb3BzOiBXb3JrZmxvd0thbmJhblByb3BzKSB7XHJcblxyXG5cdGNvbnN0IHtlZGl0b3JNb2RlLCBrYW5iYW5UaXRsZSwgc2VjdGlvblBpcGVsaW5lcywgc2VsZWN0ZWRQaXBlbGluZSwgdGVtcGxhdGVzLCBzZWxlY3RQaXBlbGluZSwgc3ViamVjdHMgfSA9IHByb3BzXHJcblx0Y29uc3QgW29wZW5EaWFsb2csIHNldE9wZW5EaWFsb2ddID0gdXNlU3RhdGUoZmFsc2UpO1xyXG5cdGNvbnN0IFtwZW5kaW5nQ29sbGFwc2UsIHNldFBlbmRpbmdDb2xsYXBzZV0gPSB1c2VTdGF0ZSh0cnVlKTtcclxuXHRjb25zdCBbd29ya2luZ0NvbGxhcHNlLCBzZXRXb3JraW5nQ29sbGFwc2VdID0gdXNlU3RhdGUodHJ1ZSk7XHJcblx0Y29uc3QgW2RvbmVDb2xsYXBzZSwgc2V0RG9uZUNvbGxhcHNlXSA9IHVzZVN0YXRlKHRydWUpO1xyXG5cdGNvbnN0IFtwcmVTZWxlY3RlZFRlbXBsYXRlLCBzZXRQcmVTZWxlY3RlZFRlbXBsYXRlXSA9IHVzZVN0YXRlPFBpcGVsaW5lTW9kZWwgfCBudWxsPihudWxsKVxyXG5cdGNvbnN0IFtwcmVTZXRXb3JrZmxvd05hbWUsIHNldFByZVNldFdvcmtmbG93TmFtZV0gPSB1c2VTdGF0ZTxzdHJpbmcgfCBudWxsID4obnVsbClcclxuXHJcblx0Y29uc3Qgd29ya1BhbmVsQ29udHJvbGxlciA9IHVzZUNvbnRleHQoV29ya1BhbmVsQ29udGV4dClcclxuXHJcblx0Y29uc3QgZ2V0UHJvZ3Jlc3MgPSAocGlwZWxpbmU6IFBpcGVsaW5lTW9kZWwpID0+IHtcclxuXHRcdGxldCB0b3RhbE5vZGVzID0gMDtcclxuXHRcdGxldCBkb25lTm9kZXMgPSAwO1xyXG5cdFx0Zm9yIChjb25zdCBzZWN0aW9uIG9mIHBpcGVsaW5lLnNlY3Rpb25zKSB7XHJcblx0XHRcdGZvciAoY29uc3Qgc2VjdGlvbkVsZW1lbnQgb2Ygc2VjdGlvbi5ub2Rlcykge1xyXG5cdFx0XHRcdHRvdGFsTm9kZXMgKytcclxuXHRcdFx0XHRpZiAoc2VjdGlvbkVsZW1lbnQuc3RhdHVzID09IE5vZGVTdGF0dXNFbnVtLkRPTkUpIHtcclxuXHRcdFx0XHRcdGRvbmVOb2RlcyArK1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGRvbmVOb2RlcyArICcvJyArIHRvdGFsTm9kZXNcclxuXHR9XHJcblxyXG5cdGNvbnN0IG9wZW5OZXdQaXBlbGluZURpYWxvZyA9ICgpID0+IHtcclxuXHRcdHNldFByZVNlbGVjdGVkVGVtcGxhdGUobnVsbClcclxuXHRcdHNldFByZVNldFdvcmtmbG93TmFtZShudWxsKVxyXG5cdFx0c2V0T3BlbkRpYWxvZyh0cnVlKTtcclxuXHR9XHJcblxyXG5cdGNvbnN0IGNsb3NlTmV3UGlwZWxpbmVEaWFsb2cgPSAoKSA9PiB7XHJcblx0XHRzZXRPcGVuRGlhbG9nKGZhbHNlKTtcclxuXHR9XHJcblxyXG5cdC8vIHNob3cgYSBkaWFsb2cgZm9yIHVzZXIgdG8gY2hvb3NlIGEgdGVtcGxhdGUsIGFuZCBhZGQgaXQgdG8gdGhlIGN1cnJlbnQgS2FuYmFuXHJcblx0Y29uc3QgaGFuZGxlQ3JlYXRlTmV3UGlwZWxpbmUgPSAocGlwZWxpbmU6IFBpcGVsaW5lTW9kZWwpID0+IHtcclxuXHRcdHNldE9wZW5EaWFsb2coZmFsc2UpO1xyXG5cdFx0c2VsZWN0UGlwZWxpbmUocGlwZWxpbmUpXHJcblx0XHR3b3JrUGFuZWxDb250cm9sbGVyLnVwZGF0ZVBpcGVsaW5lKHBpcGVsaW5lLCBVcGRhdGVNb2RlLkFERClcclxuXHR9XHJcblxyXG5cdGNvbnN0IGhhbmRsZUNyZWF0ZU5ld1RlbXBsYXRlID0gKCkgPT4ge1xyXG5cdFx0Y29uc3QgbmV3VGVtcGxhdGVQaXBlbGluZSA9IFBpcGVsaW5lTW9kZWwubmV3SW5zdGFuY2UoKVxyXG5cdFx0c2VsZWN0UGlwZWxpbmUobmV3VGVtcGxhdGVQaXBlbGluZSlcclxuXHRcdHdvcmtQYW5lbENvbnRyb2xsZXIudXBkYXRlUGlwZWxpbmUobmV3VGVtcGxhdGVQaXBlbGluZSwgVXBkYXRlTW9kZS5BREQpXHJcblx0fVxyXG5cclxuXHRjb25zdCBhZGROZXdWaWV3ID0gPEJveCBjbGFzc05hbWU9J3dvcmtmbG93LWFjY2VudCcgc3g9e3t3aWR0aDogJzEwMCUnLCBkaXNwbGF5OiAnZmxleCcsIGZsZXhEaXJlY3Rpb246ICdyb3cnLCBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsIGFsaWduSXRlbXM6J2NlbnRlcid9fSBvbkNsaWNrPXsoKT0+e1xyXG5cdFx0XHQhZWRpdG9yTW9kZSA/IG9wZW5OZXdQaXBlbGluZURpYWxvZygpIDogaGFuZGxlQ3JlYXRlTmV3VGVtcGxhdGUoKVxyXG5cdFx0fX0+XHJcblx0XHRcdDxBZGRDaXJjbGVJY29uIC8+XHJcblx0XHRcdDxUeXBvZ3JhcGh5IHZhcmlhbnQ9XCJib2R5MVwiPlxyXG5cdFx0XHRcdHsgIWVkaXRvck1vZGUgPyAnQWRkIGEgbmV3IHBpcGVsaW5lJyA6ICdBZGQgYSBuZXcgdGVtcGxhdGUnIH1cclxuXHRcdFx0PC9UeXBvZ3JhcGh5PlxyXG5cdFx0PC9Cb3g+XHJcblxyXG5cdGNvbnN0IGdldEZvbGRTdGF0dXMgPSAoc2VjdGlvbk5hbWU6IHN0cmluZykgPT4ge1xyXG5cdFx0c3dpdGNoIChzZWN0aW9uTmFtZSkge1xyXG5cdFx0XHRjYXNlIE5vZGVTdGF0dXNFbnVtLlBFTkRJTkc6XHJcblx0XHRcdFx0cmV0dXJuIHBlbmRpbmdDb2xsYXBzZVxyXG5cdFx0XHRjYXNlIE5vZGVTdGF0dXNFbnVtLldPUktJTkc6XHJcblx0XHRcdFx0cmV0dXJuIHdvcmtpbmdDb2xsYXBzZVxyXG5cdFx0XHRjYXNlIE5vZGVTdGF0dXNFbnVtLkRPTkU6XHJcblx0XHRcdFx0cmV0dXJuIGRvbmVDb2xsYXBzZVxyXG5cdFx0XHRkZWZhdWx0OlxyXG5cdFx0XHRcdHJldHVybiB0cnVlXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRjb25zdCBzZXRGb2xkU3RhdHVzID0gKHNlY3Rpb25OYW1lOiBzdHJpbmcpID0+IHtcclxuXHRcdHN3aXRjaCAoc2VjdGlvbk5hbWUpIHtcclxuXHRcdFx0Y2FzZSBOb2RlU3RhdHVzRW51bS5QRU5ESU5HOlxyXG5cdFx0XHRcdHNldFBlbmRpbmdDb2xsYXBzZSghcGVuZGluZ0NvbGxhcHNlKVxyXG5cdFx0XHRcdGJyZWFrXHJcblx0XHRcdGNhc2UgTm9kZVN0YXR1c0VudW0uV09SS0lORzpcclxuXHRcdFx0XHRzZXRXb3JraW5nQ29sbGFwc2UoIXdvcmtpbmdDb2xsYXBzZSlcclxuXHRcdFx0XHRicmVha1xyXG5cdFx0XHRjYXNlIE5vZGVTdGF0dXNFbnVtLkRPTkU6XHJcblx0XHRcdFx0c2V0RG9uZUNvbGxhcHNlKCFkb25lQ29sbGFwc2UpXHJcblx0XHRcdFx0YnJlYWtcclxuXHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRicmVha1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Y29uc3QgZ2V0RXh0cmFJbmZvVmlldyA9IChwaXBlbGluZTogUGlwZWxpbmVNb2RlbCkgPT4ge1xyXG5cdFx0aWYgKCFlZGl0b3JNb2RlKSB7XHJcblx0XHRcdHJldHVybiA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTJcIiBzeD17e2ZvbnRXZWlnaHQ6ICc2MDAnLCBjb2xvcjogXCIjMzM2NjY2XCJ9fT5cclxuXHRcdFx0XHR7Z2V0UHJvZ3Jlc3MocGlwZWxpbmUpfVxyXG5cdFx0XHQ8L1R5cG9ncmFwaHk+XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gPEFkZENpcmNsZUljb24gb25DbGljaz17KCkgPT4ge1xyXG5cdFx0XHRcdHNldFByZVNlbGVjdGVkVGVtcGxhdGUocGlwZWxpbmUpXHJcblx0XHRcdFx0c2V0UHJlU2V0V29ya2Zsb3dOYW1lKGAke3BpcGVsaW5lLnRpdGxlfSAtICR7VGltZVV0aWxzLmdldERhdGVTdHIoRGF0ZS5ub3coKSl9YClcclxuXHRcdFx0XHRzZXRPcGVuRGlhbG9nKHRydWUpXHJcblx0XHRcdFx0cmV0dXJuIHRydWVcclxuXHRcdFx0fX0gLz5cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGNvbnN0IGdldFBpcGVsaW5lS2FuYmFuSXRlbXMgPSAoKSA9PiB7XHJcblx0XHRjb25zdCBtZW51SXRlbVZpZXdzID0gW11cclxuXHRcdG1lbnVJdGVtVmlld3MucHVzaChcclxuXHRcdFx0PExpc3RJdGVtQnV0dG9uIGtleT17J2FkZCBuZXcnfT5cclxuXHRcdFx0XHR7YWRkTmV3Vmlld31cclxuXHRcdFx0PC9MaXN0SXRlbUJ1dHRvbj4pXHJcblx0XHRmb3IgKGNvbnN0IHNlY3Rpb25QaXBlbGluZSBvZiBzZWN0aW9uUGlwZWxpbmVzKSB7XHJcblx0XHRcdGNvbnN0IHtzZWN0aW9uTmFtZSwgcGlwZWxpbmVzfSA9IHNlY3Rpb25QaXBlbGluZVxyXG5cdFx0XHQvLyBjcmVhdGUgYSBuZXcgZm9yZGFibGUgaXRlbVxyXG5cdFx0XHRtZW51SXRlbVZpZXdzLnB1c2goXHJcblx0XHRcdFx0PExpc3RJdGVtQnV0dG9uIGtleT17J3NlY3Rpb24tJyArIHNlY3Rpb25OYW1lfSBvbkNsaWNrPXsoKSA9PiB7c2V0Rm9sZFN0YXR1cyhzZWN0aW9uTmFtZSl9fT5cclxuXHRcdFx0XHRcdDxMaXN0SXRlbVRleHQgcHJpbWFyeT17c2VjdGlvbk5hbWV9IC8+XHJcblx0XHRcdFx0XHR7Z2V0Rm9sZFN0YXR1cyhzZWN0aW9uTmFtZSkgPyA8RXhwYW5kTGVzcyAvPiA6IDxFeHBhbmRNb3JlIC8+fVxyXG5cdFx0XHRcdDwvTGlzdEl0ZW1CdXR0b24+XHJcblx0XHRcdClcclxuXHRcdFx0Y29uc3Qgc2VjdGlvbkl0ZW1WaWV3cyA9IFtdXHJcblx0XHRcdGZvciAoY29uc3QgcGlwZWxpbmUgb2YgcGlwZWxpbmVzKSB7XHJcblx0XHRcdFx0c2VjdGlvbkl0ZW1WaWV3cy5wdXNoKFxyXG5cdFx0XHRcdFx0PExpc3RJdGVtQnV0dG9uIHN4PXt7IHBsOiA0IH19IGtleT17cGlwZWxpbmUuaWR9PlxyXG5cdFx0XHRcdFx0XHQ8Qm94IGNsYXNzTmFtZT17IHNlbGVjdGVkUGlwZWxpbmUgPT0gcGlwZWxpbmUgPyAnd29ya2Zsb3ctY29udGFpbmVyLWlubmVyLWFjY2VudC1ib3JkZXInIDogJ3dvcmtmbG93LWNvbnRhaW5lci1pbm5lcid9IHN4PXt7d2lkdGg6ICcxMDAlJywgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAncm93JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsIGlkOiBwaXBlbGluZS5pZH19IG9uQ2xpY2s9eygpPT57XHJcblx0XHRcdFx0XHRcdFx0c2VsZWN0UGlwZWxpbmUocGlwZWxpbmUpfX0+XHJcblx0XHRcdFx0XHRcdFx0PFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkyXCI+XHJcblx0XHRcdFx0XHRcdFx0XHR7cGlwZWxpbmUudGl0bGV9XHJcblx0XHRcdFx0XHRcdFx0PC9UeXBvZ3JhcGh5PlxyXG5cdFx0XHRcdFx0XHRcdDxCb3ggc3g9e3t3aWR0aDogMTEwLCBkaXNwbGF5OiAnZmxleCcsIGZsZXhEaXJlY3Rpb246ICdyb3cnLCBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLCBhbGlnbkl0ZW1zOiAnY2VudGVyJ319PlxyXG5cdFx0XHRcdFx0XHRcdFx0PFR5cG9ncmFwaHkgdmFyaWFudD1cImJvZHkyXCI+XHJcblx0XHRcdFx0XHRcdFx0XHRcdHtUaW1lVXRpbHMuZ2V0RGF0ZVRpbWVTdHIocGlwZWxpbmUuY3JlYXRlVGltZSl9XHJcblx0XHRcdFx0XHRcdFx0XHQ8L1R5cG9ncmFwaHk+XHJcblx0XHRcdFx0XHRcdFx0XHR7IGdldEV4dHJhSW5mb1ZpZXcocGlwZWxpbmUpIH1cclxuXHRcdFx0XHRcdFx0XHQ8L0JveD5cclxuXHRcdFx0XHRcdFx0PC9Cb3g+XHJcblx0XHRcdFx0XHQ8L0xpc3RJdGVtQnV0dG9uPlxyXG5cdFx0XHRcdClcclxuXHRcdFx0fVxyXG5cdFx0XHRtZW51SXRlbVZpZXdzLnB1c2goXHJcblx0XHRcdFx0PENvbGxhcHNlIGtleT17J2NvbGxhcHNlLScgKyBzZWN0aW9uTmFtZX0gaW49e2dldEZvbGRTdGF0dXMoc2VjdGlvbk5hbWUpfSB0aW1lb3V0PVwiYXV0b1wiIHVubW91bnRPbkV4aXQ+XHJcblx0XHRcdFx0XHQ8TGlzdCBjb21wb25lbnQ9XCJkaXZcIiBkaXNhYmxlUGFkZGluZyBkZW5zZSA9IHt0cnVlfT5cclxuXHRcdFx0XHRcdFx0e3NlY3Rpb25JdGVtVmlld3N9XHJcblx0XHRcdFx0XHQ8L0xpc3Q+XHJcblx0XHRcdFx0PC9Db2xsYXBzZT5cclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBtZW51SXRlbVZpZXdzXHJcblx0fVxyXG5cclxuXHRjb25zdCBnZXRMaXN0VmlldyA9ICgpID0+IHtcclxuXHRcdHJldHVybiAoXHJcblx0XHRcdDxMaXN0XHJcblx0XHRcdFx0c3g9e3sgd2lkdGg6ICcxMDAlJywgbWF4V2lkdGg6IDM2MCB9fVxyXG5cdFx0XHRcdGNvbXBvbmVudD1cIm5hdlwiXHJcblx0XHRcdFx0YXJpYS1sYWJlbGxlZGJ5PVwibmVzdGVkLWxpc3Qtc3ViaGVhZGVyXCJcclxuXHRcdFx0XHRkZW5zZSA9IHt0cnVlfVxyXG5cdFx0XHQ+XHJcblx0XHRcdFx0e2dldFBpcGVsaW5lS2FuYmFuSXRlbXMoKX1cclxuXHRcdFx0PC9MaXN0PlxyXG5cdFx0KTtcclxuXHR9XHJcblxyXG5cdHJldHVybiAoXHJcblx0XHQ8ZGl2IHN0eWxlPXt7d2lkdGg6IDMwMCwgaGVpZ2h0OiAnMTAwJScsIG92ZXJmbG93WTogJ3Njcm9sbCd9fT5cclxuXHRcdFx0PFR5cG9ncmFwaHkgdmFyaWFudD1cImg1XCIgZ3V0dGVyQm90dG9tPlxyXG5cdFx0XHRcdHsnS2FuYmFuOiAnICsga2FuYmFuVGl0bGV9XHJcblx0XHRcdDwvVHlwb2dyYXBoeT5cclxuXHRcdFx0PERpdmlkZXIvPlxyXG5cdFx0XHR7Z2V0TGlzdFZpZXcoKX1cclxuXHRcdFx0PE5ld1BpcGVsaW5lRGlhbG9nXHJcblx0XHRcdFx0dGVtcGxhdGVzPXt0ZW1wbGF0ZXN9XHJcblx0XHRcdFx0b3Blbj17b3BlbkRpYWxvZ31cclxuXHRcdFx0XHRjbG9zZURpYWxvZz17Y2xvc2VOZXdQaXBlbGluZURpYWxvZ31cclxuXHRcdFx0XHRjcmVhdGVOZXdUYXNrPXtoYW5kbGVDcmVhdGVOZXdQaXBlbGluZX1cclxuXHRcdFx0XHRzdWJqZWN0cz17c3ViamVjdHN9XHJcblx0XHRcdFx0cHJlU2VsZWN0ZWRUZW1wbGF0ZT17cHJlU2VsZWN0ZWRUZW1wbGF0ZX1cclxuXHRcdFx0XHRwcmVTZXRXb3JrZmxvd05hbWU9e3ByZVNldFdvcmtmbG93TmFtZX1cclxuXHRcdFx0Lz5cclxuXHRcdDwvZGl2PlxyXG5cdCk7XHJcbn1cclxuIl19