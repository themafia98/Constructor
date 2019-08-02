import React from 'react';
import MainBackground from './MainBackground/MainBackground';


const Section = props => {

    if (props.mode === 'dev'){
    const {currentProjectsData} = props.userData;
    const section = currentProjectsData.sectionsProject;
            return section.map((item,i) => {
                return (
                        <MainBackground
                            key = {item}
                            componentJSX = {[...props.componentJSX]}
                            currentProjectsData = {{...currentProjectsData}}
                            editComponentName = {props.editComponentName}
                            countComponents = {props.componentJSX.length}
                            menuActive = {props.menuActive}
                            sizeParentBox = {props.sizeParentBox}
                            id = {item}
                            sectionNumber = {i}
                            mode = {props.mode}
                        >
                            {{targetSection: props.editComponentName}}
                        </MainBackground>
                );
            });
    } else if (props.mode === 'production'){
       const {section} = props;
       const {currentProjectsData} = props;
        return section.map((item,i) => {
            return (
                    <MainBackground
                        key = {item}
                        componentJSX = {[...props.componentsProdJSX]}
                        currentProjectsData = {{...currentProjectsData}}
                        editComponentName = {props.editComponentName}
                        countComponents = {props.componentsProdJSX.length}
                        sizeParentBox = {props.sizeParentBox}
                        id = {item}
                        mode = {props.mode}
                    >
                        {{targetSection: props.editComponentName}}
                    </MainBackground>
            );
        });
    }
}

export default Section;