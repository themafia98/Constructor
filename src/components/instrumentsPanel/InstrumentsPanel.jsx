import React, {Fragment} from 'react';
import eventStream from '../../EventEmitter';
import PropTypes from 'prop-types';
import { SketchPicker } from 'react-color';
import './instrumentsPanel.scss';

import Icon from '../Icon/icon';

class InstrumentsPanel extends React.PureComponent {

    static propTypes = {
        instrumentPanel:  PropTypes.object.isRequired,
        editComponent: PropTypes.object.isRequired
    }

    state = {
        instrumentPanel: {...this.props.instrumentPanel},
        sizeTextValue: 120,
        colorPickerAvtive: false
    }

    resetAll = event => {
        console.log(event.target);
        event.stopPropagation();
        if (this.state.colorPickerAvtive)
        this.setState({...this.state, colorPickerAvtive: false });
    }

    closePanel = event => {
        eventStream.emit('EventClosePanel', {close: false});
    }

    setSize = event => {
        let size = event.target.value > 200 ? 200 : event.target.value;
        event.stopPropagation();
        this.setState({sizeTextValue: size}, () => {
            eventStream.emit('EventChangeSizeText', {size: this.state.sizeTextValue + 'px' });
        });
    }

    setContent = event => {
        let contentValue = event.target.value;
        event.stopPropagation();
        eventStream.emit("EventChangeContentText",{content: contentValue});
    }

    setColor = event => {
        event.stopPropagation();
        this.setState({...this.state, colorPickerAvtive: this.state.colorPickerAvtive ? false : true});
    };

    handleChangeComplete = event => {

        if (this.state.instrumentPanel.target === 'background')
            eventStream.emit('EventChangeColor', event);
        else if (this.state.instrumentPanel.target === 'text')
            eventStream.emit('EventChangeColorText', event);
    }

    makePanelInstruments = (type) => {
        switch (type){
            case 'text': {
            return (
                    <Fragment>
                    <p className = 'titleInstument'>Color: </p>
                    <input onClick = {this.setColor} className = 'button_switchColor' type = 'button' value = 'color pick' />
                    <p className = 'titleInstument'>Text size: </p>
                    <input 
                        onChange = {this.setSize} 
                        type="number"
                        min = '10' max = '200'
                        value = {this.state.sizeTextValue}
                    />
                        { this.state.colorPickerAvtive ?
                            <SketchPicker
                            onChangeComplete={this.handleChangeComplete}
                            />
                            : null
                        }
                    <p className = 'titleInstument'>Content: </p>
                    <input onChange = {this.setContent} maxLength = '20' type = 'text' defaultValue = 'Title' />
                    </Fragment>
            )
            }
            case 'background': {
                return (
                    <Fragment>
                    <p className = 'titleInstument'>Color: </p>
                    <input onClick = {this.setColor} className = 'button_switchColor' type = 'button' value = 'color pick' />
                        { this.state.colorPickerAvtive ?
                            <SketchPicker
                            onChangeComplete={this.handleChangeComplete}
                            />
                            : null
                        }
                    </Fragment>
                )

            }
            default:{
                return (
                    <p className = 'warningInstruments'>Select elements for accses edit instruments</p>
                )
            }
        }
    }

    render(){
        let { instrumentActive } = this.state.instrumentPanel;
        return (
            <div  className = 'instumentsPanel'>
            <button onClick = {this.closePanel} className = 'closeInstrumentsPanel'><Icon path = '/img/close.svg' /></button>
                <h3>Instruments</h3>
                {
                    instrumentActive ? 
                    <p className = 'titleComponent important'>{this.state.instrumentPanel.target}</p>
                    : null
                }
                {
                    instrumentActive ?
                    <div  className= 'instuments'>{this.makePanelInstruments(this.state.instrumentPanel.target)}</div>
                    : null
                }
            </div>
        )
    }

    componentDidUpdate = (oldProps, oldState) => {

      if (oldState.instrumentPanel.target !== this.props.instrumentPanel.target)
        this.setState({
            ...this.state,
            colorPickerAvtive: false,
            instrumentPanel: {...this.props.instrumentPanel}
        })
      return true;
    }
}

export default InstrumentsPanel;