import React,{Fragment} from 'react';

const MediaInstruments = props => {

    // let {content} = props.componentStats;
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
                defaultValue = {fontSize ? fontSize : 120}
            />
            <p className = 'titleInstument'>Content: </p>
            <input 
                onClick = {props.cbSearch}
                className = 'ImageSearchButton'
                type="button"
                value = 'search media'
            />
            <input 
                onClick = {props.cbDelete}
                className = 'instrumentPanel__deleteComponentButton'
                type="button"
                value = 'delete'
            />
        </Fragment>
    )
};

export default MediaInstruments;