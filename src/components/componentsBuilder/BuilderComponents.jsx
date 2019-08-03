import React from 'react';

import Input from '../buildComponents/components/Input';
import Media from '../buildComponents/components/Media';
import Image from '../buildComponents/components/Image';
import TextComponent from '../buildComponents/components/Text';
import BackgroundComponent from '../buildComponents/components/Background';

const BuilderComponents = props => {

    if (props.type === 'text')
        return <TextComponent
                    key = {`text${props.id}`}
                    targetSection = {props.targetSection}
                    sizeParentBox = {{...props.sizeParentBox}}
                    id = {props.id}
                    size = {props.size ? props.size : props.fontSize}
                    color = {props.color}
                    opacity = {props.opacity}
                    coords = {{...props.coords}}
                    font = {props.font}
                    mode = {props.mode}
                >
                    {props.content}
                </TextComponent>

    if (props.type === 'background')
        return <BackgroundComponent
                    targetSection = {props.targetSection}
                    backgroundColor = {props.color}
                    width = {props.width}
                    height = {props.height}
                    size = {props.size}
                    id = {props.id}
                    key = {`bg${props.id}`}
                    mode = {props.mode}
                />;

    if (props.type === 'image'){
        return <Image
                    targetSection = {props.targetSection}
                    borderRadius = {props.borderRadius || 0}
                    opacity = {props.opacity}
                    size = {props.size ? props.size : {w: 30, h: 50}}
                    path = {props.path ? props.path : props.image}
                    coords = {{...props.coords}}
                    sizeParentBox = {{...props.sizeParentBox}}
                    id = {props.id}
                    key = {`image${props.id}`}
                    mode = {props.mode}
                />
    }

    if (props.type === 'media')
        return <Media
                    key = {`media${props.id}`}
                    id = {props.id}
                    content = {props.content}
                    targetSection = {props.targetSection}
                    sizeParentBox = {{...props.sizeParentBox}}
                    path = {props.path ? props.path : props.content}
                    coords = {{...props.coords}}
                    mode = {props.mode}
                />
        if (props.type === 'input')
            return <Input
                        targetSection = {props.targetSection}
                        size = {props.size ? props.size : props.fontSize}
                        path = {props.path ? props.path : props.image}
                        coords = {{...props.coords}}
                        sizeParentBox = {{...props.sizeParentBox}}
                        id = {props.id}
                        key = {`input${props.id}`}
                        mode = {props.mode}
                    />
};

export default BuilderComponents;