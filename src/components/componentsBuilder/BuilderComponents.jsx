import React,{useState} from 'react';

import Media from '../buildComponents/components/Media';
import Image from '../buildComponents/components/Image';
import TextComponent from '../buildComponents/components/Text';
import BackgroundComponent from '../buildComponents/components/Background';

const BuilderComponents = props => {

    let [targetSection] = useState(props.targetSection);
    let [id] = useState(props.id);
    let [size] = useState(props.size || props.fontSize);
    let [color] = useState(props.color ? props.color : 'red');
    let [content] = useState(props.content ? props.content : null);
    let [type] = useState(props.type);
    let [width] = useState(props.width);
    let [height] = useState(props.height);

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
                    width = {width}
                    height = {height}
                    size = {size}
                    id = {id}
                    key = {`bg${id}`}
                />;

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
    if (type === 'media')
        return <Media
                    key = {`media${id}`}
                    id = {id}
                    targetSection = {targetSection}
                    sizeParentBox = {{...props.sizeParentBox}}
                    path = {props.path ? props.path : props.content}
                    coords = {{...props.coords}}
                />
};

export default BuilderComponents;