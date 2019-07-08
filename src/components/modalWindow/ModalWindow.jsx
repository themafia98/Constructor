import React,{Fragment} from 'react';
import PropTypes from 'prop-types';
import eventStream from '../../EventEmitter.js';

import './modal.scss';

class ModalWindow extends React.PureComponent {

    static propTypes = {
        mode: PropTypes.string
    }

    state = {
        workMode: this.props.workMode,

        newProject: {
            validateName: false,
            validateType: false,
            disabled: true,
            name: '',
            type: 'empty'
        },
        warning: {
            lengthMax: 'Max length: 20 symbols',
            lengthMin: 'Min length: 3 symbol',
            type: 'Select type of webpage',
        }
    }

    inputSelect = null;

    disabledButton = (action) => {

    }

    addNewProject = (event) => {
        let mode = this.state[this.state.workMode];
        if (mode.validateType &&  mode.validateName) {
            eventStream.emit('EventAddHTML', 
            {
                title: this.state[this.state.workMode].name,
                type: this.state[this.state.workMode].type
            });

            eventStream.emit('EventChangeWorkMode',{action: 'default'});
        }
    }

    selectOption = (event) => {

        let inputs = {...this.state[this.state.workMode]};
        inputs.type = event.target.value;
        inputs.validateType = inputs.type !== 'empty';
        inputs.disabled = inputs.validateType && inputs.validateName ? false : true;
        this.setState({
            ...this.state,
            [this.state.workMode]: inputs
        });
    }

    validateName = (event) => {

        let inputs = {...this.state[this.state.workMode]};
        inputs.name = event.target.value;
        let lengthInput = inputs.name.length;
        inputs.validateName = lengthInput > 0 && lengthInput < 20 ? true : false;
        inputs.disabled = inputs.validateType && inputs.validateName ? false : true;

        this.setState({
            ...this.state,
            [this.state.workMode]: inputs
        })
    };

    cancel = (event) => {
        eventStream.emit('EventChangeWorkMode',{action: 'default'});
    }

    refSelect = (node) => this.inputSelect = node;

    render(){

        switch (this.state.workMode){

            case 'newProject': {
                return (
                        <div className = 'Modal'>
                            <h3>Create new Project</h3>
                            {
                                this.state[this.state.workMode].name.length <= 0 ?
                                <span className = 'warning'>{this.state.warning.lengthMin}</span> : null
                            }
                            {
                                this.state[this.state.workMode].name.length >= 20 ?
                                <span className = 'warning'>{this.state.warning.lengthMax}</span> : null
                            }
                            <input
                                className = {this.state[this.state.workMode].validateName ? 'ready' : 'wrong'}
                                value = {this.state[this.state.workMode].name}
                                onChange = {this.validateName}
                                type = 'text'
                                placeholder = "Project name"
                            />
                            {
                                !this.state[this.state.workMode].validateType ?
                                <span className = 'warning'>{this.state.warning.type}</span> : null
                            }
                            <select onChange = {this.selectOption} >
                                <option value = 'empty'>--------</option>
                                <option value = 'landing'>Landing</option>
                                <option value = 'portfolio'>Portfolio</option>
                            </select>
                            <input 
                                onClick = {this.addNewProject}
                                className = 'acceptButton'
                                disabled = {this.state[this.state.workMode].disabled}
                                type = 'button'
                                value = 'Submit'
                            />
                            <input onClick = {this.cancel} type ='button' value = 'Cancel' />
                        </div>
                )
            }
            default: {
                return (
                    <Fragment></Fragment>
                )
            }
        }
    }
}

export default ModalWindow;