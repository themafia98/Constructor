import React, {Fragment} from 'react';
import PropTypes from 'prop-types';

const ImageInstruments = props => {

    let {coords} = props.componentStats;
    let {size} = props.componentStats;
    let {rotate} = props.componentStats;
    let {scale} = props.componentStats;
    let fileRef = React.createRef();
    return (
        <Fragment>
        <p className = 'titleInstument'>Position: </p>
        <span className = 'textCoordsPanel'>
        {coords.x ?
            coords.x + ' / ' + coords.y : ' drop for active'}
        </span>
        <p className = 'titleInstument'>Size (%):</p>
        <div className = 'controllersText'>
            <input
                className = 'button_switch size'
                onChange = {props.cbSetWidth}
                type="number"
                min = '10' max = '100'
                value = {size.w ? size.w : 30}
            />
            <input 
                className = 'button_switch size'
                onChange = {props.cbSetHeight}
                type="number"
                min = '10' max = '100'
                value = {size.h ? size.h : 30}
            />
        </div>
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
            <div className = 'controllersText'>
                <div className = 'fileLoader'>
                    <input 
                        onClick = {props.cbSearch}
                        className = 'ImageSearchButton file'
                        type="button"
                        value = 'search image'
                    />
                    <input
                        ref = {fileRef}
                        className = 'fileInput'
                        onChange = {props.cbLoadFile}
                        accept="image/*"
                        type="file"
                    />
                    <input
                        className = 'ImageSearchButton file'
                        type = 'button'
                        value = 'loading file'
                    />

                </div>
            </div>
            <input 
                onClick = {props.cbDelete}
                className = 'instrumentPanel__deleteComponentButton'
                type="button"
                value = 'delete'
            />
        </Fragment>
    )

}

ImageInstruments.propTypes = {
    componentStats: PropTypes.object.isRequired, // object with current component data
    cbSetWidth: PropTypes.func.isRequired, // callback set width
    cbSetHeight: PropTypes.func.isRequired, // callback set height
    cbSetBorderRadius: PropTypes.func.isRequired, // callback set border-radius
    cbSetOpacity: PropTypes.func.isRequired, // callback set opacity
    cbLoadFile: PropTypes.func.isRequired, // callback load file
    cbSearch: PropTypes.func.isRequired, // callback search
    cbDelete: PropTypes.func.isRequired, // callback delete
}

export default ImageInstruments;