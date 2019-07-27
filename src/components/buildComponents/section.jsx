import React from 'react';

import MainBackground from './MainBackground/MainBackground';

const Section = props => {

    const {currentProjectsData} = props.userData;
    const section = currentProjectsData.sectionTitleProject;

            return section.map(item => {
                return (
                    <MainBackground
                        key = {item}
                        mainBuilderData = {{...props.mainBuilderData}}
                        currentProjectsData = {{...currentProjectsData}}
                        editComponentName = {props.editComponentName}
                        countComponents = {props.mainBuilderData.componentJSX.length}
                        menuActive = {props.menuActive}
                        sizeParenBox = {props.sizeParenBox}
                        id = {item}
                    >
                        {{name: props.editComponentName}}
                    </MainBackground>
                );
            });
}

export default Section;