import React from 'react';
import PropTypes from 'prop-types';


import List from '../List/List.jsx';

import './ProjectsSection.scss';

class ProjectsSection extends React.PureComponent {

    static propTypes = {
        projects: PropTypes.array,
    }

    render(){
        console.log(this.props);
        return (
                <section className = 'projectsList'>
                <div className = 'container'>
                <div className = 'flex-column'>
                        <div className = 'projectsList__about'>
                            <h3>Your Projects</h3>
                        </div>
                        <List />
                    </div>
                </div>
                </section>
        )
    }

}

export default ProjectsSection;