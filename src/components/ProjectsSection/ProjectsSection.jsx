import React from 'react';
import PropTypes from 'prop-types';


import List from '../List/List.jsx';

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
                    <List>
                        {{count: 10}}
                    </List>
                </div>
                </section>
        )
    }

}

export default ProjectsSection;