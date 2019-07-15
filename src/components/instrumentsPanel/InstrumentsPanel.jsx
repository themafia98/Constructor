import React from 'react';
import PropTypes from 'prop-types';

import './instrumentsPanel.scss';

import Icon from '../Icon/icon';

class InstrumentsPanel extends React.PureComponent {

    static propTypes = {
        instrumentPanel:  PropTypes.object.isRequired,
        editComponent: PropTypes.object.isRequired
    }

    state = {
        instrumentPanel: {...this.props.instrumentPanel}
    }

    makePanelInstruments = (type) => {

        return (
            <div  className= 'instuments'>
            </div>
        )
    }

    render(){
        let { instrumentActive } = this.state.instrumentPanel;
        return (
            <div className = 'instumentsPanel'>
            <button className = 'closeInstrumentsPanel'><Icon path = '/img/closeInstrument.png' /></button>
                <h3>Instruments</h3>
                {
                    instrumentActive ? 
                    <p className = 'titleComponent important'>{this.state.instrumentPanel.target}</p>
                    : null
                }
                {
                    instrumentActive ? this.makePanelInstruments() :
                    <p className = 'warningInstruments'>Select elements for accses edit instruments</p>
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