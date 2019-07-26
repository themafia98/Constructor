import React, {Fragment} from 'react';
import {SketchPicker} from 'react-color';

const BackgroundInstruments = props => {

    const stats = props.componentsStats;
    let {colorPickerActive} = props.instrumentPanel;

    return (
        <Fragment>
        <p className = 'titleInstument'>Color: </p>
        <input
            onClick = {props.cbSetColor}
            className = 'button_switch Color'
            type = 'button'
            value = 'color pick'
        />
            { colorPickerActive ?
                <SketchPicker
                    onChangeComplete={props.cbHandleChangeComplete}
                    color = {stats.color ? stats.color : 'red'}
                />
                : null
            }
            <input 
                onClick = {props.cbSearchImage}
                className = 'ImageSearchButton'
                type = 'button'
                value = 'background-image'
            />
            <input 
                onClick = {props.cbSaveChanges}
                className = 'saveButtonInstument'
                type = 'button'
                value = 'save changes'
            />
        </Fragment>
    )

}

export default BackgroundInstruments;