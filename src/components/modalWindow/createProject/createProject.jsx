import React from 'react';
import PropTypes from 'prop-types';
import Loader from '../../loading/Loader';
const CreateProject = props => {

    let isNumber = props.nameLength >= 4 && props.nameLength <= 20;

    return (
    <div className = 'Modal'>
        <h3>Create new Project</h3>
        { props.nameLength <= 3 ?
            <span className = 'warning'>{props.warningLengthMin}</span> : null
        }
        { props.nameLength >= 20 ?
            <span className = 'warning'>{props.warningLengthMax}</span> : null
        }
        {
            isNumber && !props.validName ?
            <span className = 'warning'>{props.warningNumber}</span> : null
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
        </select>
        <input 
            onClick = {props.cbAddNewProject}
            className = 'acceptButton'
            disabled = {props.dissabled}
            type = 'button'
            value = 'Submit'
        />
        <input onClick = {props.cbCancel} type ='button' value = 'Cancel' />
        {props.loading && <Loader mode = 'create' />}
    </div>
    )
}

CreateProject.propTypes = {
    typeClassName: PropTypes.bool, // type color className
    name: PropTypes.string, // name of project
    warningType: PropTypes.string, // errors
    warningLengthMax: PropTypes.string, // error max length
    warningLengthMin: PropTypes.string, // error min length
    dissabled: PropTypes.bool, // buttons dissabled
    validType: PropTypes.bool, // valid or no
    cbValidateName: PropTypes.func.isRequired, // callback validate
    cbAddNewProject: PropTypes.func.isRequired, // callback add new project
}

export default CreateProject;