import React from 'react';


const AddComponents = props => {
    return (
        <div className = 'guide addComponents'>
            <h4 className = 'guide__title'>Add components</h4>
            <p className = 'guide_content'>
                Click on the button at the top of the screen
                and select a component.
            </p>
            <img src = {process.env.PUBLIC_URL + '/img/add.gif'} alt = 'guide'></img>
        </div>
    )
}

export default AddComponents;