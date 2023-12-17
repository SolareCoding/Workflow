import { Typography } from "@mui/material";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import WorkflowKanbanView from "./WorkflowKanban.view";
import PipelineView from "../pipeline/Pipeline.view";
import { NodeStatusEnum } from "../nodes/NodeStatus.enum";
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import FloatingBarView from "../floating/FloatingBar.view";
export default function WorkflowView(props) {
    const [workflowKanbanFold, setWorkflowKanbanFold] = useState(true);
    const [templateKanbanFold, setTemplateKanbanFold] = useState(true);
    const [focusPipeline, setFocusPipeline] = useState(undefined);
    useEffect(() => {
        // no prev focus pipeline
        if (!focusPipeline) {
            setFocusPipeline(getDefaultFocusedPipeline(props.workflows));
            return;
        }
        if (!focusPipeline.isTemplate && !props.workflows.contains(focusPipeline)) {
            const samePipelineIndex = props.workflows.findIndex((value, index, object) => value.id === focusPipeline.id);
            if (samePipelineIndex === -1) {
                setFocusPipeline(getDefaultFocusedPipeline(props.workflows));
            }
            else {
                setFocusPipeline(props.workflows[samePipelineIndex]);
            }
            return;
        }
        if (focusPipeline.isTemplate && !props.templates.contains(focusPipeline)) {
            const samePipelineIndex = props.templates.findIndex((value, index, object) => value.id === focusPipeline.id);
            if (samePipelineIndex === -1) {
                setFocusPipeline(props.templates.length > 0 ? props.templates[0] : undefined);
            }
            else {
                setFocusPipeline(props.templates[samePipelineIndex]);
            }
            return;
        }
    }, [props]);
    const getLeafSubjects = (rootSubject) => {
        const leafSubjects = [];
        innerSearchLeafSubjects(rootSubject, leafSubjects);
        return leafSubjects;
    };
    const innerSearchLeafSubjects = (rootSubject, leafSubjects) => {
        if (rootSubject.children.length == 0) {
            leafSubjects.push(rootSubject);
            return;
        }
        for (let i = 0; i < rootSubject.children.length; i++) {
            innerSearchLeafSubjects(rootSubject.children[i], leafSubjects);
        }
    };
    const leafSubjects = useMemo(() => getLeafSubjects(props.subject), [props.subject]);
    const getDefaultFocusedPipeline = (pipelines) => {
        for (const pipeline of pipelines) {
            if (pipeline.status == NodeStatusEnum.WORKING) {
                return pipeline;
            }
        }
        for (const pipeline of pipelines) {
            if (pipeline.status == NodeStatusEnum.PENDING) {
                return pipeline;
            }
        }
        return undefined;
    };
    const getKanbanPipelines = () => {
        const sectionPipelines = [];
        const pendingPipelines = [];
        const workingPipelines = [];
        const donePipelines = [];
        for (const pipeline of props.workflows) {
            switch (pipeline.status) {
                case NodeStatusEnum.PENDING:
                    pendingPipelines.push(pipeline);
                    break;
                case NodeStatusEnum.WORKING:
                    workingPipelines.push(pipeline);
                    break;
                case NodeStatusEnum.DONE:
                    donePipelines.push(pipeline);
                    break;
                default:
                    break;
            }
        }
        sectionPipelines.push({ sectionName: NodeStatusEnum.PENDING, pipelines: pendingPipelines });
        sectionPipelines.push({ sectionName: NodeStatusEnum.WORKING, pipelines: workingPipelines });
        sectionPipelines.push({ sectionName: NodeStatusEnum.DONE, pipelines: donePipelines });
        return sectionPipelines;
    };
    const getTemplatePipelines = () => {
        const sectionPipelines = [];
        sectionPipelines.push({ sectionName: 'Template', pipelines: props.templates });
        return sectionPipelines;
    };
    const getFocusPipeline = () => {
        if (!focusPipeline) {
            return React.createElement("div", { className: 'workflow-container-outer', style: { width: '100%', height: '100%', display: "flex", alignItems: 'center', justifyContent: 'center' } },
                React.createElement(Typography, { sx: { minWidth: 500 } },
                    "Open the left drawer to choose a workflow.",
                    React.createElement("br", null),
                    "Open the right drawer to manage templates."));
        }
        return React.createElement(PipelineView, { pipeline: focusPipeline });
    };
    const selectPipeline = (pipeline) => {
        setFocusPipeline(pipeline);
    };
    const workflowKanban = React.createElement(WorkflowKanbanView, { kanbanTitle: 'workflow', sectionPipelines: getKanbanPipelines(), selectedPipeline: focusPipeline, selectPipeline: selectPipeline, templates: props.templates, subjects: leafSubjects });
    const templateKanban = React.createElement(WorkflowKanbanView, { editorMode: true, kanbanTitle: 'template', sectionPipelines: getTemplatePipelines(), selectedPipeline: focusPipeline, selectPipeline: selectPipeline, templates: props.templates, subjects: leafSubjects });
    const getFoldWorkflowKanbanView = () => {
        return React.createElement("div", { style: { height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }, onClick: () => {
                setWorkflowKanbanFold(!workflowKanbanFold);
            } }, !workflowKanbanFold ? React.createElement(KeyboardDoubleArrowLeftIcon, null) : React.createElement(KeyboardDoubleArrowRightIcon, null));
    };
    const getFoldTemplateKanbanView = () => {
        return React.createElement("div", { style: { height: '100%', display: 'flex', alignItems: 'center' }, onClick: () => {
                setTemplateKanbanFold(!templateKanbanFold);
            } }, !templateKanbanFold ? React.createElement(KeyboardDoubleArrowRightIcon, null) : React.createElement(KeyboardDoubleArrowLeftIcon, null));
    };
    const getWorkflowKanban = () => {
        return React.createElement("div", { className: 'workflow-container-outer', style: { position: 'absolute', left: 0, display: 'flex', flexDirection: 'row', height: '100%', padding: 10 } },
            getFoldWorkflowKanbanView(),
            !workflowKanbanFold ? workflowKanban : null);
    };
    const getTemplateKanban = () => {
        return React.createElement("div", { className: 'workflow-container-outer', style: { position: 'absolute', right: 0, display: 'flex', flexDirection: 'row', height: '100%', padding: 10, marginTop: 10, marginBottom: 10 } },
            !templateKanbanFold ? templateKanban : null,
            getFoldTemplateKanbanView());
    };
    const getFloatingBarView = () => {
        return React.createElement(FloatingBarView, { focusedPipeline: focusPipeline, pomodoroArray: props.pomodoro, subject: props.subject });
    };
    return (React.createElement("div", { style: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            height: '100%',
            width: '100%',
        } },
        getFocusPipeline(),
        getWorkflowKanban(),
        getTemplateKanban(),
        getFloatingBarView()));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV29ya2Zsb3cudmlldy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIldvcmtmbG93LnZpZXcudHN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxLQUFLLEtBQUssTUFBTSxPQUFPLENBQUM7QUFDL0IsT0FBTyxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFDLE1BQU0sT0FBTyxDQUFDO0FBQ25ELE9BQU8sa0JBQXNDLE1BQU0sdUJBQXVCLENBQUM7QUFDM0UsT0FBTyxZQUFZLE1BQU0sMkJBQTJCLENBQUM7QUFFckQsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLDBCQUEwQixDQUFDO0FBQ3hELE9BQU8sNEJBQTRCLE1BQU0sOENBQThDLENBQUM7QUFDeEYsT0FBTywyQkFBMkIsTUFBTSw2Q0FBNkMsQ0FBQztBQUN0RixPQUFPLGVBQWUsTUFBTSw4QkFBOEIsQ0FBQztBQVczRCxNQUFNLENBQUMsT0FBTyxVQUFVLFlBQVksQ0FBQyxLQUFvQjtJQUV4RCxNQUFNLENBQUMsa0JBQWtCLEVBQUUscUJBQXFCLENBQUMsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDbEUsTUFBTSxDQUFDLGtCQUFrQixFQUFFLHFCQUFxQixDQUFDLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFBO0lBQ2xFLE1BQU0sQ0FBQyxhQUFhLEVBQUUsZ0JBQWdCLENBQUMsR0FBRyxRQUFRLENBQTBCLFNBQVMsQ0FBQyxDQUFBO0lBRXRGLFNBQVMsQ0FBQyxHQUFFLEVBQUU7UUFDYix5QkFBeUI7UUFDekIsSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUNuQixnQkFBZ0IsQ0FBQyx5QkFBeUIsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQTtZQUM1RCxPQUFNO1NBQ047UUFDRCxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsSUFBSSxDQUFDLEtBQUssQ0FB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LENBQ2hCLENBQ04sQ0FBQTtBQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1R5cG9ncmFwaHl9IGZyb20gXCJAbXVpL21hdGVyaWFsXCI7XHJcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQge3VzZUVmZmVjdCwgdXNlTWVtbywgdXNlU3RhdGV9IGZyb20gXCJyZWFjdFwiO1xyXG5pbXBvcnQgV29ya2Zsb3dLYW5iYW5WaWV3LCB7U2VjdGlvblBpcGVsaW5lc30gZnJvbSBcIi4vV29ya2Zsb3dLYW5iYW4udmlld1wiO1xyXG5pbXBvcnQgUGlwZWxpbmVWaWV3IGZyb20gXCIuLi9waXBlbGluZS9QaXBlbGluZS52aWV3XCI7XHJcbmltcG9ydCB7UGlwZWxpbmVNb2RlbH0gZnJvbSBcIi4uL3BpcGVsaW5lL1BpcGVsaW5lLm1vZGVsXCI7XHJcbmltcG9ydCB7Tm9kZVN0YXR1c0VudW19IGZyb20gXCIuLi9ub2Rlcy9Ob2RlU3RhdHVzLmVudW1cIjtcclxuaW1wb3J0IEtleWJvYXJkRG91YmxlQXJyb3dSaWdodEljb24gZnJvbSAnQG11aS9pY29ucy1tYXRlcmlhbC9LZXlib2FyZERvdWJsZUFycm93UmlnaHQnO1xyXG5pbXBvcnQgS2V5Ym9hcmREb3VibGVBcnJvd0xlZnRJY29uIGZyb20gJ0BtdWkvaWNvbnMtbWF0ZXJpYWwvS2V5Ym9hcmREb3VibGVBcnJvd0xlZnQnO1xyXG5pbXBvcnQgRmxvYXRpbmdCYXJWaWV3IGZyb20gXCIuLi9mbG9hdGluZy9GbG9hdGluZ0Jhci52aWV3XCI7XHJcbmltcG9ydCB7UG9tb2Rvcm9Nb2RlbH0gZnJvbSBcIi4uL3BvbW9kb3JvL1BvbW9kb3JvLm1vZGVsXCI7XHJcbmltcG9ydCB7U3ViamVjdE1vZGVsfSBmcm9tIFwiLi4vc3ViamVjdC9TdWJqZWN0Lm1vZGVsXCI7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFdvcmtmbG93UHJvcHMge1xyXG5cdHdvcmtmbG93czogUGlwZWxpbmVNb2RlbFtdXHJcblx0dGVtcGxhdGVzOiBQaXBlbGluZU1vZGVsW11cclxuXHRwb21vZG9ybzogUG9tb2Rvcm9Nb2RlbFtdXHJcblx0c3ViamVjdDogU3ViamVjdE1vZGVsXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFdvcmtmbG93Vmlldyhwcm9wczogV29ya2Zsb3dQcm9wcykge1xyXG5cclxuXHRjb25zdCBbd29ya2Zsb3dLYW5iYW5Gb2xkLCBzZXRXb3JrZmxvd0thbmJhbkZvbGRdID0gdXNlU3RhdGUodHJ1ZSlcclxuXHRjb25zdCBbdGVtcGxhdGVLYW5iYW5Gb2xkLCBzZXRUZW1wbGF0ZUthbmJhbkZvbGRdID0gdXNlU3RhdGUodHJ1ZSlcclxuXHRjb25zdCBbZm9jdXNQaXBlbGluZSwgc2V0Rm9jdXNQaXBlbGluZV0gPSB1c2VTdGF0ZTxQaXBlbGluZU1vZGVsfHVuZGVmaW5lZD4odW5kZWZpbmVkKVxyXG5cclxuXHR1c2VFZmZlY3QoKCk9PiB7XHJcblx0XHQvLyBubyBwcmV2IGZvY3VzIHBpcGVsaW5lXHJcblx0XHRpZiAoIWZvY3VzUGlwZWxpbmUpIHtcclxuXHRcdFx0c2V0Rm9jdXNQaXBlbGluZShnZXREZWZhdWx0Rm9jdXNlZFBpcGVsaW5lKHByb3BzLndvcmtmbG93cykpXHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cdFx0aWYgKCFmb2N1c1BpcGVsaW5lLmlzVGVtcGxhdGUgJiYgIXByb3BzLndvcmtmbG93cy5jb250YWlucyhmb2N1c1BpcGVsaW5lKSkge1xyXG5cdFx0XHRjb25zdCBzYW1lUGlwZWxpbmVJbmRleCA9IHByb3BzLndvcmtmbG93cy5maW5kSW5kZXgoKHZhbHVlLCBpbmRleCwgb2JqZWN0KSA9PiB2YWx1ZS5pZCA9PT0gZm9jdXNQaXBlbGluZS5pZClcclxuXHRcdFx0aWYgKHNhbWVQaXBlbGluZUluZGV4ID09PSAtMSkge1xyXG5cdFx0XHRcdHNldEZvY3VzUGlwZWxpbmUoZ2V0RGVmYXVsdEZvY3VzZWRQaXBlbGluZShwcm9wcy53b3JrZmxvd3MpKVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHNldEZvY3VzUGlwZWxpbmUocHJvcHMud29ya2Zsb3dzW3NhbWVQaXBlbGluZUluZGV4XSlcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm5cclxuXHRcdH1cclxuXHRcdGlmIChmb2N1c1BpcGVsaW5lLmlzVGVtcGxhdGUgJiYgIXByb3BzLnRlbXBsYXRlcy5jb250YWlucyhmb2N1c1BpcGVsaW5lKSkge1xyXG5cdFx0XHRjb25zdCBzYW1lUGlwZWxpbmVJbmRleCA9IHByb3BzLnRlbXBsYXRlcy5maW5kSW5kZXgoKHZhbHVlLCBpbmRleCwgb2JqZWN0KSA9PiB2YWx1ZS5pZCA9PT0gZm9jdXNQaXBlbGluZS5pZClcclxuXHRcdFx0aWYgKHNhbWVQaXBlbGluZUluZGV4ID09PSAtMSkge1xyXG5cdFx0XHRcdHNldEZvY3VzUGlwZWxpbmUocHJvcHMudGVtcGxhdGVzLmxlbmd0aCA+IDA/IHByb3BzLnRlbXBsYXRlc1swXSA6IHVuZGVmaW5lZClcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRzZXRGb2N1c1BpcGVsaW5lKHByb3BzLnRlbXBsYXRlc1tzYW1lUGlwZWxpbmVJbmRleF0pXHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuXHJcblx0XHR9XHJcblx0fSwgW3Byb3BzXSlcclxuXHJcblx0Y29uc3QgZ2V0TGVhZlN1YmplY3RzID0gKHJvb3RTdWJqZWN0OiBTdWJqZWN0TW9kZWwpOiBTdWJqZWN0TW9kZWxbXSA9PiB7XHJcblx0XHRjb25zdCBsZWFmU3ViamVjdHM6IFN1YmplY3RNb2RlbFtdID0gW11cclxuXHRcdGlubmVyU2VhcmNoTGVhZlN1YmplY3RzKHJvb3RTdWJqZWN0LCBsZWFmU3ViamVjdHMpXHJcblx0XHRyZXR1cm4gbGVhZlN1YmplY3RzXHJcblx0fVxyXG5cclxuXHRjb25zdCBpbm5lclNlYXJjaExlYWZTdWJqZWN0cyA9IChyb290U3ViamVjdDogU3ViamVjdE1vZGVsLCBsZWFmU3ViamVjdHM6IFN1YmplY3RNb2RlbFtdKSA9PiB7XHJcblx0XHRpZiAocm9vdFN1YmplY3QuY2hpbGRyZW4ubGVuZ3RoID09IDApIHtcclxuXHRcdFx0bGVhZlN1YmplY3RzLnB1c2gocm9vdFN1YmplY3QpXHJcblx0XHRcdHJldHVyblxyXG5cdFx0fVxyXG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCByb290U3ViamVjdC5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHRpbm5lclNlYXJjaExlYWZTdWJqZWN0cyhyb290U3ViamVjdC5jaGlsZHJlbltpXSwgbGVhZlN1YmplY3RzKVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Y29uc3QgbGVhZlN1YmplY3RzID0gdXNlTWVtbyhcclxuXHRcdCgpID0+IGdldExlYWZTdWJqZWN0cyhwcm9wcy5zdWJqZWN0KSwgW3Byb3BzLnN1YmplY3RdXHJcblx0KVxyXG5cclxuXHRjb25zdCBnZXREZWZhdWx0Rm9jdXNlZFBpcGVsaW5lID0gKHBpcGVsaW5lczogUGlwZWxpbmVNb2RlbFtdKSA9PiB7XHJcblx0XHRmb3IgKGNvbnN0IHBpcGVsaW5lIG9mIHBpcGVsaW5lcykge1xyXG5cdFx0XHRpZiAocGlwZWxpbmUuc3RhdHVzID09IE5vZGVTdGF0dXNFbnVtLldPUktJTkcpIHtcclxuXHRcdFx0XHRyZXR1cm4gcGlwZWxpbmVcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Zm9yIChjb25zdCBwaXBlbGluZSBvZiBwaXBlbGluZXMpIHtcclxuXHRcdFx0aWYgKHBpcGVsaW5lLnN0YXR1cyA9PSBOb2RlU3RhdHVzRW51bS5QRU5ESU5HKSB7XHJcblx0XHRcdFx0cmV0dXJuIHBpcGVsaW5lXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiB1bmRlZmluZWRcclxuXHR9XHJcblxyXG5cdGNvbnN0IGdldEthbmJhblBpcGVsaW5lcyA9ICgpID0+IHtcclxuXHRcdGNvbnN0IHNlY3Rpb25QaXBlbGluZXM6U2VjdGlvblBpcGVsaW5lc1tdID0gW11cclxuXHRcdGNvbnN0IHBlbmRpbmdQaXBlbGluZXMgPSBbXVxyXG5cdFx0Y29uc3Qgd29ya2luZ1BpcGVsaW5lcyA9IFtdXHJcblx0XHRjb25zdCBkb25lUGlwZWxpbmVzID0gW11cclxuXHRcdGZvciAoY29uc3QgcGlwZWxpbmUgb2YgcHJvcHMud29ya2Zsb3dzKSB7XHJcblx0XHRcdHN3aXRjaCAocGlwZWxpbmUuc3RhdHVzKSB7XHJcblx0XHRcdFx0Y2FzZSBOb2RlU3RhdHVzRW51bS5QRU5ESU5HOlxyXG5cdFx0XHRcdFx0cGVuZGluZ1BpcGVsaW5lcy5wdXNoKHBpcGVsaW5lKVxyXG5cdFx0XHRcdFx0YnJlYWtcclxuXHRcdFx0XHRjYXNlIE5vZGVTdGF0dXNFbnVtLldPUktJTkc6XHJcblx0XHRcdFx0XHR3b3JraW5nUGlwZWxpbmVzLnB1c2gocGlwZWxpbmUpXHJcblx0XHRcdFx0XHRicmVha1xyXG5cdFx0XHRcdGNhc2UgTm9kZVN0YXR1c0VudW0uRE9ORTpcclxuXHRcdFx0XHRcdGRvbmVQaXBlbGluZXMucHVzaChwaXBlbGluZSlcclxuXHRcdFx0XHRcdGJyZWFrXHJcblx0XHRcdFx0ZGVmYXVsdDpcclxuXHRcdFx0XHRcdGJyZWFrXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHNlY3Rpb25QaXBlbGluZXMucHVzaCh7c2VjdGlvbk5hbWU6IE5vZGVTdGF0dXNFbnVtLlBFTkRJTkcsIHBpcGVsaW5lczogcGVuZGluZ1BpcGVsaW5lc30pO1xyXG5cdFx0c2VjdGlvblBpcGVsaW5lcy5wdXNoKHtzZWN0aW9uTmFtZTogTm9kZVN0YXR1c0VudW0uV09SS0lORywgcGlwZWxpbmVzOiB3b3JraW5nUGlwZWxpbmVzfSk7XHJcblx0XHRzZWN0aW9uUGlwZWxpbmVzLnB1c2goe3NlY3Rpb25OYW1lOiBOb2RlU3RhdHVzRW51bS5ET05FLCBwaXBlbGluZXM6IGRvbmVQaXBlbGluZXN9KTtcclxuXHRcdHJldHVybiBzZWN0aW9uUGlwZWxpbmVzO1xyXG5cdH1cclxuXHJcblx0Y29uc3QgZ2V0VGVtcGxhdGVQaXBlbGluZXMgPSAoKSA9PiB7XHJcblx0XHRjb25zdCBzZWN0aW9uUGlwZWxpbmVzOlNlY3Rpb25QaXBlbGluZXNbXSA9IFtdXHJcblx0XHRzZWN0aW9uUGlwZWxpbmVzLnB1c2goe3NlY3Rpb25OYW1lOiAnVGVtcGxhdGUnLCBwaXBlbGluZXM6IHByb3BzLnRlbXBsYXRlc30pO1xyXG5cdFx0cmV0dXJuIHNlY3Rpb25QaXBlbGluZXM7XHJcblx0fVxyXG5cclxuXHRjb25zdCBnZXRGb2N1c1BpcGVsaW5lID0gKCkgPT4ge1xyXG5cdFx0aWYgKCFmb2N1c1BpcGVsaW5lKSB7XHJcblx0XHRcdHJldHVybiA8ZGl2IGNsYXNzTmFtZT17J3dvcmtmbG93LWNvbnRhaW5lci1vdXRlcid9IHN0eWxlPXt7d2lkdGg6ICcxMDAlJywgaGVpZ2h0OiAnMTAwJScsIGRpc3BsYXk6IFwiZmxleFwiLCBhbGlnbkl0ZW1zOiAnY2VudGVyJywganVzdGlmeUNvbnRlbnQ6ICdjZW50ZXInfX0+XHJcblx0XHRcdFx0PFR5cG9ncmFwaHkgc3g9e3ttaW5XaWR0aDogNTAwfX0+XHJcblx0XHRcdFx0XHRPcGVuIHRoZSBsZWZ0IGRyYXdlciB0byBjaG9vc2UgYSB3b3JrZmxvdy5cclxuXHRcdFx0XHRcdDxici8+XHJcblx0XHRcdFx0XHRPcGVuIHRoZSByaWdodCBkcmF3ZXIgdG8gbWFuYWdlIHRlbXBsYXRlcy5cclxuXHRcdFx0XHQ8L1R5cG9ncmFwaHk+XHJcblx0XHRcdDwvZGl2PlxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIDxQaXBlbGluZVZpZXcgcGlwZWxpbmU9e2ZvY3VzUGlwZWxpbmV9IC8+XHJcblx0fVxyXG5cclxuXHRjb25zdCBzZWxlY3RQaXBlbGluZSA9IChwaXBlbGluZTogUGlwZWxpbmVNb2RlbCkgPT4ge1xyXG5cdFx0c2V0Rm9jdXNQaXBlbGluZShwaXBlbGluZSlcclxuXHR9XHJcblxyXG5cdGNvbnN0IHdvcmtmbG93S2FuYmFuID0gPFdvcmtmbG93S2FuYmFuVmlldyBrYW5iYW5UaXRsZT17J3dvcmtmbG93J31cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgIHNlY3Rpb25QaXBlbGluZXM9e2dldEthbmJhblBpcGVsaW5lcygpfVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICAgc2VsZWN0ZWRQaXBlbGluZT17Zm9jdXNQaXBlbGluZX1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgIHNlbGVjdFBpcGVsaW5lPXtzZWxlY3RQaXBlbGluZX1cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgIHRlbXBsYXRlcz17cHJvcHMudGVtcGxhdGVzfVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICAgc3ViamVjdHM9e2xlYWZTdWJqZWN0c30vPlxyXG5cdGNvbnN0IHRlbXBsYXRlS2FuYmFuID0gPFdvcmtmbG93S2FuYmFuVmlldyBlZGl0b3JNb2RlPXt0cnVlfSBrYW5iYW5UaXRsZT17J3RlbXBsYXRlJ31cclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAgIHNlY3Rpb25QaXBlbGluZXM9e2dldFRlbXBsYXRlUGlwZWxpbmVzKCl9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgICBzZWxlY3RlZFBpcGVsaW5lPXtmb2N1c1BpcGVsaW5lfVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICAgc2VsZWN0UGlwZWxpbmU9e3NlbGVjdFBpcGVsaW5lfVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0ICAgdGVtcGxhdGVzPXtwcm9wcy50ZW1wbGF0ZXN9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgICBzdWJqZWN0cz17bGVhZlN1YmplY3RzfS8+XHJcblxyXG5cdGNvbnN0IGdldEZvbGRXb3JrZmxvd0thbmJhblZpZXcgPSAoKSA9PiB7XHJcblx0XHRyZXR1cm4gPGRpdiBzdHlsZT17e2hlaWdodDogJzEwMCUnLCBkaXNwbGF5OiAnZmxleCcsIGFsaWduSXRlbXM6ICdjZW50ZXInLCBqdXN0aWZ5Q29udGVudDogJ2NlbnRlcicsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nfX1cclxuXHRcdFx0XHRcdG9uQ2xpY2s9eygpID0+IHtcclxuXHRcdFx0XHRcdFx0c2V0V29ya2Zsb3dLYW5iYW5Gb2xkKCF3b3JrZmxvd0thbmJhbkZvbGQpXHJcblx0XHRcdFx0XHR9fT5cclxuXHRcdFx0eyF3b3JrZmxvd0thbmJhbkZvbGQgPyA8S2V5Ym9hcmREb3VibGVBcnJvd0xlZnRJY29uLz4gOiA8S2V5Ym9hcmREb3VibGVBcnJvd1JpZ2h0SWNvbi8+fVxyXG5cdFx0PC9kaXY+XHJcblx0fVxyXG5cclxuXHRjb25zdCBnZXRGb2xkVGVtcGxhdGVLYW5iYW5WaWV3ID0gKCkgPT4ge1xyXG5cdFx0cmV0dXJuIDxkaXYgc3R5bGU9e3toZWlnaHQ6ICcxMDAlJywgZGlzcGxheTogJ2ZsZXgnLCBhbGlnbkl0ZW1zOiAnY2VudGVyJ319XHJcblx0XHRcdFx0XHRvbkNsaWNrPXsoKSA9PiB7XHJcblx0XHRcdFx0XHRcdHNldFRlbXBsYXRlS2FuYmFuRm9sZCghdGVtcGxhdGVLYW5iYW5Gb2xkKVxyXG5cdFx0XHRcdFx0fX0+XHJcblx0XHRcdHshdGVtcGxhdGVLYW5iYW5Gb2xkID8gPEtleWJvYXJkRG91YmxlQXJyb3dSaWdodEljb24vPiA6IDxLZXlib2FyZERvdWJsZUFycm93TGVmdEljb24vPiB9XHJcblx0XHQ8L2Rpdj5cclxuXHR9XHJcblxyXG5cdGNvbnN0IGdldFdvcmtmbG93S2FuYmFuID0gKCkgPT4ge1xyXG5cdFx0cmV0dXJuIDxkaXYgY2xhc3NOYW1lPXsnd29ya2Zsb3ctY29udGFpbmVyLW91dGVyJ30gc3R5bGU9e3twb3NpdGlvbjogJ2Fic29sdXRlJywgbGVmdDogMCwgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAncm93JywgaGVpZ2h0OiAnMTAwJScsIHBhZGRpbmc6IDEwfX0+XHJcblx0XHRcdHtnZXRGb2xkV29ya2Zsb3dLYW5iYW5WaWV3KCl9XHJcblx0XHRcdHshd29ya2Zsb3dLYW5iYW5Gb2xkID8gd29ya2Zsb3dLYW5iYW4gOiBudWxsfVxyXG5cdFx0PC9kaXY+XHJcblx0fVxyXG5cclxuXHRjb25zdCBnZXRUZW1wbGF0ZUthbmJhbiA9ICgpID0+IHtcclxuXHRcdHJldHVybiA8ZGl2IGNsYXNzTmFtZT17J3dvcmtmbG93LWNvbnRhaW5lci1vdXRlcid9IHN0eWxlPXt7cG9zaXRpb246ICdhYnNvbHV0ZScsIHJpZ2h0OiAwLCBkaXNwbGF5OiAnZmxleCcsIGZsZXhEaXJlY3Rpb246ICdyb3cnLCBoZWlnaHQ6ICcxMDAlJywgcGFkZGluZzogMTAsIG1hcmdpblRvcDogMTAsIG1hcmdpbkJvdHRvbTogMTB9fT5cclxuXHRcdFx0eyF0ZW1wbGF0ZUthbmJhbkZvbGQgPyB0ZW1wbGF0ZUthbmJhbiA6IG51bGx9XHJcblx0XHRcdHtnZXRGb2xkVGVtcGxhdGVLYW5iYW5WaWV3KCl9XHJcblx0XHQ8L2Rpdj5cclxuXHR9XHJcblxyXG5cdGNvbnN0IGdldEZsb2F0aW5nQmFyVmlldyA9ICgpID0+IHtcclxuXHRcdHJldHVybiA8RmxvYXRpbmdCYXJWaWV3IGZvY3VzZWRQaXBlbGluZT17Zm9jdXNQaXBlbGluZX0gcG9tb2Rvcm9BcnJheT17cHJvcHMucG9tb2Rvcm99IHN1YmplY3Q9e3Byb3BzLnN1YmplY3R9IC8+XHJcblx0fVxyXG5cclxuXHRyZXR1cm4gKFxyXG5cdFx0PGRpdiBzdHlsZT17e1xyXG5cdFx0XHRkaXNwbGF5OiAnZmxleCcsXHJcblx0XHRcdGZsZXhEaXJlY3Rpb246ICdyb3cnLFxyXG5cdFx0XHRhbGlnbkl0ZW1zOiAnY2VudGVyJyxcclxuXHRcdFx0aGVpZ2h0OiAnMTAwJScsXHJcblx0XHRcdHdpZHRoOiAnMTAwJScsXHJcblx0XHR9fT5cclxuXHRcdFx0e2dldEZvY3VzUGlwZWxpbmUoKX1cclxuXHRcdFx0e2dldFdvcmtmbG93S2FuYmFuKCl9XHJcblx0XHRcdHtnZXRUZW1wbGF0ZUthbmJhbigpfVxyXG5cdFx0XHR7Z2V0RmxvYXRpbmdCYXJWaWV3KCl9XHJcblx0XHQ8L2Rpdj5cclxuXHQpXHJcbn1cclxuIl19