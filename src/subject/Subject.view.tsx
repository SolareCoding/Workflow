import {newSubjectInstance, SubjectModel} from "./Subject.model";
import * as React from "react";
import {useState} from "react";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import {UpdateMode} from "../workpanel/WorkPanel.controller";
import {useAppDispatch} from "../repository/hooks";
import {updateSubject} from "./Subject.slice";

interface SubjectProps {
	subject: SubjectModel
}

const SubjectView: React.FC<SubjectProps> = ({ subject }) => {

	const dispatch = useAppDispatch()
	const [isExpanded, setIsExpanded] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [name, setName] = useState(subject.name);

	const handleAddChild = () => {
		const newSubject = newSubjectInstance(subject.id)
		dispatch(updateSubject({
			subject: newSubject,
			updateMode: UpdateMode.ADD
		}))
		setIsExpanded(true);
	};

	const handleDelete = () => {
		dispatch(updateSubject({
			subject: subject,
			updateMode: UpdateMode.DELETE
		}))
	};

	const handleUpdateName = () => {
		const newSubject = Object.assign({}, subject, {name: name})
		dispatch(updateSubject({
			subject: newSubject,
			updateMode: UpdateMode.UPDATE
		}))
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
		<div className={'workflow-container-outter-subject'} style={{overflowY: 'scroll', width: '100%',}}>
			<div className={'workflow-container-inner-subject'} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 3}}>
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
