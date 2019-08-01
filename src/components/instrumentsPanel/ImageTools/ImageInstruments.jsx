import React, {Fragment} from 'react';

const ImageInstruments = props => {

    let {fontSize} = props.componentStats;
    return (
        <Fragment>
        <p className = 'titleInstument'>Width (%):</p>
        <input 
            onChange = {props.cbSetSize}
            type="number"
            min = '10' max = '100'
            value = {fontSize ? fontSize : 100}
        />
        <p className = 'titleInstument'>Height (%):</p>
        <input 
            onChange = {props.cbSetSize}
            type="number"
            min = '10' max = '100'
            value = {fontSize ? fontSize : 100}
        />
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