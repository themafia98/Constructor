import React from 'react';
import PropTypes from 'prop-types';
import List from '../List/List.jsx';
import './ProjectsSection.scss';

const ProjectsSection = props => {

        return (
                <section className = 'projectsList'>
                    <div className = 'container'>
                        <div className = 'flex-column'>
                            <div className = 'projectsList__about'>
                                <h3>Your Projects</h3>
                            </div>
                            <List cabinetStream = {props.cabinetStream} />
                        </div>
                    </div>
                </section>
        )

}

ProjectsSection.propTypes = {
    cabinetStream: PropTypes.object /** @Events stream */
}

export default ProjectsSection;