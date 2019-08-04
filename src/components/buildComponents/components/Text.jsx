
import React from 'react';
import PropTypes from 'prop-types';
import eventEmitter from '../../../EventEmitter';
import styled from 'styled-components';
import './components.scss';



const WrapperText = styled.div.attrs(props => {
    if (props.mode !== 'production')
    return ({
        style: {
            zIndex: props.indexZ ? '9999' : null,
            left: props.coordX ? props.coordX : '50%',
            top:  props.coordY,
        }
    })
})`
    position: absolute;
    font-size: ${props => props.size ? props.size : '120px'};
    color: ${props => props.textColor};
    text-align: center;
    margin: 0;
    word-break: break-all;
`;

const TextStyle = styled.p`
    width: 100%;
    height: 100%;
    font-family: ${props => props.font};
    text-align: center;
    margin: 0;
    user-select: none;
`;


const ProductionStyle = styled(WrapperText)`
    left: ${props => props.coordX ? props.coordX : '50%'};
    top:  ${props => props.coordY};

    @media ${`screen and (max-width: 500px)`} {
        font-size: 50px;
      }
`;

class TextComponent extends React.PureComponent {

    static propTypes = {
        id: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number
        ]).isRequired,
        targetSection: PropTypes.string.isRequired,
        sizeParentBox: PropTypes.object.isRequired,
        mode: PropTypes.string.isRequired,
    }

    state = {
        id: this.props.id,
        istrumentsActive: false,
        isHaveSize: false,
        parent: this.props.sizeParentBox,
        targetSection: this.props.targetSection,
        colorText: this.props.color,
        sizeText: this.props.fontSize || this.props.size,
        shiftCoords: null,
        position: this.props.coords,
        font: this.props.font ? this.props.font : 'Arial',
        startDragNdrop: false,
        contentText: this.props.content ? this.props.content : null,
        sectionNumber: 0,
        getSizeBool: false
    }

    openTitleInstruments = event => {

         const componentsPatternText = {
            id: this.state.id,
            targetSection: this.state.targetSection,
            type: 'text',
            font: this.state.font,
            color: this.state.colorText,
            fontSize: this.state.sizeText,
            content: this.state.contentText,
            coords: {...this.state.posText}, // x, y
        };
        eventEmitter.emit(`EventInstrumentPanel`,{
                type: 'text',
                targetSection: this.state.targetSection,
                id: this.state.id,
                componentStats: componentsPatternText,
                sizeTextValue: this.state.sizeText
        });
        this.setState({...this.state, istrumentsActive: true});
        event.stopPropagation();
    }

    changeColorText = colorRGB => {
        if (typeof colorRGB === 'string')
            this.setState({
                ...this.state,
                colorText: colorRGB
            });
    };

    changeSizeText = eventSize => {
        this.setState({...this.state, sizeText: eventSize.size});
    };

    saveSize = event => {
        const {size} = event;
        if (!this.state.getSizeBool){
        this.setState({
            ...this.state,
            getSizeBool: true,
            sectionNumber: event.sectionNumber,
            parent: {width: size.width, height: size.height}});
        } else eventEmitter.off(`EventSaveWidth${this.state.targetSection}`,this.saveSize);
    }

    changeContentText = eventContent => {
        let booldContent = eventContent.content || eventContent.content === '';
        if (booldContent)
            this.setState({
                ...this.state,
                contentText: eventContent.content
            });
    };

    saveCoords = event => {
        if (event.nativeEvent.which !== 1) return false;
        const element = this.refText.getBoundingClientRect();

        const cords = {
            left: element.left,
            top: element.top,
            width: element.right - element.left,
            height: element.bottom - element.top
        }

        this.setState({
            ...this.state,
            shiftCoords: {x: event.clientX - cords.left, y: event.clientY - cords.top},
            startDragNdrop: !this.state.startDragNdrop ? true : false
        });

        event.stopPropagation();
    };

    setFont = eventItem => {
        this.setState({
            ...this.state,
            font: eventItem.font
        });
    };

    checkPivotPosition = (coordX, coordY) => {

        const element = this.refText.getBoundingClientRect();
        const borderTopLeft = 0;
        const borderDown = 800 - element.height;
        const borderRight = this.props.sizeParentBox.width - element.width;

        if (coordY < borderTopLeft) coordY = borderTopLeft;
        if (coordY > borderDown) coordY = borderDown;
        if (coordX < borderTopLeft) coordX = borderTopLeft;
        if (coordX > borderRight) coordX = borderRight;

        return {x: coordX, y: coordY};
    }

    delta = (trans,transT) => {
        return {
            x: 0,
            y: 0,
        }
    }
    move = (x,y) => this.setState({...this.state, position: {x: x, y: y}});

    moveText = event => {

        if (this.state.startDragNdrop && this.state.istrumentsActive){

 
            let sectionNum = this.state.sectionNumber === 0 ? 1 : this.state.sectionNumber;
            let xItem = event.clientX - (this.props.sizeParentBox.left  * sectionNum);
            let yItem = event.clientY - (this.props.sizeParentBox.top * sectionNum);

            let coordX = xItem - this.state.shiftCoords.x + this.delta().x;
            let coordY = yItem - this.state.shiftCoords.y + this.delta().y;

            let coords = this.checkPivotPosition(coordX,coordY);

            let convertToPercentX = coords.x * 100 / this.state.parent.width;
            let convertToPercentY = coords.y * 100 / this.state.parent.height;

            this.move(convertToPercentX.toFixed(2) + '%',
                      convertToPercentY.toFixed(2) + '%');
    }
        event.stopPropagation();
    };

    stopDragNdrop = event => {
        if (this.state.startDragNdrop) {
            this.setState({...this.state, startDragNdrop: false})
            eventEmitter.emit(`EventUpdatePosition${this.state.id}`, this.state.position);
        }
        event.stopPropagation();
    };

    refText = null;
    refTextComponent = node => this.refText = node;


    render(){

        if (this.props.mode === 'dev'){
            return (
                <WrapperText
                    ref  = {this.refTextComponent}
                    onClick={this.openTitleInstruments}
                    textColor = {this.state.colorText ? this.state.colorText : 'red'}
                    size = {this.state.sizeText ? this.state.sizeText + 'px' : '120px'}
                    onMouseDown = {this.saveCoords}
                    onMouseMove= {this.moveText}
                    onMouseLeave = {this.stopDragNdrop}
                    onMouseUp = {this.stopDragNdrop}
                    coordX = {this.state.position ? this.state.position.x : null}
                    coordY = {this.state.position ? this.state.position.y : null}
                    indexZ = {this.state.startDragNdrop}
                    data-textcomponent
                >
                    <TextStyle font = {this.state.font}>{this.state.contentText}</TextStyle>
                </WrapperText>
            ) 
        } else if (this.props.mode === 'production'){
            return (
                <ProductionStyle
                    ref  = {this.refTextComponent}
                    mode = {this.props.mode}
                    textColor = {this.state.colorText ? this.state.colorText : 'red'}
                    size = {this.state.sizeText ? this.state.sizeText + 'px' : '120px'}
                    coordX = {this.state.position ? this.state.position.x : null}
                    coordY = {this.state.position ? this.state.position.y : null}
                    indexZ = {this.state.startDragNdrop}
                >
                    <TextStyle font = {this.state.font}>{this.state.contentText}</TextStyle>
                </ProductionStyle>
            )
        }

    }

    componentDidMount = () => {
        eventEmitter.on(`EventChangeColorText${this.state.id}`, this.changeColorText);
        eventEmitter.on(`EventSetFont${this.state.id}`, this.setFont);
        eventEmitter.on(`EventChangeSize${this.state.id}`, this.changeSizeText);
        eventEmitter.on(`EventChangeContentText${this.state.id}`, this.changeContentText);
        eventEmitter.on(`EventSaveWidth${this.state.targetSection}`,this.saveSize);
    }

    componentWillUnmount = () => {
        eventEmitter.off(`EventChangeColorText${this.state.id}`, this.changeColorText);
        eventEmitter.off(`EventSetFont${this.state.id}`, this.setFont);
        eventEmitter.off(`EventChangeSize${this.state.id}`, this.changeSizeText);
        eventEmitter.off(`EventChangeContentText${this.state.id}`, this.changeContentText);
        eventEmitter.off(`EventSaveWidth${this.state.targetSection}`,this.saveSize);
    }
}

export default TextComponent;