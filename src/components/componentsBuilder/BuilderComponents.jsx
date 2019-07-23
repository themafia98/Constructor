import React,{useState} from 'react';


import TextComponent from '../buildComponents/components/Text';
import BackgroundComponent from '../buildComponents/components/Background';

const BuilderComponents = props => {

    const [target] = useState(props.target);
    let [id] = useState(props.id);
    let [content] = useState(props.content ? props.content : null);
    let [type] = useState(props.type);

    if (type === 'text'){
        return <TextComponent
                    sizeParenBox = {{...props.sizeParenBox}}
                    id = {id}
                    coords = {{...props.coords}}
                    key = {`text${id}`}
                    target = {target}
                >
                    {content}
                </TextComponent>
    }

    if (type === 'background'){
        return <BackgroundComponent target = {target}  id = {id} key = {`bg${id}`}/>;
    }
};

export default BuilderComponents;