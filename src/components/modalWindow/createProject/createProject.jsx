import React from 'react';
import PropTypes from 'prop-types';
import Loader from '../../loading/Loader';

const CreateProject = props => {

    const content = props.content;
    const {disabled,validateName,name,validateType,typeClassName} = content;
    const nameLength = name.length;

    let isNumber = props.nameLength >= 4 && props.nameLength <= 20;

    return (
    <div className = 'Modal'>
        <h3>Create new Project</h3>
        { nameLength <= 3 ?
            <span className = 'warning'>{props.warningLengthMin}</span> : null
        }
        { nameLength >= 20 ?
            <span className = 'warning'>{props.warningLengthMax}</span> : null
        }
        {
            isNumber && !validateName ?
            <span className = 'warning'>{props.warningNumber}</span> : null
        }
        <input
            className = {typeClassName ? 'ready' : 'wrong'}
            value = {props.name}
            onChange = {props.cbValidateName}
            type = 'text'
            placeHolder = "Project name"
        />
        { !validateType ?
            <span className = 'warning'>{props.warningType}</span> : null
        }
        <select onChange = {props.cbSelectOption} >
            <option value = 'empty'>--------</option>
            <option value = 'landing'>Landing</option>
        </select>
        <input 
            onClick = {props.cbAddNewProject}
            className = 'acceptButton'
            disabled = {disabled}
            type = 'button'
            value = 'Submit'
        />
        <input onClick = {props.cbCancel} type ='button' value = 'Cancel' />
        {props.loading && <Loader mode = 'create' />}
    </div>
    )
}

CreateProject.propTypes = {
    content: PropTypes.object, // type color className
    warningType: PropTypes.string, // errors
    warningLengthMax: PropTypes.string, // error max length
    warningLengthMin: PropTypes.string, // error min length
    cbValidateName: PropTypes.func.isRequired, // callback validate
    cbAddNewProject: PropTypes.func.isRequired, // callback add new project
}

export default CreateProject;