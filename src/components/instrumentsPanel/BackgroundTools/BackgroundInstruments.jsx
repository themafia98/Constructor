import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {SketchPicker} from 'react-color';

const BackgroundInstruments = props => {
    return (
        <Fragment>
        <p className = 'titleInstument'>Color: </p>
        <input
            onClick = {props.cbSetColor}
            className = 'button_switch Color'
            type = 'button'
            value = 'color pick'
        />
            { props.colorPickerActive ?
                <SketchPicker
                    onChangeComplete={props.cbHandleChangeComplete}
                    color = {props.color ? props.color : 'white'}
                />
                : null
            }
            <input 
                onClick = {props.cbSearch}
                className = 'ImageSearchButton'
                type = 'button'
                value = 'background-image'
            />
            <input 
                onClick = {props.cbDelete}
                className = 'instrumentPanel__deleteComponentButton'
                type="button"
                value = 'delete'
            />
        </Fragment>
    )

}

BackgroundInstruments.propTypes = {
    componentStats: PropTypes.object.isRequired, // object with current component data
    cbSetColor: PropTypes.func.isRequired, // callback set color
    cbHandleChangeComplete: PropTypes.func.isRequired, // callback picker state change
    cbSearch: PropTypes.func.isRequired, // callback search
}

export default BackgroundInstruments;