import React from 'react';


const CreateNewProject = props => {
    return (
        <div className = 'guide addComponents'>
            <h4 className = 'guide__title'>Add components</h4>
            <p className = 'guide_content'>
                If you want to create a new project,
                in your account (/ Cabinet) click on the button at the top of the page.
            </p>
            <img src = {process.env.PUBLIC_URL + '/img/newProject.gif'} alt = 'guide'></img>
        </div>
    )
}

export default CreateNewProject;