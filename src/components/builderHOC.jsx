import React from 'react';

import Input from './buildComponents/components/Input';
import Media from './buildComponents/components/Media';
import Image from './buildComponents/components/Image';
import TextComponent from './buildComponents/components/Text';
import BackgroundComponent from './buildComponents/components/Background';

const builderHOC = item => Component => {
        if (item.type === 'background') Component = BackgroundComponent;
        else if (item.type === 'input') Component = Input;
        else if (item.type === 'media') Component = Media;
        else if (item.type === 'image') Component = Image;
        else if (item.type === 'text') Component = TextComponent;

        return <Component key = { `${item.type}${item.id}`} {...item.props} />
};

export default builderHOC;