import React from 'react';
import eventEmitter from '../EventEmitter';
import {animateScroll as scroll, scroller } from "react-scroll";


const withScroll = Component => {
    return class ScrollMove extends React.PureComponent {

        state = {
            mode: 'default',
            scrollConfig: {
                duration: 1000,
                delay: 50,
                smooth: true,
                offset: -60
            },
            position: 0,
            positionCount: null

        }

        setStates = event => {
            /** Count all positions */
            this.setState({...this.state,positionCount: event});
        }

        blockMove = event => {
            /** block for move */
            this.setState({...this.state, mode: event})
        }

        moveLocation = event => {
            /** Scrolling */
            if (this.state.mode === 'default'){
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

        }


        render(){
            return (
                <React.Fragment>
                        <div key = 'moveScroll' onWheel = {this.moveLocation} onTouchStart = {() => false}
                        >
                            {<Component {...this.props} />}
                        </div>
                </React.Fragment>
            )
        }

        componentDidMount = () => {
            eventEmitter.on('EventBlockScroll', this.blockMove);
            eventEmitter.on('EventSetState', this.setStates);
        }

        componentWillUnmount = () => {
            eventEmitter.off('EventBlockScroll', this.blockMove);
            eventEmitter.off('EventSetState', this.setStates);
        }
    }
}


export default withScroll;