import React,{Fragment} from 'react';
import {SketchPicker} from 'react-color';

const TextInstruments = props => {


        let {colorPickerActive} = props.instrumentPanel;
        let {content} = props.componentStats;
        let {fontSize} = props.componentStats;
        let {coords} = props.componentStats;
        let {rotate} = props.componentStats;
        let {scale} = props.componentStats;
        let _content = content !== '' ? 'Title' : '';
        return (
            <Fragment>
            <p className = 'titleInstument'>Position: </p>
            <span className = 'textCoordsPanel'>
            {coords.x ?
                coords.x + ' / ' + coords.y : ' drop for active'}
            </span>
            <p className = 'titleInstument'>Rotate/Scale:</p>
            <div className = 'controllersText'>
                <input
                className = 'button_switch rotate'
                onChange = {props.cbRotate}
                type="number"
                min = '0' max = '360'
                value = {rotate ? rotate : 0}
                />
                <input
                className = 'button_switch scale'
                onChange = {props.cbScale}
                type="number"
                step = '0.1'
                min = '0' max = '2'
                value = {scale ? scale : 1}
                />
            </div>
            <p className = 'titleInstument'>Color: </p>
            <input 
                onClick = {props.cbSetColor}
                className = 'button_switch color'
                type = 'button'
                value = 'color pick'
            />
            <p className = 'titleInstument'>Text size: </p>
            <input 
                className = 'button_switch size'
                onChange = {props.cbSetSize}
                type="number"
                min = '10' max = '200'
                value = {fontSize ? fontSize : 120}
            />
                { colorPickerActive ?
                    <div className ='wrapperColorPicker text'>
                        <SketchPicker
                            onChangeComplete={props.cbHandleChangeComplete}
                            color = {props.color ? props.color : 'red'}
                        />
                    </div>
                    : null
                }
                <p className = 'titleInstument'>Font: </p>
                <select 
                    value = {props.componentStats.font} 
                    onChange = {props.cbSetFont}
                    className = 'button_switch font'
                >
                <option>Arial</option>
                <option>Times</option>
                <option>Georgia</option>
                <option>Impact</option>
                <option>Tahoma</option>
                <option>Verdana</option>
                <option>Comic</option>
                </select>
            <p className = 'titleInstument'>Content: </p>
            <input
                className = 'button_switch content'
                onChange = {props.cbSetContent}
                maxLength = '100'
                type = 'text'
                value = {content ? content : _content}
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

export default TextInstruments;