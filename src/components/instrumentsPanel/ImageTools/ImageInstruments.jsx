import React, {Fragment} from 'react';

const ImageInstruments = props => {


    return (
        <Fragment>
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