import React from 'react';
import PropTypes from 'prop-types';
import MainBackground from './MainBackground/MainBackground';


const Section = props => {
    if (props.mode === 'dev') {
        const { currentProjectsData } = props.userData;
        const section = currentProjectsData.sectionsProject;

        return section.map((item, i) => {
            return ( <
                MainBackground key = { item }
                componentJSX = { props.componentJSX }
                currentProjectsData = { currentProjectsData }
                editComponentName = { props.editComponentName }
                countComponents = { props.componentJSX.length }
                menuActive = { props.menuActive }
                sizeParentBox = { props.sizeParentBox }
                id = { item }
                countSection = { currentProjectsData.sectionsProject.length }
                sectionNumber = { i }
                mode = { props.mode }
                />
            );
        });
    } else if (props.mode === 'production') {
        const { section } = props;
        const { currentProjectsData } = props;
        return section.map((item, i) => {
            return ( <
                MainBackground key = { item }
                componentJSX = { props.componentsProdJSX }
                currentProjectsData = { currentProjectsData }
                editComponentName = { props.editComponentName }
                countComponents = { props.componentsProdJSX.length }
                sizeParentBox = { props.sizeParentBox }
                id = { item }
                sectionNumber = { i }
                mode = { props.mode }
                />
            );
        });
    }
}

Section.propTypes = {
    componentJSX: PropTypes.array, /// array with jsx components
    editComponentName: PropTypes.string, // name current edit component
    menuActive: PropTypes.bool, // build menu
    mode: PropTypes.string.isRequired, // curent mode
    sizeParentBox: PropTypes.object, // data with size main component
    userData: PropTypes.object // users data
}

export default Section;