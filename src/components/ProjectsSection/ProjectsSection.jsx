import React from 'react';

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
                            {List ? <List /> : null}
                        </div>
                    </div>
                </section>
        )

}

export default ProjectsSection;