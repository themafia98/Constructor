import React,{Fragment} from 'react';
import {SketchPicker} from 'react-color';

const TextInstruments = props => {

        let {colorPickerActive} = props.instrumentPanel;
        let {content} = props.componentStats;
        let {fontSize} = props.componentStats;
        let {coords} = props.componentStats;
        let {color} = props.componentStats;

        return (
            <Fragment>
            <p className = 'titleInstument'>Position: </p>
            <span className = 'textCoordsPanel'>
            {coords.x ?
                coords.x + ' / ' + coords.y : ' drop for active'}
            </span>
            <p className = 'titleInstument'>Color: </p>
            <input 
                onClick = {props.cbSetColor}
                className = 'button_switch'
                type = 'button'
                value = 'color pick'
            />
            <p className = 'titleInstument'>Text size: </p>
            <input 
                onChange = {props.cbSetSize}
                type="number"
                min = '10' max = '200'
                value = {fontSize ? fontSize : 120}
            />
                { colorPickerActive ?
                    <SketchPicker
                    onChangeComplete={props.cbHandleChangeComplete}
                    color = {color ? color: 'red'}
                    />
                    : null
                }
            <p className = 'titleInstument'>Content: </p>
            <input
                onChange = {props.cbSetContent}
                maxLength = '20'
                type = 'text'
                value = {content ? content : 'Title'}
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

export default TextInstruments;