import React, {Fragment} from 'react';
import {SketchPicker} from 'react-color';

const BackgroundInstruments = props => {

    const {componentStats} = props;
    let color = null;
    if (componentStats)
        color = componentStats.backgroundColor;

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
                    color = {color ? color : 'red'}
                />
                : null
            }
            <input 
                onClick = {props.cbSearch}
                className = 'ImageSearchButton'
                type = 'button'
                value = 'background-image'
            />
        </Fragment>
    )

}

export default BackgroundInstruments;