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
            validate: false,
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

    addNewProject = (event) => {
        let mode = this.state[this.state.workMode];
        if (mode.validate &&  mode.type !== 'empty') {
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
        this.setState({
            ...this.state,
            [this.state.workMode]: inputs
        })
    }

    validateName = (event) => {

        let inputs = {...this.state[this.state.workMode]};
        inputs.name = event.target.value;
        let lengthInput = inputs.name.length;
        inputs.validate = lengthInput > 0 && lengthInput < 20 ? true : false
        console.log(inputs);
        this.setState({
            ...this.state,
            [this.state.workMode]: inputs
        })
    };

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
                                className = {this.state[this.state.workMode].validate ? 'ready' : 'wrong'}
                                value = {this.state[this.state.workMode].name}
                                onChange = {this.validateName}
                                type = 'text'
                                placeholder = "Project name"
                            />
                            {
                                this.state[this.state.workMode].type === 'empty' ?
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
                                type = 'button'
                                value = 'Submit'
                            />
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