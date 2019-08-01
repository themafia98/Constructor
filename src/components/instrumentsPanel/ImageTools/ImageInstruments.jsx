import React, {Fragment} from 'react';

const ImageInstruments = props => {

    let {fontSize} = props.componentStats;
    return (
        <Fragment>
        <p className = 'titleInstument'>Size: </p>
        <input 
            onChange = {props.cbSetSize}
            type="number"
            min = '10' max = '200'
            value = {fontSize ? fontSize : 120}
        />
        <p className = 'titleInstument'>Border radius: </p>
            <input
                onClick = {props.cbSetColor}
                className = 'button_switch radius'
                type="number"
                min = '10' max = '200'
            />
            <p className = 'titleInstument'>Opacity: </p>
            <input 
                onClick = {props.cbSearchImage}
                className = 'ImageSearchButton'
                type="number"
                min = '0' max = '1'
            />
            <input 
            onClick = {props.cbSearchImage}
            className = 'ImageSearchButton'
            type="button"
            value = 'search image'
        />
        </Fragment>
    )

}

export default ImageInstruments;