import React from 'react';


const OpenPanel = props => {



    return (
        <div className = 'guide openPanelGuide'>
            <h4 className = 'guide__title'>Open panel</h4>
            <p className = 'guide_content'>
                If you want to open the toolbar, you should double-click on the background.
            </p>
            <img src = {process.env.PUBLIC_URL + '/img/guideOpenPanel.gif'} alt = 'guide'></img>
        </div>
    )
}

export default OpenPanel;