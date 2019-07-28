import React,{useState} from 'react';

import Image from '../buildComponents/components/Image';
import TextComponent from '../buildComponents/components/Text';
import BackgroundComponent from '../buildComponents/components/Background';

const BuilderComponents = props => {

    let [targetSection] = useState(props.targetSection);
    let [id] = useState(props.id);
    let [size] = useState(props.size);
    let [color] = useState(props.color ? props.color : 'red');
    let [content] = useState(props.content ? props.content : null);
    let [type] = useState(props.type);
console.log('text');
    if (type === 'text')
        return <TextComponent
                    key = {`text${id}`}
                    targetSection = {targetSection}
                    sizeParentBox = {{...props.sizeParentBox}}
                    id = {id}
                    size = {size}
                    color = {color}
                    coords = {{...props.coords}}
                >
                    {content}
                </TextComponent>

    if (type === 'background')
        return <BackgroundComponent
                    targetSection = {targetSection}
                    color = {color}
                    size = {size}
                    id = {id}
                    key = {`bg${id}`}
                />;
    console.log(type);
    if (type === 'image')
        return <Image
                    targetSection = {targetSection}
                    size = {size}
                    path = {props.path ? props.path : props.image}
                    coords = {{...props.coords}}
                    sizeParentBox = {{...props.sizeParentBox}}
                    id = {id}
                    key = {`image${id}`}
                />
};

export default BuilderComponents;