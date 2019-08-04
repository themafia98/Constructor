import React,{Fragment} from 'react';
import PropTypes from 'prop-types';

const MediaInstruments = props => {

    let {fontSize} = props.componentStats;
    let {coords} = props.componentStats;

    return (
        <Fragment>
            <p className = 'titleInstument'>Position: </p>
            <span className = 'textCoordsPanel'>
            {coords.x ?
                coords.x + ' / ' + coords.y : ' drop for active'}
            </span>
            <p className = 'titleInstument'>Size: </p>
            <input
                className = 'button_switch'
                onChange = {props.cbSetSize}
                type="number"
                min = '10' max = '200'
                defaultValue = {fontSize ? fontSize : 120}
            />
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
    cbSetSize: PropTypes.func.isRequired, // callback set size
    cbDelete: PropTypes.func.isRequired, // callback delete
}

export default MediaInstruments;