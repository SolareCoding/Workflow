import * as React from "react";
import { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Typography, } from "@mui/material";
import SectionView from "./Section.view";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { SectionModel } from "./Pipeline.model";
import { NodeStatusEnum } from "../nodes/NodeStatus.enum";
import PipelineColors from "../common/Pipeline.colors";
import { AddCircle } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import { WorkPanelContext } from "../workpanel/WorkPanel.view";
import { UpdateMode } from "../workpanel/WorkPanel.controller";
/**
 * 单条流水线的View
 * @param props
 * @constructor
 * 工作流场景下可以被删除，
 * 模板场景下可以修改标题和删除Pipeline,增加新的Section
 */
export default function PipelineView(props) {
    const { pipeline } = props;
    const { sections, isTemplate } = pipeline;
    const workPanelController = useContext(WorkPanelContext);
    const [title, setTitle] = useState(pipeline.title);
    useEffect(() => {
        setTitle(pipeline.title);
        updatePipelineStatus();
    }, [pipeline]);
    const getColor = () => {
        return PipelineColors.COLOR_MAP[pipeline.status];
    };
    const handlePipelineNameChange = (event) => {
        setTitle(event.target.value);
        const newPipeline = Object.assign({}, pipeline, { title: event.target.value });
        workPanelController.updatePipeline(newPipeline);
    };
    const handlePipelineDeleted = () => {
        workPanelController.updatePipeline(pipeline, UpdateMode.DELETE);
    };
    const getActionView = () => {
        return React.createElement(Box, { onClick: handlePipelineDeleted },
            React.createElement(DeleteIcon, null));
    };
    const getTitleView = () => {
        if (!isTemplate) {
            return React.createElement(Box, { sx: { display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' } },
                React.createElement(Typography, { sx: { fontSize: 20, fontWeight: 600, textAlign: 'center' } }, '任务: ' + props.pipeline.title),
                getActionView());
        }
        else {
            return React.createElement(Box, { sx: { display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' } },
                React.createElement("input", { className: 'workflow-input', style: { fontSize: 20, fontWeight: 600 }, id: "template-simple", value: title, onChange: handlePipelineNameChange }),
                getActionView());
        }
    };
    const getSubTitleView = () => {
        if (!isTemplate) {
            return React.createElement(Typography, { sx: { fontSize: 18, color: getColor(), fontWeight: 600, marginTop: 2, textAlign: 'center' } }, '工作流: ' + props.pipeline.templateTitle);
        }
        else {
            return React.createElement(Typography, { sx: { fontSize: 18, fontWeight: 600, marginTop: 2, textAlign: 'center' } }, '编辑工作流模板');
        }
    };
    const getDividerView = (index, end) => {
        if (!isTemplate) {
            if (index === 0 || index == end)
                return false;
            return React.createElement(KeyboardDoubleArrowRightIcon, { style: { margin: '10px 10px 10px 10px' } });
        }
        return React.createElement(Box, { key: 'addCircle-' + index, onClick: () => { insertNewSection(index); } },
            React.createElement(AddCircle, { style: { margin: '10px 10px 10px 10px' } }));
    };
    const insertNewSection = (index) => {
        sections.splice(index, 0, SectionModel.newInstance());
        const newPipeline = Object.assign({}, pipeline);
        workPanelController.updatePipeline(newPipeline);
    };
    const getSectionViews = () => {
        let sectionViews = [];
        sectionViews.push(getDividerView(0));
        for (let i = 0; i < sections.length; i++) {
            let couldUpdate = i == 0 ? true : sections[i - 1].status == NodeStatusEnum.DONE;
            sectionViews.push(React.createElement(SectionView, { key: 'section-' + sections[i].id, pipeline: pipeline, section: sections[i], couldUpdate: couldUpdate, editorMode: isTemplate }));
            sectionViews.push(getDividerView(i + 1, sections.length));
        }
        return sectionViews;
    };
    const isPending = (section) => section.status == NodeStatusEnum.PENDING;
    const isDone = (section) => section.status == NodeStatusEnum.DONE;
    const getPipelineStatus = () => {
        if (sections.every(isPending)) {
            return NodeStatusEnum.PENDING;
        }
        else if (sections.every(isDone)) {
            return NodeStatusEnum.DONE;
        }
        else {
            return NodeStatusEnum.WORKING;
        }
    };
    const updatePipelineStatus = () => {
        if (getPipelineStatus() == pipeline.status) {
            return;
        }
        workPanelController.updatePipeline(Object.assign({}, pipeline, { status: getPipelineStatus() }));
    };
    /**
     * 更新所有Pipelines中的对应节点
     */
    return (React.createElement("div", { style: { display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center', height: '100%', paddingTop: '50px', flexDirection: 'column', minHeight: '1px', minWidth: '1px' } },
        getTitleView(),
        getSubTitleView(),
        React.createElement("div", { style: { width: '100%', height: '100%', overflow: 'scroll', marginTop: '10px' } },
            React.createElement("div", { style: { display: 'inline-flex', flexDirection: 'row', alignItems: 'flex-start', margin: '0px 50px 50px 50px' } }, getSectionViews()))));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGlwZWxpbmUudmlldy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlBpcGVsaW5lLnZpZXcudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sS0FBSyxLQUFLLE1BQU0sT0FBTyxDQUFDO0FBQy9CLE9BQU8sRUFBQyxVQUFVLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBQyxNQUFNLE9BQU8sQ0FBQztBQUN0RCxPQUFPLEdBQUcsTUFBTSxtQkFBbUIsQ0FBQztBQUNwQyxPQUFPLEVBQVEsVUFBVSxHQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2pELE9BQU8sV0FBVyxNQUFNLGdCQUFnQixDQUFDO0FBQ3pDLE9BQU8sNEJBQTRCLE1BQU0sOENBQThDLENBQUM7QUFDeEYsT0FBTyxFQUFnQixZQUFZLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUM3RCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDeEQsT0FBTyxjQUFjLE1BQU0sMkJBQTJCLENBQUM7QUFDdkQsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQzlDLE9BQU8sVUFBVSxNQUFNLDRCQUE0QixDQUFDO0FBQ3BELE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLDZCQUE2QixDQUFDO0FBQzdELE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxtQ0FBbUMsQ0FBQztBQU03RDs7Ozs7O0dBTUc7QUFDSCxNQUFNLENBQUMsT0FBTyxVQUFVLFlBQVksQ0FBQyxLQUFvQjtJQUV4RCxNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsS0FBSyxDQUFBO0lBQzFCLE1BQU0sRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLEdBQUcsUUFBUSxDQUFBO0lBQ3pDLE1BQU0sbUJBQW1CLEdBQUcsVUFBVSxDQUFDLGdCQUFnQixDQUFDLENBQUE7SUFFeEQsTUFBTSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBRWxELFNBQVMsQ0FBQyxHQUFHLEVBQUU7UUFDZCxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ3hCLG9CQUFvQixFQUFFLENBQUE7SUFDdkIsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQTtJQUVkLE1BQU0sUUFBUSxHQUFHLEdBQUcsRUFBRTtRQUNyQixPQUFPLGNBQWMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQ2pELENBQUMsQ0FBQTtJQUVELE1BQU0sd0JBQXdCLEdBQUcsQ0FBQyxLQUEwQyxFQUFFLEVBQUU7UUFDL0UsUUFBUSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDNUIsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFFLEVBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFDLENBQUMsQ0FBQTtRQUM1RSxtQkFBbUIsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUE7SUFDaEQsQ0FBQyxDQUFBO0lBRUQsTUFBTSxxQkFBcUIsR0FBRyxHQUFHLEVBQUU7UUFDbEMsbUJBQW1CLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDaEUsQ0FBQyxDQUFBO0lBRUQsTUFBTSxhQUFhLEdBQUcsR0FBRyxFQUFFO1FBQzFCLE9BQU8sb0JBQUMsR0FBRyxJQUFDLE9BQU8sRUFBRSxxQkFBcUI7WUFDekMsb0JBQUMsVUFBVSxPQUFFLENBQ1IsQ0FBQTtJQUNQLENBQUMsQ0FBQTtJQUVELE1BQU0sWUFBWSxHQUFHLEdBQUcsRUFBRTtRQUN6QixJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ2hCLE9BQU8sb0JBQUMsR0FBRyxJQUFDLEVBQUUsRUFBRSxFQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBQztnQkFDckgsb0JBQUMsVUFBVSxJQUFDLEVBQUUsRUFBRSxFQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFDLElBQUcsTUFBTSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFjO2dCQUNoSCxhQUFhLEVBQUUsQ0FDWixDQUFBO1NBQ047YUFBTTtZQUNOLE9BQU8sb0JBQUMsR0FBRyxJQUFDLEVBQUUsRUFBRSxFQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBQztnQkFDckgsK0JBQU8sU0FBUyxFQUFFLGdCQUFnQixFQUFFLEtBQUssRUFBRSxFQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBQyxFQUFFLEVBQUUsRUFBQyxpQkFBaUIsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSx3QkFBd0IsR0FBSTtnQkFDbkosYUFBYSxFQUFFLENBQ1osQ0FBQTtTQUNOO0lBQ0YsQ0FBQyxDQUFBO0lBRUQsTUFBTSxlQUFlLEdBQUcsR0FBRyxFQUFFO1FBQzVCLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDaEIsT0FBTyxvQkFBQyxVQUFVLElBQUMsRUFBRSxFQUFFLEVBQUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEVBQUUsVUFBVSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUMsSUFBRyxPQUFPLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQWMsQ0FBQTtTQUNuSzthQUFNO1lBQ04sT0FBTyxvQkFBQyxVQUFVLElBQUMsRUFBRSxFQUFFLEVBQUMsUUFBUSxFQUFFLEVBQUUsRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBQyxJQUFHLFNBQVMsQ0FBYyxDQUFBO1NBQ25IO0lBQ0YsQ0FBQyxDQUFBO0lBRUQsTUFBTSxjQUFjLEdBQUcsQ0FBQyxLQUFhLEVBQUUsR0FBWSxFQUFFLEVBQUU7UUFDdEQsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNoQixJQUFJLEtBQUssS0FBSyxDQUFDLElBQUksS0FBSyxJQUFJLEdBQUc7Z0JBQzlCLE9BQU8sS0FBSyxDQUFBO1lBQ2IsT0FBTyxvQkFBQyw0QkFBNEIsSUFBQyxLQUFLLEVBQUUsRUFBQyxNQUFNLEVBQUUscUJBQXFCLEVBQUMsR0FBRyxDQUFBO1NBQzlFO1FBQ0QsT0FBTyxvQkFBQyxHQUFHLElBQUMsR0FBRyxFQUFJLFlBQVksR0FBRyxLQUFLLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxHQUFFLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFBLENBQUEsQ0FBQztZQUNoRixvQkFBQyxTQUFTLElBQUMsS0FBSyxFQUFFLEVBQUMsTUFBTSxFQUFFLHFCQUFxQixFQUFDLEdBQUcsQ0FDL0MsQ0FBQTtJQUNQLENBQUMsQ0FBQTtJQUVELE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxLQUFhLEVBQUUsRUFBRTtRQUMxQyxRQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUE7UUFDckQsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUE7UUFDL0MsbUJBQW1CLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0lBQ2hELENBQUMsQ0FBQTtJQUVELE1BQU0sZUFBZSxHQUFHLEdBQUcsRUFBRTtRQUM1QixJQUFJLFlBQVksR0FBRyxFQUFFLENBQUE7UUFDckIsWUFBWSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNwQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN6QyxJQUFJLFdBQVcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLGNBQWMsQ0FBQyxJQUFJLENBQUE7WUFDL0UsWUFBWSxDQUFDLElBQUksQ0FBQyxvQkFBQyxXQUFXLElBQUMsR0FBRyxFQUFFLFVBQVUsR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxVQUFVLEdBQUcsQ0FBQyxDQUFBO1lBQy9KLFlBQVksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUE7U0FDekQ7UUFDRCxPQUFPLFlBQVksQ0FBQTtJQUNwQixDQUFDLENBQUE7SUFFRCxNQUFNLFNBQVMsR0FBRyxDQUFDLE9BQXFCLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxNQUFNLElBQUksY0FBYyxDQUFDLE9BQU8sQ0FBQTtJQUNyRixNQUFNLE1BQU0sR0FBRyxDQUFDLE9BQXFCLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxNQUFNLElBQUksY0FBYyxDQUFDLElBQUksQ0FBQTtJQUUvRSxNQUFNLGlCQUFpQixHQUFHLEdBQUcsRUFBRTtRQUM5QixJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDOUIsT0FBUSxjQUFjLENBQUMsT0FBTyxDQUFBO1NBQzlCO2FBQU0sSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ2xDLE9BQU8sY0FBYyxDQUFDLElBQUksQ0FBQTtTQUMxQjthQUFNO1lBQ04sT0FBTyxjQUFjLENBQUMsT0FBTyxDQUFBO1NBQzdCO0lBQ0YsQ0FBQyxDQUFBO0lBRUQsTUFBTSxvQkFBb0IsR0FBRyxHQUFHLEVBQUU7UUFDakMsSUFBSSxpQkFBaUIsRUFBRSxJQUFJLFFBQVEsQ0FBQyxNQUFNLEVBQUU7WUFDM0MsT0FBTTtTQUNOO1FBQ0QsbUJBQW1CLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFDLE1BQU0sRUFBRSxpQkFBaUIsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFBO0lBQy9GLENBQUMsQ0FBQTtJQUVEOztPQUVHO0lBQ0gsT0FBTyxDQUNOLDZCQUFLLEtBQUssRUFBRSxFQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUMsUUFBUSxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFDO1FBQ3pMLFlBQVksRUFBRTtRQUNkLGVBQWUsRUFBRTtRQUNsQiw2QkFBSyxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsTUFBTSxFQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFDO1lBQ2hGLDZCQUFLLEtBQUssRUFBRSxFQUFDLE9BQU8sRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxvQkFBb0IsRUFBQyxJQUNoSCxlQUFlLEVBQUUsQ0FDYixDQUNELENBQ0QsQ0FDTixDQUFDO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQge3VzZUNvbnRleHQsIHVzZUVmZmVjdCwgdXNlU3RhdGV9IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgQm94IGZyb20gXCJAbXVpL21hdGVyaWFsL0JveFwiO1xyXG5pbXBvcnQge1N0YWNrLCBUeXBvZ3JhcGh5LH0gZnJvbSBcIkBtdWkvbWF0ZXJpYWxcIjtcclxuaW1wb3J0IFNlY3Rpb25WaWV3IGZyb20gXCIuL1NlY3Rpb24udmlld1wiO1xyXG5pbXBvcnQgS2V5Ym9hcmREb3VibGVBcnJvd1JpZ2h0SWNvbiBmcm9tIFwiQG11aS9pY29ucy1tYXRlcmlhbC9LZXlib2FyZERvdWJsZUFycm93UmlnaHRcIjtcclxuaW1wb3J0IHtQaXBlbGluZU1vZGVsLCBTZWN0aW9uTW9kZWx9IGZyb20gXCIuL1BpcGVsaW5lLm1vZGVsXCI7XHJcbmltcG9ydCB7Tm9kZVN0YXR1c0VudW19IGZyb20gXCIuLi9ub2Rlcy9Ob2RlU3RhdHVzLmVudW1cIjtcclxuaW1wb3J0IFBpcGVsaW5lQ29sb3JzIGZyb20gXCIuLi9jb21tb24vUGlwZWxpbmUuY29sb3JzXCI7XHJcbmltcG9ydCB7QWRkQ2lyY2xlfSBmcm9tIFwiQG11aS9pY29ucy1tYXRlcmlhbFwiO1xyXG5pbXBvcnQgRGVsZXRlSWNvbiBmcm9tIFwiQG11aS9pY29ucy1tYXRlcmlhbC9EZWxldGVcIjtcclxuaW1wb3J0IHtXb3JrUGFuZWxDb250ZXh0fSBmcm9tIFwiLi4vd29ya3BhbmVsL1dvcmtQYW5lbC52aWV3XCI7XHJcbmltcG9ydCB7VXBkYXRlTW9kZX0gZnJvbSBcIi4uL3dvcmtwYW5lbC9Xb3JrUGFuZWwuY29udHJvbGxlclwiO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBQaXBlbGluZVByb3BzIHtcclxuXHRwaXBlbGluZTogUGlwZWxpbmVNb2RlbFxyXG59XHJcblxyXG4vKipcclxuICog5Y2V5p2h5rWB5rC057q/55qEVmlld1xyXG4gKiBAcGFyYW0gcHJvcHNcclxuICogQGNvbnN0cnVjdG9yXHJcbiAqIOW3peS9nOa1geWcuuaZr+S4i+WPr+S7peiiq+WIoOmZpO+8jFxyXG4gKiDmqKHmnb/lnLrmma/kuIvlj6/ku6Xkv67mlLnmoIfpopjlkozliKDpmaRQaXBlbGluZSzlop7liqDmlrDnmoRTZWN0aW9uXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBQaXBlbGluZVZpZXcocHJvcHM6IFBpcGVsaW5lUHJvcHMpIHtcclxuXHJcblx0Y29uc3QgeyBwaXBlbGluZSB9ID0gcHJvcHNcclxuXHRjb25zdCB7IHNlY3Rpb25zLCBpc1RlbXBsYXRlIH0gPSBwaXBlbGluZVxyXG5cdGNvbnN0IHdvcmtQYW5lbENvbnRyb2xsZXIgPSB1c2VDb250ZXh0KFdvcmtQYW5lbENvbnRleHQpXHJcblxyXG5cdGNvbnN0IFt0aXRsZSwgc2V0VGl0bGVdID0gdXNlU3RhdGUocGlwZWxpbmUudGl0bGUpXHJcblxyXG5cdHVzZUVmZmVjdCgoKSA9PiB7XHJcblx0XHRzZXRUaXRsZShwaXBlbGluZS50aXRsZSlcclxuXHRcdHVwZGF0ZVBpcGVsaW5lU3RhdHVzKClcclxuXHR9LCBbcGlwZWxpbmVdKVxyXG5cclxuXHRjb25zdCBnZXRDb2xvciA9ICgpID0+IHtcclxuXHRcdHJldHVybiBQaXBlbGluZUNvbG9ycy5DT0xPUl9NQVBbcGlwZWxpbmUuc3RhdHVzXVxyXG5cdH1cclxuXHJcblx0Y29uc3QgaGFuZGxlUGlwZWxpbmVOYW1lQ2hhbmdlID0gKGV2ZW50OiBSZWFjdC5DaGFuZ2VFdmVudDxIVE1MSW5wdXRFbGVtZW50PikgPT4ge1xyXG5cdFx0c2V0VGl0bGUoZXZlbnQudGFyZ2V0LnZhbHVlKVxyXG5cdFx0Y29uc3QgbmV3UGlwZWxpbmUgPSBPYmplY3QuYXNzaWduKHt9LCBwaXBlbGluZSwge3RpdGxlOiBldmVudC50YXJnZXQudmFsdWV9KVxyXG5cdFx0d29ya1BhbmVsQ29udHJvbGxlci51cGRhdGVQaXBlbGluZShuZXdQaXBlbGluZSlcclxuXHR9XHJcblxyXG5cdGNvbnN0IGhhbmRsZVBpcGVsaW5lRGVsZXRlZCA9ICgpID0+IHtcclxuXHRcdHdvcmtQYW5lbENvbnRyb2xsZXIudXBkYXRlUGlwZWxpbmUocGlwZWxpbmUsIFVwZGF0ZU1vZGUuREVMRVRFKVxyXG5cdH1cclxuXHJcblx0Y29uc3QgZ2V0QWN0aW9uVmlldyA9ICgpID0+IHtcclxuXHRcdHJldHVybiA8Qm94IG9uQ2xpY2s9e2hhbmRsZVBpcGVsaW5lRGVsZXRlZH0+XHJcblx0XHRcdDxEZWxldGVJY29uLz5cclxuXHRcdDwvQm94PlxyXG5cdH1cclxuXHJcblx0Y29uc3QgZ2V0VGl0bGVWaWV3ID0gKCkgPT4ge1xyXG5cdFx0aWYgKCFpc1RlbXBsYXRlKSB7XHJcblx0XHRcdHJldHVybiA8Qm94IHN4PXt7ZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAncm93JywgYWxpZ25JdGVtczogJ2NlbnRlcicsIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJywgd2lkdGg6ICcxMDAlJ319PlxyXG5cdFx0XHRcdDxUeXBvZ3JhcGh5IHN4PXt7Zm9udFNpemU6IDIwLCBmb250V2VpZ2h0OiA2MDAsIHRleHRBbGlnbjogJ2NlbnRlcid9fT57J+S7u+WKoTogJyArIHByb3BzLnBpcGVsaW5lLnRpdGxlfTwvVHlwb2dyYXBoeT5cclxuXHRcdFx0XHR7IGdldEFjdGlvblZpZXcoKSB9XHJcblx0XHRcdDwvQm94PlxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIDxCb3ggc3g9e3tkaXNwbGF5OiAnZmxleCcsIGZsZXhEaXJlY3Rpb246ICdyb3cnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInLCB3aWR0aDogJzEwMCUnfX0+XHJcblx0XHRcdFx0PGlucHV0IGNsYXNzTmFtZT17J3dvcmtmbG93LWlucHV0J30gc3R5bGU9e3tmb250U2l6ZTogMjAsIGZvbnRXZWlnaHQ6IDYwMH19IGlkPVwidGVtcGxhdGUtc2ltcGxlXCIgdmFsdWU9e3RpdGxlfSBvbkNoYW5nZT17aGFuZGxlUGlwZWxpbmVOYW1lQ2hhbmdlfSAvPlxyXG5cdFx0XHRcdHsgZ2V0QWN0aW9uVmlldygpIH1cclxuXHRcdFx0PC9Cb3g+XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRjb25zdCBnZXRTdWJUaXRsZVZpZXcgPSAoKSA9PiB7XHJcblx0XHRpZiAoIWlzVGVtcGxhdGUpIHtcclxuXHRcdFx0cmV0dXJuIDxUeXBvZ3JhcGh5IHN4PXt7Zm9udFNpemU6IDE4LCBjb2xvcjogZ2V0Q29sb3IoKSwgZm9udFdlaWdodDogNjAwLCBtYXJnaW5Ub3A6IDIsIHRleHRBbGlnbjogJ2NlbnRlcid9fT57J+W3peS9nOa1gTogJyArIHByb3BzLnBpcGVsaW5lLnRlbXBsYXRlVGl0bGV9PC9UeXBvZ3JhcGh5PlxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIDxUeXBvZ3JhcGh5IHN4PXt7Zm9udFNpemU6IDE4LCBmb250V2VpZ2h0OiA2MDAsIG1hcmdpblRvcDogMiwgdGV4dEFsaWduOiAnY2VudGVyJ319Pnsn57yW6L6R5bel5L2c5rWB5qih5p2/J308L1R5cG9ncmFwaHk+XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRjb25zdCBnZXREaXZpZGVyVmlldyA9IChpbmRleDogbnVtYmVyLCBlbmQ/OiBudW1iZXIpID0+IHtcclxuXHRcdGlmICghaXNUZW1wbGF0ZSkge1xyXG5cdFx0XHRpZiAoaW5kZXggPT09IDAgfHwgaW5kZXggPT0gZW5kKVxyXG5cdFx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0XHRyZXR1cm4gPEtleWJvYXJkRG91YmxlQXJyb3dSaWdodEljb24gc3R5bGU9e3ttYXJnaW46ICcxMHB4IDEwcHggMTBweCAxMHB4J319Lz5cclxuXHRcdH1cclxuXHRcdHJldHVybiA8Qm94IGtleSA9IHsnYWRkQ2lyY2xlLScgKyBpbmRleH0gb25DbGljaz17KCkgPT4ge2luc2VydE5ld1NlY3Rpb24oaW5kZXgpfX0+XHJcblx0XHRcdDxBZGRDaXJjbGUgc3R5bGU9e3ttYXJnaW46ICcxMHB4IDEwcHggMTBweCAxMHB4J319Lz5cclxuXHRcdDwvQm94PlxyXG5cdH1cclxuXHJcblx0Y29uc3QgaW5zZXJ0TmV3U2VjdGlvbiA9IChpbmRleDogbnVtYmVyKSA9PiB7XHJcblx0XHRzZWN0aW9ucy5zcGxpY2UoaW5kZXgsIDAsIFNlY3Rpb25Nb2RlbC5uZXdJbnN0YW5jZSgpKVxyXG5cdFx0Y29uc3QgbmV3UGlwZWxpbmUgPSBPYmplY3QuYXNzaWduKHt9LCBwaXBlbGluZSlcclxuXHRcdHdvcmtQYW5lbENvbnRyb2xsZXIudXBkYXRlUGlwZWxpbmUobmV3UGlwZWxpbmUpXHJcblx0fVxyXG5cclxuXHRjb25zdCBnZXRTZWN0aW9uVmlld3MgPSAoKSA9PiB7XHJcblx0XHRsZXQgc2VjdGlvblZpZXdzID0gW11cclxuXHRcdHNlY3Rpb25WaWV3cy5wdXNoKGdldERpdmlkZXJWaWV3KDApKVxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzZWN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRsZXQgY291bGRVcGRhdGUgPSBpID09IDAgPyB0cnVlIDogc2VjdGlvbnNbaSAtIDFdLnN0YXR1cyA9PSBOb2RlU3RhdHVzRW51bS5ET05FXHJcblx0XHRcdHNlY3Rpb25WaWV3cy5wdXNoKDxTZWN0aW9uVmlldyBrZXk9eydzZWN0aW9uLScgKyBzZWN0aW9uc1tpXS5pZH0gcGlwZWxpbmU9e3BpcGVsaW5lfSBzZWN0aW9uPXtzZWN0aW9uc1tpXX0gY291bGRVcGRhdGU9e2NvdWxkVXBkYXRlfSBlZGl0b3JNb2RlPXtpc1RlbXBsYXRlfS8+KVxyXG5cdFx0XHRzZWN0aW9uVmlld3MucHVzaChnZXREaXZpZGVyVmlldyhpICsgMSwgc2VjdGlvbnMubGVuZ3RoKSlcclxuXHRcdH1cclxuXHRcdHJldHVybiBzZWN0aW9uVmlld3NcclxuXHR9XHJcblxyXG5cdGNvbnN0IGlzUGVuZGluZyA9IChzZWN0aW9uOiBTZWN0aW9uTW9kZWwpID0+IHNlY3Rpb24uc3RhdHVzID09IE5vZGVTdGF0dXNFbnVtLlBFTkRJTkdcclxuXHRjb25zdCBpc0RvbmUgPSAoc2VjdGlvbjogU2VjdGlvbk1vZGVsKSA9PiBzZWN0aW9uLnN0YXR1cyA9PSBOb2RlU3RhdHVzRW51bS5ET05FXHJcblxyXG5cdGNvbnN0IGdldFBpcGVsaW5lU3RhdHVzID0gKCkgPT4ge1xyXG5cdFx0aWYgKHNlY3Rpb25zLmV2ZXJ5KGlzUGVuZGluZykpIHtcclxuXHRcdFx0cmV0dXJuICBOb2RlU3RhdHVzRW51bS5QRU5ESU5HXHJcblx0XHR9IGVsc2UgaWYgKHNlY3Rpb25zLmV2ZXJ5KGlzRG9uZSkpIHtcclxuXHRcdFx0cmV0dXJuIE5vZGVTdGF0dXNFbnVtLkRPTkVcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiBOb2RlU3RhdHVzRW51bS5XT1JLSU5HXHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRjb25zdCB1cGRhdGVQaXBlbGluZVN0YXR1cyA9ICgpID0+IHtcclxuXHRcdGlmIChnZXRQaXBlbGluZVN0YXR1cygpID09IHBpcGVsaW5lLnN0YXR1cykge1xyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHRcdHdvcmtQYW5lbENvbnRyb2xsZXIudXBkYXRlUGlwZWxpbmUoT2JqZWN0LmFzc2lnbih7fSwgcGlwZWxpbmUsIHtzdGF0dXM6IGdldFBpcGVsaW5lU3RhdHVzKCl9KSlcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIOabtOaWsOaJgOaciVBpcGVsaW5lc+S4reeahOWvueW6lOiKgueCuVxyXG5cdCAqL1xyXG5cdHJldHVybiAoXHJcblx0XHQ8ZGl2IHN0eWxlPXt7ZGlzcGxheTogJ2ZsZXgnLCB3aWR0aDogJzEwMCUnLCBhbGlnbkl0ZW1zOidjZW50ZXInLCBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsIGhlaWdodDogJzEwMCUnLCBwYWRkaW5nVG9wOiAnNTBweCcsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBtaW5IZWlnaHQ6ICcxcHgnLCBtaW5XaWR0aDogJzFweCd9fT5cclxuXHRcdFx0e2dldFRpdGxlVmlldygpfVxyXG5cdFx0XHR7Z2V0U3ViVGl0bGVWaWV3KCl9XHJcblx0XHRcdDxkaXYgc3R5bGU9e3t3aWR0aDogJzEwMCUnLGhlaWdodDogJzEwMCUnLCBvdmVyZmxvdzogJ3Njcm9sbCcsIG1hcmdpblRvcDogJzEwcHgnfX0+XHJcblx0XHRcdFx0PGRpdiBzdHlsZT17e2Rpc3BsYXk6ICdpbmxpbmUtZmxleCcsIGZsZXhEaXJlY3Rpb246ICdyb3cnLCBhbGlnbkl0ZW1zOiAnZmxleC1zdGFydCcsIG1hcmdpbjogJzBweCA1MHB4IDUwcHggNTBweCd9fT5cclxuXHRcdFx0XHRcdHtnZXRTZWN0aW9uVmlld3MoKX1cclxuXHRcdFx0XHQ8L2Rpdj5cclxuXHRcdFx0PC9kaXY+XHJcblx0XHQ8L2Rpdj5cclxuXHQpO1xyXG59XHJcbiJdfQ==