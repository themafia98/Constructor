import React from 'react';
import PropTypes from 'prop-types';

import './instrumentsPanel.scss';

class InstrumentsPanel extends React.PureComponent {

    static propTypes = {
        id: PropTypes.number,
        editComponent: PropTypes.object.isRequired
    }

    state = {
        idProject: this.props.id,
        acceptInstruments: this.props.editComponent.edit,
    }

    makePanelInstruments = (type) => {

        return (
            <div  className= 'instuments'>
            </div>
        )
    }

    render(){
        console.log(this.props);
        return (
            <div className = 'instumentsPanel'>
                <h3>Instruments</h3>
                {
                    this.state.acceptInstruments ? 
                    <p className = 'titleComponent important'>{this.props.editComponent.name}</p>
                    : null
                }
                {
                    this.state.acceptInstruments ? this.makePanelInstruments() :
                    <p className = 'warningInstruments'>Select elements for accses edit instruments</p>
                }
            </div>
        )
    }

    componentDidUpdate = (oldProps, oldState) => {

        if (oldProps.editComponent.edit !== this.props.editComponent.edit){
            this.setState({
                ...this.state,
                acceptInstruments: this.props.editComponent.edit
            })
        }
    }
}

export default InstrumentsPanel;