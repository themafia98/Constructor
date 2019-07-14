import React, {Fragment, useState} from 'react';
import styled from 'styled-components/macro';

const Red = styled.h1`
    font-size: ${props => props.size};
    color: ${props => props.color};
    text-align: center;
`;


const Title = props => {
    const [titleName] = useState(props.title);
    const [className] = useState(props.className);

    return (
        <Fragment>
            <Red color = 'red' size = '100px' >{titleName}</Red>
        </Fragment>
    )
}

export default Title;