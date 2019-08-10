import React from 'react';
import renderer from 'react-test-renderer';
import AnimationText from '../components/AnimationText/AnimationTitle';

const AnimationTextComponent = renderer.create(
            <AnimationText 
                content = 'Build your landing page!'
                msPauseEnd = {1000}
                msAnimation = {150}
            />
);

test("AnimationText test", function(){

    let snapshotAnimationTextComponent = AnimationTextComponent.toJSON();
    expect(snapshotAnimationTextComponent).toMatchSnapshot();
});