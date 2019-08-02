import React, {Fragment} from 'react';

const ImageInstruments = props => {

    let {coords} = props.componentStats;
    let {size} = props.componentStats;
    let fileRef = React.createRef();
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
                value = {size.h ? size.h : 30}
            />
        </div>
        <p className = 'titleInstument'>Border radius: </p>
            <input
                onChange = {props.cbSetBorderRadius}
                className = 'button_switch radius'
                type="number"
                value = {props.componentStats.borderRadius ?
                            props.componentStats.borderRadius : 10
                        }
                min = '10' max = '200'
            />
            <p className = 'titleInstument titleInstrument__opacity'>Opacity: </p>
            <input 
                onChange = {props.cbSetOpacity}
                className = 'ImageSearchButton'
                type="number"
                value = {props.componentStats.opacity ?
                    props.componentStats.opacity : 1
                }
                step = '0.1'
                min = '0' max = '1'
            />
            <p className = 'titleInstument titleInstrument__opacity'>Loader: </p>
            <div className = 'fileLoader'>
            <input
                ref = {fileRef}
                className = 'fileInput'
                onChange = {props.cbLoadFile}
                accept="image/*"
                type="file"
            />
                <input
                        // onClick = {simulateClickFile}
                        className = 'ImageSearchButton'
                        type = 'button'
                        value = 'loading file'
                />
            </div>
            <input 
                onClick = {props.cbSearch}
                className = 'ImageSearchButton'
                type="button"
                value = 'search image'
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

export default ImageInstruments;