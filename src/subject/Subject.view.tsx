import {SubjectModel} from "./Subject.model";
import * as React from "react";
import {useContext, useState} from "react";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import {WorkPanelContext} from "../workpanel/WorkPanel.view";
import {UpdateMode} from "../workpanel/WorkPanel.controller";

interface SubjectProps {
	subject: SubjectModel
}

const SubjectView: React.FC<SubjectProps> = ({ subject }) => {

	const workPanelController = useContext(WorkPanelContext)

	const [isExpanded, setIsExpanded] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [name, setName] = useState(subject.name);

	const handleAddChild = () => {
		const newSubject = SubjectModel.newInstance()
		newSubject.parentID = subject.id
		workPanelController.updateSubject(newSubject, UpdateMode.ADD)
		setIsExpanded(true);
	};

	const handleDelete = () => {
		workPanelController.updateSubject(subject, UpdateMode.DELETE);
	};

	const handleUpdateName = () => {
		const newSubject = Object.assign({}, subject, {name: name})
		workPanelController.updateSubject(newSubject)
		setIsEditing(false);
	};

	const handleCancelEdit = () => {
		setIsEditing(false);
		setName(subject.name);
	};

	const handleExpand = () => {
		setIsExpanded(!isExpanded);
	};

	const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setName(event.target.value);
	};

	const handleNameKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter') {
			handleUpdateName();
		}
	};

	const renderChildren = () => {
		if (subject.children.length === 0) {
			return null;
		}
		return (
			<div style={{marginLeft: 20}}>
				{subject.children.map((child) => (
					<SubjectView
						subject={child}
					/>
				))}
			</div>
		);
	};

	return (
		<div style={{maxHeight: 400, overflowY: 'scroll'}}>
			<div className={'workflow-container-inner'} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 3}}>
				<div style={{display: 'flex', alignItems: 'center', marginRight: 3}} onClick={handleExpand}>{isExpanded ? <ExpandLessIcon fontSize={'inherit'} /> : <ExpandMoreIcon fontSize={'inherit'}/>}</div>
				{isEditing ? (
					<input
						type="text"
						value={name}
						onChange={handleNameChange}
						onKeyPress={handleNameKeyPress}
					/>
				) : (
					<span onClick={() => setIsEditing(true)}>{subject.name}</span>
				)}
				<span className={'workflow-span'} style={{marginLeft: 3, marginRight: 3}}>{subject.score}</span>
				<AddCircleIcon style={{marginLeft: 3}} fontSize={'inherit'} onClick={handleAddChild} />
				<DeleteIcon style={{marginLeft: 3}} fontSize={'inherit'} onClick={handleDelete} />
			</div>
			{isExpanded && renderChildren()}
		</div>
	);
};

export default SubjectView
