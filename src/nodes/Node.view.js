import * as React from "react";
import { useContext, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Divider, Menu, MenuItem, Typography } from "@mui/material";
import { NodeActionEnum, NodeStatusEnum } from "./NodeStatus.enum";
import { TimeUtils } from "../utils/Time.utils";
import DeleteIcon from '@mui/icons-material/Delete';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import RunCircleIcon from '@mui/icons-material/RunCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { WorkPanelContext } from "../workpanel/WorkPanel.view";
import { UpdateMode } from "../workpanel/WorkPanel.controller";
import NodeShortcutView from "./NodeShortcut.view";
export default function NodeView(nodeViewProps) {
    var _a, _b;
    const workPanelController = useContext(WorkPanelContext);
    const { pipeline, section, node, couldUpdate, editorMode } = nodeViewProps;
    const [showTips, setShowTips] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [title, setTitle] = useState(node.title);
    const [tipSummary, setTipSummary] = useState(((_a = node.tips) === null || _a === void 0 ? void 0 : _a.summary) || '');
    const [tipContent, setTipContent] = useState(((_b = node.tips) === null || _b === void 0 ? void 0 : _b.content) || '');
    const open = Boolean(anchorEl);
    useEffect(() => {
        var _a, _b;
        setTitle(node.title);
        setTipSummary(((_a = node.tips) === null || _a === void 0 ? void 0 : _a.summary) || '');
        setTipContent(((_b = node.tips) === null || _b === void 0 ? void 0 : _b.content) || '');
    }, [node]);
    const handleStatusClick = (event) => {
        if (!couldUpdate || editorMode) {
            return;
        }
        if (node.status == NodeStatusEnum.DONE) {
            return;
        }
        setAnchorEl(event.currentTarget);
    };
    const onNodeUpdate = () => {
        const newNode = Object.assign({}, node);
        workPanelController.updateNode(pipeline, section, newNode);
        console.log('onNodeUpdate is called');
    };
    const onNodeDelete = () => {
        workPanelController.updateNode(pipeline, section, node, UpdateMode.DELETE);
    };
    const handleClose = (action) => {
        setAnchorEl(null);
        if (!action)
            return;
        switch (action) {
            case NodeActionEnum.WORK:
                node.status = NodeStatusEnum.WORKING;
                node.startTime = Date.now();
                break;
            case NodeActionEnum.CANCEL:
                node.status = NodeStatusEnum.PENDING;
                node.startTime = 0;
                break;
            case NodeActionEnum.FINISH:
                node.status = NodeStatusEnum.DONE;
                node.finishTime = Date.now();
                break;
            case NodeActionEnum.FINISH_DIRECTLY:
                node.status = NodeStatusEnum.DONE;
                node.startTime = Date.now();
                node.finishTime = Date.now();
                break;
        }
        onNodeUpdate();
    };
    const getColorFromNodeStatus = () => {
        if (!couldUpdate || editorMode) {
            return "#6C6C6C";
        }
        switch (node.status) {
            case NodeStatusEnum.PENDING:
                return '#7e57c2';
            case NodeStatusEnum.WORKING:
                return '#42a5f5';
            case NodeStatusEnum.DONE:
                return '#9ccc65';
        }
    };
    const getStatusIcon = () => {
        switch (node.status) {
            case NodeStatusEnum.PENDING:
                return React.createElement(WatchLaterIcon, { htmlColor: getColorFromNodeStatus() });
            case NodeStatusEnum.WORKING:
                return React.createElement(RunCircleIcon, { htmlColor: getColorFromNodeStatus() });
            case NodeStatusEnum.DONE:
                return React.createElement(CheckCircleIcon, { htmlColor: getColorFromNodeStatus() });
        }
    };
    const getMenuItems = () => {
        let items = [];
        switch (node.status) {
            case NodeStatusEnum.PENDING:
                items.push([
                    React.createElement(MenuItem, { sx: { fontSize: 13 }, onClick: () => {
                            handleClose(NodeActionEnum.WORK);
                        } }, NodeActionEnum.WORK),
                    React.createElement(MenuItem, { sx: { fontSize: 13 }, onClick: () => {
                            handleClose(NodeActionEnum.FINISH_DIRECTLY);
                        } }, NodeActionEnum.FINISH_DIRECTLY),
                ]);
                break;
            case NodeStatusEnum.WORKING:
                items.push([
                    React.createElement(MenuItem, { sx: { fontSize: 13 }, onClick: () => {
                            handleClose(NodeActionEnum.CANCEL);
                        } }, NodeActionEnum.CANCEL),
                    React.createElement(MenuItem, { sx: { fontSize: 13 }, onClick: () => {
                            handleClose(NodeActionEnum.FINISH);
                        } }, NodeActionEnum.FINISH)
                ]);
                break;
            case NodeStatusEnum.DONE:
                break;
        }
        return items;
    };
    const clearTips = () => {
        setTipSummary('');
        setTipContent('');
    };
    const getTipsButton = () => {
        if (!editorMode) {
            if (showTips) {
                return React.createElement(UnfoldLessIcon, { onClick: () => { setShowTips(!showTips); } });
            }
            else {
                return React.createElement(UnfoldMoreIcon, { onClick: () => { setShowTips(!showTips); } });
            }
        }
        else {
            return React.createElement(HighlightOffIcon, { onClick: () => clearTips() });
        }
    };
    const getTipsView = () => {
        if (!editorMode && !node.tips.summary) {
            return false;
        }
        return React.createElement("div", null,
            React.createElement(Divider, { sx: { marginY: '3px' } }),
            React.createElement(Box, { sx: { display: 'flex', flexDirection: 'column', justifyContent: 'space-between' } },
                React.createElement(Box, { sx: {
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    } },
                    getTipSummaryView(),
                    getTipsButton()),
                getTipsContentView()));
    };
    const getTipSummaryView = () => {
        if (!editorMode) {
            return React.createElement(Typography, { sx: { fontSize: 14, fontWeight: '600' } }, node.tips.summary);
        }
        else {
            return React.createElement("input", { className: 'workflow-input', placeholder: 'Tip summary', style: { fontSize: 14, maxWidth: 130, fontWeight: 600 }, id: "tip-summary", value: tipSummary, onChange: handleNodeTipSummaryChange });
        }
    };
    const getTipsContentView = () => {
        if (!editorMode) {
            if (!node.tips.content) {
                return null;
            }
            if (showTips) {
                return React.createElement(Typography, { sx: { fontSize: 12 } }, node.tips.content);
            }
            else {
                return null;
            }
        }
        else {
            return React.createElement("textarea", { placeholder: 'Tip content', style: { fontSize: 12, marginTop: 3, minWidth: 160, maxWidth: 160 }, id: "tip-content", value: tipContent, onChange: handleNodeTipContentChange });
        }
    };
    const getTimeDetails = () => {
        if (editorMode) {
            return false;
        }
        let details = [];
        switch (node.status) {
            case NodeStatusEnum.DONE:
                details.push(React.createElement(Typography, { sx: { fontSize: 12 } }, 'Finish: ' + TimeUtils.getDateTimeStr(node.finishTime)));
                details.push(React.createElement(Typography, { sx: { fontSize: 12 } }, 'Start: ' + TimeUtils.getDateTimeStr(node.startTime)));
                break;
            case NodeStatusEnum.WORKING:
                details.push(React.createElement(Typography, { sx: { fontSize: 12 } }, 'Start: ' + TimeUtils.getDateTimeStr(node.startTime)));
                break;
            case NodeStatusEnum.PENDING:
                break;
        }
        if (!details || details.length == 0) {
            return false;
        }
        return React.createElement("div", null,
            React.createElement(Divider, { sx: { marginY: '3px' } }),
            details);
    };
    const handleNodeNameChange = (event) => {
        setTitle(event.target.value);
        node.title = event.target.value;
        onNodeUpdate();
    };
    const handleNodeTipSummaryChange = (event) => {
        setTipSummary(event.target.value);
        node.tips.summary = event.target.value;
        onNodeUpdate();
    };
    const handleNodeTipContentChange = (event) => {
        setTipContent(event.target.value);
        node.tips.content = event.target.value;
        onNodeUpdate();
    };
    const handleNodeShortCutChange = (nodeShortCutModel) => {
        node.shortcut = nodeShortCutModel;
        onNodeUpdate();
    };
    const getHeaderView = () => {
        return React.createElement("div", null,
            React.createElement(Box, { sx: {
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                } },
                getTitleView(),
                getActionView()));
    };
    const getTitleView = () => {
        if (!editorMode) {
            return React.createElement(Typography, { sx: { fontSize: 14, fontWeight: 600 } }, node.title);
        }
        else {
            return React.createElement("input", { className: 'workflow-input', style: { fontSize: 14, maxWidth: 130, fontWeight: 600 }, id: "title", value: title, onChange: handleNodeNameChange });
        }
    };
    const getActionView = () => {
        if (!editorMode) {
            return (React.createElement("div", null,
                React.createElement("div", { onClick: handleStatusClick }, getStatusIcon()),
                React.createElement(Menu, { "aria-labelledby": "node-manage", anchorEl: anchorEl, open: open, onClose: () => {
                        handleClose();
                    } }, getMenuItems())));
        }
        else {
            return (React.createElement(DeleteIcon, { onClick: () => onNodeDelete() }));
        }
    };
    return (React.createElement(Box, { className: 'workflow-container-inner', sx: { width: 180, padding: 1, borderRadius: 1, boxShadow: 1, id: node.id } },
        getHeaderView(),
        getTipsView(),
        getTimeDetails(),
        React.createElement(NodeShortcutView, { editorMode: editorMode, nodeShortCutModel: node.shortcut, onUpdateShortCut: handleNodeShortCutChange })));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTm9kZS52aWV3LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiTm9kZS52aWV3LnRzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEtBQUssS0FBSyxNQUFNLE9BQU8sQ0FBQztBQUMvQixPQUFPLEVBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUMsTUFBTSxPQUFPLENBQUM7QUFDdEQsT0FBTyxHQUFHLE1BQU0sbUJBQW1CLENBQUM7QUFDcEMsT0FBTyxFQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNsRSxPQUFPLEVBQUMsY0FBYyxFQUFFLGNBQWMsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBRWpFLE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxxQkFBcUIsQ0FBQztBQUM5QyxPQUFPLFVBQVUsTUFBTSw0QkFBNEIsQ0FBQztBQUNwRCxPQUFPLGNBQWMsTUFBTSxnQ0FBZ0MsQ0FBQztBQUM1RCxPQUFPLGFBQWEsTUFBTSwrQkFBK0IsQ0FBQztBQUMxRCxPQUFPLGVBQWUsTUFBTSxpQ0FBaUMsQ0FBQztBQUM5RCxPQUFPLGNBQWMsTUFBTSxnQ0FBZ0MsQ0FBQztBQUM1RCxPQUFPLGNBQWMsTUFBTSxnQ0FBZ0MsQ0FBQztBQUM1RCxPQUFPLGdCQUFnQixNQUFNLGtDQUFrQyxDQUFDO0FBRWhFLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLDZCQUE2QixDQUFDO0FBQzdELE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxtQ0FBbUMsQ0FBQztBQUM3RCxPQUFPLGdCQUFnQixNQUFNLHFCQUFxQixDQUFDO0FBVW5ELE1BQU0sQ0FBQyxPQUFPLFVBQVUsUUFBUSxDQUFDLGFBQXdCOztJQUV4RCxNQUFNLG1CQUFtQixHQUFHLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFBO0lBRXhELE1BQU0sRUFBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxXQUFXLEVB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RDthQUFNO1lBQ04sT0FBTyxDQUNOLG9CQUFDLFVBQVUsSUFBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsWUFBWSxFQUFFLEdBQUcsQ0FDNUMsQ0FBQTtTQUNEO0lBQ0YsQ0FBQyxDQUFBO0lBRUQsT0FBTyxDQUNOLG9CQUFDLEdBQUcsSUFBQyxTQUFTLEVBQUUsMEJBQTBCLEVBQUUsRUFBRSxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLFlBQVksRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxDQUFDLEVBQUUsRUFBQztRQUNsSCxhQUFhLEVBQUU7UUFDZixXQUFXLEVBQUU7UUFDYixjQUFjLEVBQUU7UUFDakIsb0JBQUMsZ0JBQWdCLElBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLGdCQUFnQixFQUFFLHdCQUF3QixHQUFJLENBQ3JILENBQ04sQ0FBQztBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IHt1c2VDb250ZXh0LCB1c2VFZmZlY3QsIHVzZVN0YXRlfSBmcm9tIFwicmVhY3RcIjtcclxuaW1wb3J0IEJveCBmcm9tIFwiQG11aS9tYXRlcmlhbC9Cb3hcIjtcclxuaW1wb3J0IHtEaXZpZGVyLCBNZW51LCBNZW51SXRlbSwgVHlwb2dyYXBoeX0gZnJvbSBcIkBtdWkvbWF0ZXJpYWxcIjtcclxuaW1wb3J0IHtOb2RlQWN0aW9uRW51bSwgTm9kZVN0YXR1c0VudW19IGZyb20gXCIuL05vZGVTdGF0dXMuZW51bVwiO1xyXG5pbXBvcnQge05vZGVNb2RlbCwgTm9kZVNob3J0Y3V0fSBmcm9tIFwiLi9Ob2RlLm1vZGVsXCI7XHJcbmltcG9ydCB7VGltZVV0aWxzfSBmcm9tIFwiLi4vdXRpbHMvVGltZS51dGlsc1wiO1xyXG5pbXBvcnQgRGVsZXRlSWNvbiBmcm9tICdAbXVpL2ljb25zLW1hdGVyaWFsL0RlbGV0ZSc7XHJcbmltcG9ydCBXYXRjaExhdGVySWNvbiBmcm9tICdAbXVpL2ljb25zLW1hdGVyaWFsL1dhdGNoTGF0ZXInO1xyXG5pbXBvcnQgUnVuQ2lyY2xlSWNvbiBmcm9tICdAbXVpL2ljb25zLW1hdGVyaWFsL1J1bkNpcmNsZSc7XHJcbmltcG9ydCBDaGVja0NpcmNsZUljb24gZnJvbSAnQG11aS9pY29ucy1tYXRlcmlhbC9DaGVja0NpcmNsZSc7XHJcbmltcG9ydCBVbmZvbGRMZXNzSWNvbiBmcm9tICdAbXVpL2ljb25zLW1hdGVyaWFsL1VuZm9sZExlc3MnO1xyXG5pbXBvcnQgVW5mb2xkTW9yZUljb24gZnJvbSAnQG11aS9pY29ucy1tYXRlcmlhbC9VbmZvbGRNb3JlJztcclxuaW1wb3J0IEhpZ2hsaWdodE9mZkljb24gZnJvbSAnQG11aS9pY29ucy1tYXRlcmlhbC9IaWdobGlnaHRPZmYnO1xyXG5pbXBvcnQge1BpcGVsaW5lTW9kZWwsIFNlY3Rpb25Nb2RlbH0gZnJvbSBcIi4uL3BpcGVsaW5lL1BpcGVsaW5lLm1vZGVsXCI7XHJcbmltcG9ydCB7V29ya1BhbmVsQ29udGV4dH0gZnJvbSBcIi4uL3dvcmtwYW5lbC9Xb3JrUGFuZWwudmlld1wiO1xyXG5pbXBvcnQge1VwZGF0ZU1vZGV9IGZyb20gXCIuLi93b3JrcGFuZWwvV29ya1BhbmVsLmNvbnRyb2xsZXJcIjtcclxuaW1wb3J0IE5vZGVTaG9ydGN1dFZpZXcgZnJvbSBcIi4vTm9kZVNob3J0Y3V0LnZpZXdcIjtcclxuXHJcbmludGVyZmFjZSBOb2RlUHJvcHMge1xyXG5cdHBpcGVsaW5lOiBQaXBlbGluZU1vZGVsLFxyXG5cdHNlY3Rpb246IFNlY3Rpb25Nb2RlbCxcclxuXHRub2RlOiBOb2RlTW9kZWwsXHJcblx0Y291bGRVcGRhdGU6IGJvb2xlYW4sXHJcblx0ZWRpdG9yTW9kZT86IGJvb2xlYW4sXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE5vZGVWaWV3KG5vZGVWaWV3UHJvcHM6IE5vZGVQcm9wcykge1xyXG5cclxuXHRjb25zdCB3b3JrUGFuZWxDb250cm9sbGVyID0gdXNlQ29udGV4dChXb3JrUGFuZWxDb250ZXh0KVxyXG5cclxuXHRjb25zdCB7cGlwZWxpbmUsIHNlY3Rpb24sIG5vZGUsIGNvdWxkVXBkYXRlLCBlZGl0b3JNb2RlfSA9IG5vZGVWaWV3UHJvcHNcclxuXHJcblx0Y29uc3QgW3Nob3dUaXBzLCBzZXRTaG93VGlwc10gPSB1c2VTdGF0ZShmYWxzZSlcclxuXHRjb25zdCBbYW5jaG9yRWwsIHNldEFuY2hvckVsXSA9IHVzZVN0YXRlPG51bGwgfCBIVE1MRGl2RWxlbWVudD4obnVsbCk7XHJcblx0Y29uc3QgW3RpdGxlLCBzZXRUaXRsZV0gPSB1c2VTdGF0ZShub2RlLnRpdGxlKVxyXG5cdGNvbnN0IFt0aXBTdW1tYXJ5LCBzZXRUaXBTdW1tYXJ5XSA9IHVzZVN0YXRlKG5vZGUudGlwcz8uc3VtbWFyeSB8fCAnJylcclxuXHRjb25zdCBbdGlwQ29udGVudCwgc2V0VGlwQ29udGVudF0gPSB1c2VTdGF0ZShub2RlLnRpcHM/LmNvbnRlbnQgfHwgJycpXHJcblxyXG5cdGNvbnN0IG9wZW4gPSBCb29sZWFuKGFuY2hvckVsKTtcclxuXHJcblx0dXNlRWZmZWN0KCgpID0+IHtcclxuXHRcdHNldFRpdGxlKG5vZGUudGl0bGUpXHJcblx0XHRzZXRUaXBTdW1tYXJ5KG5vZGUudGlwcz8uc3VtbWFyeSB8fCAnJylcclxuXHRcdHNldFRpcENvbnRlbnQobm9kZS50aXBzPy5jb250ZW50IHx8ICcnKVxyXG5cdH0sIFtub2RlXSlcclxuXHJcblx0Y29uc3QgaGFuZGxlU3RhdHVzQ2xpY2sgPSAoZXZlbnQ6IFJlYWN0Lk1vdXNlRXZlbnQ8SFRNTERpdkVsZW1lbnQ+KSA9PiB7XHJcblx0XHRpZiAoIWNvdWxkVXBkYXRlIHx8IGVkaXRvck1vZGUpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0aWYgKG5vZGUuc3RhdHVzID09IE5vZGVTdGF0dXNFbnVtLkRPTkUpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0c2V0QW5jaG9yRWwoZXZlbnQuY3VycmVudFRhcmdldCk7XHJcblx0fTtcclxuXHJcblx0Y29uc3Qgb25Ob2RlVXBkYXRlID0gKCkgPT4ge1xyXG5cdFx0Y29uc3QgbmV3Tm9kZSA9IE9iamVjdC5hc3NpZ24oe30sIG5vZGUpXHJcblx0XHR3b3JrUGFuZWxDb250cm9sbGVyLnVwZGF0ZU5vZGUocGlwZWxpbmUsIHNlY3Rpb24sIG5ld05vZGUpXHJcblx0XHRjb25zb2xlLmxvZygnb25Ob2RlVXBkYXRlIGlzIGNhbGxlZCcpXHJcblx0fVxyXG5cclxuXHRjb25zdCBvbk5vZGVEZWxldGUgPSAoKSA9PiB7XHJcblx0XHR3b3JrUGFuZWxDb250cm9sbGVyLnVwZGF0ZU5vZGUocGlwZWxpbmUsIHNlY3Rpb24sIG5vZGUsIFVwZGF0ZU1vZGUuREVMRVRFKVxyXG5cdH1cclxuXHJcblx0Y29uc3QgaGFuZGxlQ2xvc2UgPSAoYWN0aW9uPzogTm9kZUFjdGlvbkVudW0pID0+IHtcclxuXHRcdHNldEFuY2hvckVsKG51bGwpO1xyXG5cdFx0aWYgKCFhY3Rpb24pXHJcblx0XHRcdHJldHVyblxyXG5cdFx0c3dpdGNoIChhY3Rpb24pIHtcclxuXHRcdFx0Y2FzZSBOb2RlQWN0aW9uRW51bS5XT1JLOlxyXG5cdFx0XHRcdG5vZGUuc3RhdHVzID0gTm9kZVN0YXR1c0VudW0uV09SS0lOR1xyXG5cdFx0XHRcdG5vZGUuc3RhcnRUaW1lID0gRGF0ZS5ub3coKVxyXG5cdFx0XHRcdGJyZWFrXHJcblx0XHRcdGNhc2UgTm9kZUFjdGlvbkVudW0uQ0FOQ0VMOlxyXG5cdFx0XHRcdG5vZGUuc3RhdHVzID0gTm9kZVN0YXR1c0VudW0uUEVORElOR1xyXG5cdFx0XHRcdG5vZGUuc3RhcnRUaW1lID0gMFxyXG5cdFx0XHRcdGJyZWFrXHJcblx0XHRcdGNhc2UgTm9kZUFjdGlvbkVudW0uRklOSVNIOlxyXG5cdFx0XHRcdG5vZGUuc3RhdHVzID0gTm9kZVN0YXR1c0VudW0uRE9ORVxyXG5cdFx0XHRcdG5vZGUuZmluaXNoVGltZSA9IERhdGUubm93KClcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSBOb2RlQWN0aW9uRW51bS5GSU5JU0hfRElSRUNUTFk6XHJcblx0XHRcdFx0bm9kZS5zdGF0dXMgPSBOb2RlU3RhdHVzRW51bS5ET05FXHJcblx0XHRcdFx0bm9kZS5zdGFydFRpbWUgPSBEYXRlLm5vdygpXHJcblx0XHRcdFx0bm9kZS5maW5pc2hUaW1lID0gRGF0ZS5ub3coKVxyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0fVxyXG5cdFx0b25Ob2RlVXBkYXRlKCk7XHJcblx0fTtcclxuXHJcblx0Y29uc3QgZ2V0Q29sb3JGcm9tTm9kZVN0YXR1cyA9ICgpID0+IHtcclxuXHRcdGlmICghY291bGRVcGRhdGUgfHwgZWRpdG9yTW9kZSkge1xyXG5cdFx0XHRyZXR1cm4gXCIjNkM2QzZDXCJcclxuXHRcdH1cclxuXHRcdHN3aXRjaCAobm9kZS5zdGF0dXMpIHtcclxuXHRcdFx0Y2FzZSBOb2RlU3RhdHVzRW51bS5QRU5ESU5HOlxyXG5cdFx0XHRcdHJldHVybiAnIzdlNTdjMidcclxuXHRcdFx0Y2FzZSBOb2RlU3RhdHVzRW51bS5XT1JLSU5HOlxyXG5cdFx0XHRcdHJldHVybiAnIzQyYTVmNSdcclxuXHRcdFx0Y2FzZSBOb2RlU3RhdHVzRW51bS5ET05FOlxyXG5cdFx0XHRcdHJldHVybiAnIzljY2M2NSdcclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHRjb25zdCBnZXRTdGF0dXNJY29uID0gKCkgPT4ge1xyXG5cdFx0c3dpdGNoIChub2RlLnN0YXR1cykge1xyXG5cdFx0XHRjYXNlIE5vZGVTdGF0dXNFbnVtLlBFTkRJTkc6XHJcblx0XHRcdFx0cmV0dXJuIDxXYXRjaExhdGVySWNvbiBodG1sQ29sb3I9e2dldENvbG9yRnJvbU5vZGVTdGF0dXMoKX0vPlxyXG5cdFx0XHRjYXNlIE5vZGVTdGF0dXNFbnVtLldPUktJTkc6XHJcblx0XHRcdFx0cmV0dXJuIDxSdW5DaXJjbGVJY29uIGh0bWxDb2xvcj17Z2V0Q29sb3JGcm9tTm9kZVN0YXR1cygpfS8+XHJcblx0XHRcdGNhc2UgTm9kZVN0YXR1c0VudW0uRE9ORTpcclxuXHRcdFx0XHRyZXR1cm4gPENoZWNrQ2lyY2xlSWNvbiBodG1sQ29sb3I9e2dldENvbG9yRnJvbU5vZGVTdGF0dXMoKX0vPlxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Y29uc3QgZ2V0TWVudUl0ZW1zID0gKCkgPT4ge1xyXG5cdFx0bGV0IGl0ZW1zID0gW11cclxuXHRcdHN3aXRjaCAobm9kZS5zdGF0dXMpIHtcclxuXHRcdFx0Y2FzZSBOb2RlU3RhdHVzRW51bS5QRU5ESU5HOlxyXG5cdFx0XHRcdGl0ZW1zLnB1c2goW1xyXG5cdFx0XHRcdFx0PE1lbnVJdGVtIHN4PXt7Zm9udFNpemU6IDEzfX0gb25DbGljaz17KCkgPT4ge1xyXG5cdFx0XHRcdFx0XHRoYW5kbGVDbG9zZShOb2RlQWN0aW9uRW51bS5XT1JLKVxyXG5cdFx0XHRcdFx0fX0+e05vZGVBY3Rpb25FbnVtLldPUkt9PC9NZW51SXRlbT4sXHJcblx0XHRcdFx0XHQ8TWVudUl0ZW0gc3g9e3tmb250U2l6ZTogMTN9fSBvbkNsaWNrPXsoKSA9PiB7XHJcblx0XHRcdFx0XHRcdGhhbmRsZUNsb3NlKE5vZGVBY3Rpb25FbnVtLkZJTklTSF9ESVJFQ1RMWSlcclxuXHRcdFx0XHRcdH19PntOb2RlQWN0aW9uRW51bS5GSU5JU0hfRElSRUNUTFl9PC9NZW51SXRlbT4sXHJcblx0XHRcdFx0XSlcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSBOb2RlU3RhdHVzRW51bS5XT1JLSU5HOlxyXG5cdFx0XHRcdGl0ZW1zLnB1c2goW1xyXG5cdFx0XHRcdFx0PE1lbnVJdGVtIHN4PXt7Zm9udFNpemU6IDEzfX0gb25DbGljaz17KCkgPT4ge1xyXG5cdFx0XHRcdFx0XHRoYW5kbGVDbG9zZShOb2RlQWN0aW9uRW51bS5DQU5DRUwpXHJcblx0XHRcdFx0XHR9fT57Tm9kZUFjdGlvbkVudW0uQ0FOQ0VMfTwvTWVudUl0ZW0+LFxyXG5cdFx0XHRcdFx0PE1lbnVJdGVtIHN4PXt7Zm9udFNpemU6IDEzfX0gb25DbGljaz17KCkgPT4ge1xyXG5cdFx0XHRcdFx0XHRoYW5kbGVDbG9zZShOb2RlQWN0aW9uRW51bS5GSU5JU0gpXHJcblx0XHRcdFx0XHR9fT57Tm9kZUFjdGlvbkVudW0uRklOSVNIfTwvTWVudUl0ZW0+XHJcblx0XHRcdFx0XSlcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSBOb2RlU3RhdHVzRW51bS5ET05FOlxyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGl0ZW1zO1xyXG5cdH1cclxuXHJcblx0Y29uc3QgY2xlYXJUaXBzID0gKCkgPT4ge1xyXG5cdFx0c2V0VGlwU3VtbWFyeSgnJylcclxuXHRcdHNldFRpcENvbnRlbnQoJycpXHJcblx0fVxyXG5cclxuXHRjb25zdCBnZXRUaXBzQnV0dG9uID0gKCkgPT4ge1xyXG5cdFx0aWYgKCFlZGl0b3JNb2RlKSB7XHJcblx0XHRcdGlmIChzaG93VGlwcykge1xyXG5cdFx0XHRcdHJldHVybiA8VW5mb2xkTGVzc0ljb24gb25DbGljaz17KCk9PntzZXRTaG93VGlwcyghc2hvd1RpcHMpfX0vPlxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiA8VW5mb2xkTW9yZUljb24gb25DbGljaz17KCk9PntzZXRTaG93VGlwcyghc2hvd1RpcHMpfX0vPlxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlIHtcclxuXHRcdFx0cmV0dXJuIDxIaWdobGlnaHRPZmZJY29uIG9uQ2xpY2s9eygpID0+IGNsZWFyVGlwcygpfSAvPlxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Y29uc3QgZ2V0VGlwc1ZpZXcgPSAoKSA9PiB7XHJcblx0XHRpZiAoIWVkaXRvck1vZGUgJiYgIW5vZGUudGlwcy5zdW1tYXJ5KSB7XHJcblx0XHRcdHJldHVybiBmYWxzZVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIDxkaXY+XHJcblx0XHRcdDxEaXZpZGVyIHN4PXt7bWFyZ2luWTogJzNweCd9fS8+XHJcblx0XHRcdDxCb3ggc3g9e3tkaXNwbGF5OiAnZmxleCcsIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLCBqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nfX0+XHJcblx0XHRcdFx0PEJveCBzeD17e1xyXG5cdFx0XHRcdFx0ZGlzcGxheTogJ2ZsZXgnLFxyXG5cdFx0XHRcdFx0ZmxleERpcmVjdGlvbjogJ3JvdycsXHJcblx0XHRcdFx0XHRhbGlnbkl0ZW1zOiAnY2VudGVyJyxcclxuXHRcdFx0XHRcdGp1c3RpZnlDb250ZW50OiAnc3BhY2UtYmV0d2VlbicsXHJcblx0XHRcdFx0fX0+XHJcblx0XHRcdFx0XHR7Z2V0VGlwU3VtbWFyeVZpZXcoKX1cclxuXHRcdFx0XHRcdHtnZXRUaXBzQnV0dG9uKCl9XHJcblx0XHRcdFx0PC9Cb3g+XHJcblx0XHRcdFx0e2dldFRpcHNDb250ZW50VmlldygpfVxyXG5cdFx0XHQ8L0JveD5cclxuXHRcdDwvZGl2PlxyXG5cdH1cclxuXHJcblx0Y29uc3QgZ2V0VGlwU3VtbWFyeVZpZXcgPSAoKSA9PiB7XHJcblx0XHRpZiAoIWVkaXRvck1vZGUpIHtcclxuXHRcdFx0cmV0dXJuIDxUeXBvZ3JhcGh5IHN4PXt7Zm9udFNpemU6IDE0LCBmb250V2VpZ2h0OiAnNjAwJ319Pntub2RlLnRpcHMuc3VtbWFyeX08L1R5cG9ncmFwaHk+XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gPGlucHV0IGNsYXNzTmFtZT17J3dvcmtmbG93LWlucHV0J30gcGxhY2Vob2xkZXI9eydUaXAgc3VtbWFyeSd9IHN0eWxlPXt7Zm9udFNpemU6IDE0LCBtYXhXaWR0aDogMTMwLCBmb250V2VpZ2h0OiA2MDB9fSBpZD1cInRpcC1zdW1tYXJ5XCIgdmFsdWU9e3RpcFN1bW1hcnl9IG9uQ2hhbmdlPXtoYW5kbGVOb2RlVGlwU3VtbWFyeUNoYW5nZX0gLz5cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGNvbnN0IGdldFRpcHNDb250ZW50VmlldyA9ICgpID0+IHtcclxuXHRcdGlmICghZWRpdG9yTW9kZSkge1xyXG5cdFx0XHRpZiAoIW5vZGUudGlwcy5jb250ZW50KSB7XHJcblx0XHRcdFx0cmV0dXJuIG51bGxcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoc2hvd1RpcHMpIHtcclxuXHRcdFx0XHRyZXR1cm4gPFR5cG9ncmFwaHkgc3g9e3tmb250U2l6ZTogMTJ9fT57bm9kZS50aXBzLmNvbnRlbnR9PC9UeXBvZ3JhcGh5PlxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiBudWxsXHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gPHRleHRhcmVhIHBsYWNlaG9sZGVyPXsnVGlwIGNvbnRlbnQnfSBzdHlsZT17e2ZvbnRTaXplOiAxMiwgbWFyZ2luVG9wOiAzLCBtaW5XaWR0aDogMTYwLCBtYXhXaWR0aDogMTYwfX0gaWQ9XCJ0aXAtY29udGVudFwiIHZhbHVlPXt0aXBDb250ZW50fSBvbkNoYW5nZT17aGFuZGxlTm9kZVRpcENvbnRlbnRDaGFuZ2V9IC8+XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRjb25zdCBnZXRUaW1lRGV0YWlscyA9ICgpID0+IHtcclxuXHRcdGlmIChlZGl0b3JNb2RlKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHRcdGxldCBkZXRhaWxzID0gW11cclxuXHRcdHN3aXRjaCAobm9kZS5zdGF0dXMpIHtcclxuXHRcdFx0Y2FzZSBOb2RlU3RhdHVzRW51bS5ET05FOlxyXG5cdFx0XHRcdGRldGFpbHMucHVzaChcclxuXHRcdFx0XHRcdDxUeXBvZ3JhcGh5IHN4PXt7Zm9udFNpemU6IDEyfX0+XHJcblx0XHRcdFx0XHRcdHsnRmluaXNoOiAnICsgVGltZVV0aWxzLmdldERhdGVUaW1lU3RyKG5vZGUuZmluaXNoVGltZSl9XHJcblx0XHRcdFx0XHQ8L1R5cG9ncmFwaHk+XHJcblx0XHRcdFx0KVxyXG5cdFx0XHRcdGRldGFpbHMucHVzaChcclxuXHRcdFx0XHRcdDxUeXBvZ3JhcGh5IHN4PXt7Zm9udFNpemU6IDEyfX0+XHJcblx0XHRcdFx0XHRcdHsnU3RhcnQ6ICcgKyBUaW1lVXRpbHMuZ2V0RGF0ZVRpbWVTdHIobm9kZS5zdGFydFRpbWUpfVxyXG5cdFx0XHRcdFx0PC9UeXBvZ3JhcGh5PlxyXG5cdFx0XHRcdClcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSBOb2RlU3RhdHVzRW51bS5XT1JLSU5HOlxyXG5cdFx0XHRcdGRldGFpbHMucHVzaChcclxuXHRcdFx0XHRcdDxUeXBvZ3JhcGh5IHN4PXt7Zm9udFNpemU6IDEyfX0+XHJcblx0XHRcdFx0XHRcdHsnU3RhcnQ6ICcgKyBUaW1lVXRpbHMuZ2V0RGF0ZVRpbWVTdHIobm9kZS5zdGFydFRpbWUpfVxyXG5cdFx0XHRcdFx0PC9UeXBvZ3JhcGh5PlxyXG5cdFx0XHRcdClcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSBOb2RlU3RhdHVzRW51bS5QRU5ESU5HOlxyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0fVxyXG5cdFx0aWYgKCFkZXRhaWxzIHx8IGRldGFpbHMubGVuZ3RoID09IDApIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlXHJcblx0XHR9XHJcblx0XHRyZXR1cm4gPGRpdj5cclxuXHRcdFx0PERpdmlkZXIgc3g9e3ttYXJnaW5ZOiAnM3B4J319Lz5cclxuXHRcdFx0eyBkZXRhaWxzIH1cclxuXHRcdDwvZGl2PlxyXG5cdH1cclxuXHJcblx0Y29uc3QgaGFuZGxlTm9kZU5hbWVDaGFuZ2UgPSAoZXZlbnQ6IFJlYWN0LkNoYW5nZUV2ZW50PEhUTUxJbnB1dEVsZW1lbnQ+KSA9PiB7XHJcblx0XHRzZXRUaXRsZShldmVudC50YXJnZXQudmFsdWUpXHJcblx0XHRub2RlLnRpdGxlID0gZXZlbnQudGFyZ2V0LnZhbHVlXHJcblx0XHRvbk5vZGVVcGRhdGUoKVxyXG5cdH1cclxuXHJcblx0Y29uc3QgaGFuZGxlTm9kZVRpcFN1bW1hcnlDaGFuZ2UgPSAoZXZlbnQ6IFJlYWN0LkNoYW5nZUV2ZW50PEhUTUxJbnB1dEVsZW1lbnQ+KSA9PiB7XHJcblx0XHRzZXRUaXBTdW1tYXJ5KGV2ZW50LnRhcmdldC52YWx1ZSlcclxuXHRcdG5vZGUudGlwcy5zdW1tYXJ5ID0gZXZlbnQudGFyZ2V0LnZhbHVlXHJcblx0XHRvbk5vZGVVcGRhdGUoKVxyXG5cdH1cclxuXHJcblx0Y29uc3QgaGFuZGxlTm9kZVRpcENvbnRlbnRDaGFuZ2UgPSAoZXZlbnQ6IFJlYWN0LkNoYW5nZUV2ZW50PEhUTUxUZXh0QXJlYUVsZW1lbnQ+KSA9PiB7XHJcblx0XHRzZXRUaXBDb250ZW50KGV2ZW50LnRhcmdldC52YWx1ZSlcclxuXHRcdG5vZGUudGlwcy5jb250ZW50ID0gZXZlbnQudGFyZ2V0LnZhbHVlXHJcblx0XHRvbk5vZGVVcGRhdGUoKVxyXG5cdH1cclxuXHJcblx0Y29uc3QgaGFuZGxlTm9kZVNob3J0Q3V0Q2hhbmdlID0gKG5vZGVTaG9ydEN1dE1vZGVsOiBOb2RlU2hvcnRjdXQpID0+IHtcclxuXHRcdG5vZGUuc2hvcnRjdXQgPSBub2RlU2hvcnRDdXRNb2RlbFxyXG5cdFx0b25Ob2RlVXBkYXRlKClcclxuXHR9XHJcblxyXG5cdGNvbnN0IGdldEhlYWRlclZpZXcgPSAoKSA9PiB7XHJcblx0XHRyZXR1cm4gPGRpdj5cclxuXHRcdFx0PEJveCBzeD17e1xyXG5cdFx0XHRcdGRpc3BsYXk6ICdmbGV4JyxcclxuXHRcdFx0XHRmbGV4RGlyZWN0aW9uOiAncm93JyxcclxuXHRcdFx0XHRhbGlnbkl0ZW1zOiAnY2VudGVyJyxcclxuXHRcdFx0XHRqdXN0aWZ5Q29udGVudDogJ3NwYWNlLWJldHdlZW4nLFxyXG5cdFx0XHR9fT5cclxuXHRcdFx0XHR7Z2V0VGl0bGVWaWV3KCl9XHJcblx0XHRcdFx0e2dldEFjdGlvblZpZXcoKX1cclxuXHRcdFx0PC9Cb3g+XHJcblx0XHQ8L2Rpdj5cclxuXHJcblx0fVxyXG5cclxuXHRjb25zdCBnZXRUaXRsZVZpZXcgPSAoKSA9PiB7XHJcblx0XHRpZiAoIWVkaXRvck1vZGUpIHtcclxuXHRcdFx0cmV0dXJuIDxUeXBvZ3JhcGh5IHN4PXt7Zm9udFNpemU6IDE0LCBmb250V2VpZ2h0OiA2MDB9fT57bm9kZS50aXRsZX08L1R5cG9ncmFwaHk+XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gPGlucHV0IGNsYXNzTmFtZT17J3dvcmtmbG93LWlucHV0J30gc3R5bGU9e3tmb250U2l6ZTogMTQsIG1heFdpZHRoOiAxMzAsIGZvbnRXZWlnaHQ6IDYwMH19IGlkPVwidGl0bGVcIiB2YWx1ZT17dGl0bGV9IG9uQ2hhbmdlPXtoYW5kbGVOb2RlTmFtZUNoYW5nZX0gLz5cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGNvbnN0IGdldEFjdGlvblZpZXcgPSAoKSA9PiB7XHJcblx0XHRpZiAoIWVkaXRvck1vZGUpIHtcclxuXHRcdFx0cmV0dXJuIChcclxuXHRcdFx0XHQ8ZGl2PlxyXG5cdFx0XHRcdFx0PGRpdiBvbkNsaWNrPXtoYW5kbGVTdGF0dXNDbGlja30+XHJcblx0XHRcdFx0XHRcdHsgZ2V0U3RhdHVzSWNvbigpIH1cclxuXHRcdFx0XHRcdDwvZGl2PlxyXG5cdFx0XHRcdFx0PE1lbnVcclxuXHRcdFx0XHRcdFx0YXJpYS1sYWJlbGxlZGJ5PVwibm9kZS1tYW5hZ2VcIlxyXG5cdFx0XHRcdFx0XHRhbmNob3JFbD17YW5jaG9yRWx9XHJcblx0XHRcdFx0XHRcdG9wZW49e29wZW59XHJcblx0XHRcdFx0XHRcdG9uQ2xvc2U9eygpID0+IHtcclxuXHRcdFx0XHRcdFx0XHRoYW5kbGVDbG9zZSgpXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0PlxyXG5cdFx0XHRcdFx0XHR7Z2V0TWVudUl0ZW1zKCl9XHJcblx0XHRcdFx0XHQ8L01lbnU+XHJcblx0XHRcdFx0PC9kaXY+XHJcblx0XHRcdClcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiAoXHJcblx0XHRcdFx0PERlbGV0ZUljb24gb25DbGljaz17KCkgPT4gb25Ob2RlRGVsZXRlKCl9Lz5cclxuXHRcdFx0KVxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0cmV0dXJuIChcclxuXHRcdDxCb3ggY2xhc3NOYW1lPXsnd29ya2Zsb3ctY29udGFpbmVyLWlubmVyJ30gc3g9e3t3aWR0aDogMTgwLCBwYWRkaW5nOiAxLCBib3JkZXJSYWRpdXM6IDEsIGJveFNoYWRvdzogMSwgaWQ6IG5vZGUuaWR9fT5cclxuXHRcdFx0e2dldEhlYWRlclZpZXcoKX1cclxuXHRcdFx0e2dldFRpcHNWaWV3KCl9XHJcblx0XHRcdHtnZXRUaW1lRGV0YWlscygpfVxyXG5cdFx0XHQ8Tm9kZVNob3J0Y3V0VmlldyBlZGl0b3JNb2RlPXtlZGl0b3JNb2RlfSBub2RlU2hvcnRDdXRNb2RlbD17bm9kZS5zaG9ydGN1dH0gb25VcGRhdGVTaG9ydEN1dD17aGFuZGxlTm9kZVNob3J0Q3V0Q2hhbmdlfSAvPlxyXG5cdFx0PC9Cb3g+XHJcblx0KTtcclxufVxyXG4iXX0=