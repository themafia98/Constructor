import React from 'react';
import eventEmitter from '../../EventEmitter';

import {animateScroll as scroll, scroller } from "react-scroll";

class ScrollMove extends React.PureComponent {

    state = {
        scrollConfig: {
            duration: 1000,
            delay: 50,
            smooth: true,
            offset: -60, // Scrolls to element -80 pixels down the page
        },
        position: 0,
        positionCount: null

    }

    setStates = event => {
        this.setState({...this.state,positionCount: event});
    }

    moveLocation = event => {
        const count = this.state.positionCount;
        const moveDown = this.state.position < count && event.deltaY > 0;
        const moveUp = event.deltaY < 0 && this.state.position > 0;
        eventEmitter.emit('EventClosePanel',{close: false});

        if (moveDown)
            this.setState({ position: this.state.position + 1},
                () => scroller.scrollTo(`element${this.state.position}`,this.state.scrollConfig));
            else if (moveUp){
                this.state.position === 1 &&
                    this.setState({position: this.state.position - 1}, () => scroll.scrollToTop());
                this.state.position !== 1 &&
                    this.setState({position: this.state.position - 1},
                        () => scroller.scrollTo(`element${this.state.position}`,this.state.scrollConfig));
            }

    }


    render(){
        return (
            <div key = 'moveScroll' onWheel = {this.moveLocation}>
                {this.props.children}
            </div>
        )
    }

    componentDidMount = () => {
        eventEmitter.on('EventSetState', this.setStates);
    }

    componentWillUnmount = () => {
        eventEmitter.off('EventSetState', this.setStates);
    }
}


export default ScrollMove;