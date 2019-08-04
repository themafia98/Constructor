import React from 'react';
import PropTypes from 'prop-types';

import Input from '../buildComponents/components/Input';
import Media from '../buildComponents/components/Media';
import Image from '../buildComponents/components/Image';
import TextComponent from '../buildComponents/components/Text';
import BackgroundComponent from '../buildComponents/components/Background';

import './buildMenu.scss';

class BuildMenu extends React.PureComponent {

    static propTypes = {
        mode: PropTypes.string.isRequired, /** @String work mode component */
        editComponentName: PropTypes.string,
        eventStreamBuild: PropTypes.object, /** @Events stream build */
        countSection: PropTypes.number, /** @Number for new section id */
        countComponents: PropTypes.number, /** @Number last project */
        sizeParentBox: PropTypes.object /** @Object with width and height parent(bg) */
    }


    state = {
        mode: this.props.mode,
        sizeParentBox: {...this.props.sizeParentBox},
        title: 'Title'
    }

    addText = event => {
        let id = Math.random().toFixed(3);

        const componentsPatternText = {
            type: 'text',
            font: 'Arial',
            color: null,
            opacity: 1,
            fontSize: null,
            content: 'Title',
            coords: {x: null, y: null}, // x, y
            id: id,
            targetSection: this.props.editComponentName,
        };
        this.props.eventStreamBuild.emit('EventBuildComponents',{
            componentsPattern: componentsPatternText,
            type: componentsPatternText.type,
            component: <TextComponent
                            key = {`text${id}`}
                            mode = 'dev'
                            {...componentsPatternText}
                            sizeParentBox = {{...this.props.sizeParentBox}}
                            id = {id}
                        >Title</TextComponent>
        });
        event.stopPropagation();
    }

    addBackground = event => {
        let id = Math.random().toFixed(3);

        const componentsPatternBackground = {
            id: id,
            type: 'background',
            backgroundColor: null,
            backgroundImage: null,
            targetSection: this.state.editComponentName,
        };

        this.props.eventStreamBuild.emit('EventBuildComponents',{
            componentsPattern: componentsPatternBackground,
            type: componentsPatternBackground.type,
            component: <BackgroundComponent
                            targetSection = {this.props.editComponentName}
                            {...componentsPatternBackground}
                            key = {`bg${id}`}
                            id = {id}
                        />
        });

        event.stopPropagation();
    }

    addImage = event => {
        let id = Math.random().toFixed(3);

        const componentsPatternImage = {
            borderRadius: 0,
            type: 'image',
            size: {w: 30, h: 50},
            opacity: 1,
            zIndex: null,
            image: '/img/photoPattern.svg',
            coords: {x: null, y: null}, // x, y
            id: id,
            targetSection: this.props.editComponentName,
        };
        this.props.eventStreamBuild.emit('EventBuildComponents',{
            componentsPattern: componentsPatternImage,
            type: componentsPatternImage.type,
            component: <Image
                            key = {`image${id}`}
                            sizeParentBox = {this.props.sizeParentBox}
                            id = {id}
                            mode = 'dev'
                            path = {'/img/photoPattern.svg'}
                            {...componentsPatternImage}
                            type = 'image' />
        });
        event.stopPropagation();
    }

    addMedia = event => {
        let id = Math.random().toFixed(3);

        const  componentsPatternMedia = {
            type: 'media',
            size: null,
            content: null,
            coords: {x: null, y: null}, // x, y
            id: id,
            targetSection: this.props.editComponentName,
        };

        this.props.eventStreamBuild.emit('EventBuildComponents', {
            componentsPattern: componentsPatternMedia,
            type: componentsPatternMedia.type,
            component: <Media
                            key = {`media${id}`}
                            targetSection = {this.props.editComponentName}
                            sizeParentBox = {this.props.sizeParentBox}
                            content = {null}
                            id = {id}
                            path = {'/img/photoPattern.mp4'}
                            {...componentsPatternMedia}
                            type = 'media'
                            mode = 'dev'
                        />
        });
        event.stopPropagation();
    }

    addInput = event => {
        let id = Math.random().toFixed(3);

        const  componentsPatternInput = {
            type: 'input',
            size: {w: null, h: null},
            color: null,
            fontSize: null,
            borderRadius: null,
            content: null,
            coords: {x: null, y: null}, // x, y
            id: id,
            targetSection: this.props.editComponentName,
        };

        this.props.eventStreamBuild.emit('EventBuildComponents', {
            componentsPattern: componentsPatternInput,
            type: componentsPatternInput.type,
            component: <Input
                            key = {`input${id}`}
                            targetSection = {this.props.editComponentName}
                            sizeParentBox = {this.props.sizeParentBox}
                            id = {id}
                            inputType = 'button'
                            {...componentsPatternInput}
                            type = 'input'
                            mode = 'dev'
                        />
        });
        event.stopPropagation();
    }

    addSection = event => {
        let id = Math.random().toFixed(3);

        const componentsPatternBackground = {
            backgroundColor: null,
            backgroundImage: null,
            targetSection: `Section${id}`,
            id: `Section${id}`,
            type: 'background',
        };
        this.props.eventStreamBuild.emit('EventNewSection', {
            componentsPattern: componentsPatternBackground,
            component: <BackgroundComponent
                            {...componentsPatternBackground}
                            key = {`bg${id}`}
                            id = {id}
                            targetSection = {`Section${id}`}
                            width = '100%'
                            height = '800px'
                            type = 'background'
                            mode = 'dev'
                        />
        });
        event.stopPropagation();
    }

    render(){

        if (this.state.mode === 'build'){
            return (
                <div className = 'ComponentsMenu'>
                    <button 
                        onClick = {this.addImage} 
                        className = 'ImageTool CompoentnsMenu_button' 
                    >
                        <span>Image</span>
                    </button>
                    <button 
                        onClick = {this.addText} 
                        className = 'TextTool CompoentnsMenu_button' >
                        <span>Text</span>
                    </button>
                    <button
                        onClick = {this.addInput}
                        disabled = {this.props.editComponentName !== 'Header' ? false : true}
                        className = 'ButtonTool CompoentnsMenu_button' >
                        <span>Button</span>
                    </button>
                    <button onClick = {this.addMedia}
                        className = 'VideoTool CompoentnsMenu_button'
                    >
                        <span>Video</span>
                    </button>
                </div>
            )
        } else if (this.state.mode === 'section') {
            return (
                <div className = 'sectionMode'>
                    <button
                        onClick = {this.addSection}
                        className = 'newSectionTool CompoentnsMenu_button'
                    >
                        <span>New section</span>
                    </button>
                </div>
            )
        }
    }
}

export default BuildMenu;