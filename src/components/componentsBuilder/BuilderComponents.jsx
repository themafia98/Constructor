import React,{useState} from 'react';

import Image from '../buildComponents/components/Image';
import TextComponent from '../buildComponents/components/Text';
import BackgroundComponent from '../buildComponents/components/Background';

const BuilderComponents = props => {

    const [target] = useState(props.target);
    let [id] = useState(props.id);
    let [size] = useState(props.size);
    let [color] = useState(props.color ? props.color : 'red');
    let [content] = useState(props.content ? props.content : null);
    let [type] = useState(props.type);

    if (type === 'text')
        return <TextComponent
                    key = {`text${id}`}
                    sizeParenBox = {{...props.sizeParenBox}}
                    id = {id}
                    size = {size}
                    color = {color}
                    coords = {{...props.coords}}
                    target = {target}
                >
                    {content}
                </TextComponent>

    if (type === 'background')
        return <BackgroundComponent
                    target = {target}
                    color = {color}
                    size = {size}
                    id = {id}
                    key = {`bg${id}`}
                />;


    if (type === 'image')
        return <Image
                    target = {target}
                    size = {size}
                    path = {props.path}
                    coords = {{...props.coords}}
                    id = {id}
                    key = {`image${id}`}
                />
};

export default BuilderComponents;