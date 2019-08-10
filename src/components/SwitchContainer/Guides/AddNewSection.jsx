import React from 'react';


const AddNewSection = props => {
    return (
        <div className = 'guide addComponents'>
            <h4 className = 'guide__title'>Add components</h4>
            <p className = 'guide_content'>
                If you want to add a new section,
                click on the button at the bottom of the page.
            </p>
            <img src = {process.env.PUBLIC_URL + '/img/newSection.gif'} alt = 'guide'></img>
        </div>
    )
}

export default AddNewSection;