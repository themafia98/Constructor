import React from 'react';

const CreateProject = props => {

    return (
    <div className = 'Modal'>
        <h3>Create new Project</h3>
        { props.nameLength <= 3 ?
            <span className = 'warning'>{props.warningLengthMin}</span> : null
        }
        { props.nameLength >= 20 ?
            <span className = 'warning'>{props.warningLengthMax}</span> : null
        }
        <input
            className = {props.typeClassName ? 'ready' : 'wrong'}
            value = {props.name}
            onChange = {props.cbValidateName}
            type = 'text'
            placeholder = "Project name"
        />
        { !props.validType ?
            <span className = 'warning'>{props.warningType}</span> : null
        }
        <select onChange = {props.cbSelectOption} >
            <option value = 'empty'>--------</option>
            <option value = 'landing'>Landing</option>
            <option value = 'portfolio'>Portfolio</option>
        </select>
        <input 
            onClick = {props.cbAddNewProject}
            className = 'acceptButton'
            disabled = {props.dissabled}
            type = 'button'
            value = 'Submit'
        />
        <input onClick = {props.cbCancel} type ='button' value = 'Cancel' />
    </div>
    )
}

export default CreateProject;