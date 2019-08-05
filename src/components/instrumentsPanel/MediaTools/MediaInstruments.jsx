import React,{Fragment} from 'react';
import PropTypes from 'prop-types';

const MediaInstruments = props => {

    let {size} = props.componentStats;
    let {coords} = props.componentStats;

    return (
        <Fragment>
            <p className = 'titleInstument'>Position: </p>
            <span className = 'textCoordsPanel'>
            {coords.x ?
                coords.x + ' / ' + coords.y : ' drop for active'}
            </span>
            <p className = 'titleInstument'>Size (%):</p>
            <div className = 'panel__sizes'>
                <input
                    className = 'button_switch'
                    onChange = {props.cbSetWidth}
                    type="number"
                    min = '10' max = '100'
                    value = {size.w ? size.w : 30}
                />
                <input 
                    className = 'button_switch'
                    onChange = {props.cbSetHeight}
                    type="number"
                    min = '10' max = '100'
                    value = {size.h ? size.h : 50}
                />
            </div>
            <p className = 'titleInstument'>Content: </p>
            <input 
                onClick = {props.cbSearch}
                className = 'ImageSearchButton'
                type="button"
                value = 'search media'
            />
            <input 
                onClick = {props.cbDelete}
                className = 'instrumentPanel__deleteComponentButton'
                type="button"
                value = 'delete'
            />
        </Fragment>
    )
};

MediaInstruments.propTypes = {
    componentStats: PropTypes.object.isRequired, // object with current component data
    cbSearch: PropTypes.func.isRequired, // callback search
    cbSetWidth: PropTypes.func.isRequired, // callback set width
    cbSetHeight: PropTypes.func.isRequired, // callback set height
    cbDelete: PropTypes.func.isRequired, // callback delete
}

export default MediaInstruments;