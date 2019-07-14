import React, {Fragment, useState} from 'react';
import styled from 'styled-components';

const TitleHeader = styled.h1`
    font-size: ${props => props.size};
    color: ${props => props.textColor};
    text-align: center;
`;

const BackgroundHeader = styled.div`
    width: 100%;
    height: 95vh;
    background-color: ${props => props.backgroundColor ? props.backgroundColor : null}
    background-image: ${props => props.backgroundImage ? props.backgroundImage : null}
`;


const Title = props => <TitleHeader textColor = {props.color} size = {props.size} >{props.title}</TitleHeader>
const Background = props => <BackgroundHeader backgroundColor = 'red' />

export {
    Title, Background
}