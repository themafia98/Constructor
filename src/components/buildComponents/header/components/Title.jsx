import React, {useState} from 'react';
import './title.scss';

const Title = props => {
    const [titleName] = useState(props.title);
    const [className] = useState(props.className);

    return (
        <h1 className = {className}>{titleName}</h1>
    )
}

export default Title;