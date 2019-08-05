import React from 'react';
import styled from 'styled-components';

const AnimationTitle = styled.h3`
    user-select: none;
    transition: .4s linear all;
    color: ${props => props.dir === 'up' ? 'red' : 'blue'};
`;

class AnimationText extends React.PureComponent {

    state = {
        tilteContent: this.props.content.split(''),
        currentTitle: this.props.content[0],
        positionTitle: 1,
        directionAnimation: 'up',
        msAnimation: this.props.msAnimation,
        msTimeout: this.props.msAnimation,
        msPauseEnd: this.props.msPauseEnd,
    }

    _isMounted = false;
    timerAnimation = null;

    animationTitle = timer => {
        let self = this;
        if (this._isMounted)
        timer = setTimeout( function tick(){

            if (self._isMounted) {
                if (self.state.directionAnimation === 'up'){
                    let counter = self.state.tilteContent.length;
                    const word = counter > self.state.positionTitle ?
                                self.state.tilteContent[self.state.positionTitle] :
                                self.state.tilteContent[self.state.positionTitle-1];
                    self.setState({
                        ...self.state,
                        currentTitle: self.state.currentTitle + word,
                        positionTitle: self.state.positionTitle + 1,
                        directionAnimation: self.state.positionTitle === counter ? 'down' : 'up',
                        msAnimation: self.state.positionTitle === counter ?
                            self.state.msPauseEnd : self.state.msTimeout
                    });
                }
                if (self.state.directionAnimation === 'down'){
                    let _title = self.state.currentTitle;
                    const length = self.state.currentTitle.length;
                    _title = _title.slice(0,length - 1);
                    self.setState({
                        ...self.state,
                        currentTitle: _title,
                        positionTitle: self.state.positionTitle - 1,
                        directionAnimation: self.state.positionTitle === 2 ? 'up' : 'down',
                        msAnimation: self.state.positionTitle === 2 ?
                            self.state.msPauseEnd : self.state.msTimeout
                    });
                }
            timer = setTimeout(tick, self.state.msAnimation);
            }
        }, this.state.msAnimation);

    }


    render(){
        return (
            <AnimationTitle data-titlebuild dir = {this.state.directionAnimation}>
                {this.state.currentTitle}
            </AnimationTitle>
        )

    }

    componentDidMount = (e) => {
        this._isMounted = true;
        this.animationTitle(this.timerAnimation);
    }

    componentWillUnmount = (e) => {
        this._isMounted = false;
        if (this.timerAnimation) clearTimeout(this.timerAnimation);
    }
}


export default AnimationText;