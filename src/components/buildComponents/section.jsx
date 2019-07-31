import React from 'react';
import MainBackground from './MainBackground/MainBackground';

const Section = props => {

    const {currentProjectsData} = props.userData;
    const section = currentProjectsData.sectionTitleProject;
            return section.map((item,i) => {
                return (
                        <MainBackground
                            key = {item}
                            mainBuilderData = {{...props.mainBuilderData}}
                            currentProjectsData = {{...currentProjectsData}}
                            editComponentName = {props.editComponentName}
                            countComponents = {props.mainBuilderData.componentJSX.length}
                            menuActive = {props.menuActive}
                            sizeParentBox = {props.sizeParentBox}
                            id = {item}
                            sectionNumber = {i}
                        >
                            {{targetSection: props.editComponentName}}
                        </MainBackground>
                );
            });
}

export default Section;