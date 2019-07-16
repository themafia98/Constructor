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

    setColor = event => {
        event.stopPropagation();
        this.setState({...this.state, colorPickerAvtive: this.state.colorPickerAvtive ? false : true});
    };

    handleChangeComplete = event => {
        eventStream.emit('EventChangeColor', event);
    }

    makePanelInstruments = (type) => {
        switch (type){
            case 'text': {
            return (
                <p>{type}</p>
            )
            }
            case 'background': {
                return (
                    <Fragment>
                    <input onClick = {this.setColor} className = 'button_switchColor' type = 'button' value = 'setColor' />
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
            instrumentPanel: {...this.props.instrumentPanel}
        })
      return true;
    }
}

export default InstrumentsPanel;