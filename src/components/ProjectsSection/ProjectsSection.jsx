import React from 'react';
import PropTypes from 'prop-types';

import './ProjectsSection.scss';

class ProjectsSection extends React.PureComponent {

    static propTypes = {
        projects: PropTypes.object,
    }

    state = {
    }

    render(){

        return (
                <section className = 'projectsList'>
                <div className = 'container center'>
                    <div className = 'projectsList__about'>
                        <h3>Your Projects</h3>
                    </div>
                </div>
                </section>
        )
    }

}

export default ProjectsSection;