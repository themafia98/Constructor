import React,{Fragment} from 'react';

const MediaInstruments = props => {

    let {content} = props.componentStats;
    let {fontSize} = props.componentStats;
    let {coords} = props.componentStats;

    return (
        <Fragment>
            <p className = 'titleInstument'>Position: </p>
            <span className = 'textCoordsPanel'>
            {coords.x ?
                coords.x + ' / ' + coords.y : ' drop for active'}
            </span>
            <p className = 'titleInstument'>Size: </p>
            <input 
                onChange = {props.cbSetSize}
                type="number"
                min = '10' max = '200'
                value = {fontSize ? fontSize : 120}
            />
            <p className = 'titleInstument'>Content: </p>
            <input 
                onClick = {props.cbSearchImage}
                className = 'ImageSearchButton'
                type="button"
                value = 'search media'
            />
        </Fragment>
    )
};

export default MediaInstruments;