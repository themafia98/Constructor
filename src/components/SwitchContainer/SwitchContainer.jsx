import React from 'react';
import PropTypes from 'prop-types';

import OpenPanel from './Guides/OpenPanel';
import SearchGuide from './Guides/SearchGuide';
import AddComponents from './Guides/AddComponents';
import AddNewSection from './Guides/AddNewSection';
import CreateNewProject from './Guides/CreateNewProject';
import Icon from '../Icon/icon';
import './switchContainer.scss';

class SwitchContainer extends React.PureComponent {

    static propTypes = {
        mode: PropTypes.string,
    }

    state = {
        mode: 'panel'
    }

    changeWorkMode = event => {
        event.target === this.refOP &&
        this.setState({
            ...this.state,
            mode: 'panel'
        });
        event.target === this.refSE &&
        this.setState({
            ...this.state,
            mode: 'search'
        });
        event.target === this.refADD &&
        this.setState({
            ...this.state,
            mode: 'add'
        });
        event.target === this.refSN &&
        this.setState({
            ...this.state,
            mode: 'section'
        });
        event.target === this.refPR &&
        this.setState({
            ...this.state,
            mode: 'project'
        });
        event.stopPropagation();
    }

    refOP = null;
    refSE = null;
    refADD = null;
    refSN = null;
    refPR = null

    refOpenPanel  = node => this.refOP = node;
    refSearch = node => this.refSE = node;
    refAdd = node => this.refADD = node;
    refSection = node => this.refSN = node;
    refProject = node => this.refPR = node;

    render(){
        return(
            <div className = 'switchContainer'>
                <div className = 'col--17 col-sm-10 switchContainer__controllers'>
                    <Icon className = 'switchContainer__menu' path = '/img/Menu_Burder.png' />
                    <ul className = 'guide_list list'>
                        <li>
                            <input
                                onClick = {this.changeWorkMode}
                                className = {
                                    this.state.mode !== 'panel' ?
                                    'switch__button panel'
                                    : 'switch__button panel activeButton'
                                }
                                type = 'button'
                                ref = {this.refOpenPanel}
                                value = 'Open panel for edit'
                            />
                        </li>
                        <li>
                            <input
                                onClick = {this.changeWorkMode}
                                className = {
                                    this.state.mode !== 'search' ?
                                    'switch__button search'
                                    : 'switch__button search activeButton'
                                }
                                type = 'button'
                                ref = {this.refSearch}
                                value ='Search image/media'
                            />
                        </li>
                        <li>
                            <input
                                onClick = {this.changeWorkMode}
                                className = {
                                    this.state.mode !== 'add' ?
                                    'switch__button add'
                                    : 'switch__button add activeButton'
                                }
                                type = 'button'
                                ref = {this.refAdd}
                                value ='Adding components'
                            />
                        </li>
                        <li>
                            <input
                                onClick = {this.changeWorkMode}
                                className = {
                                    this.state.mode !== 'section' ?
                                    'switch__button section'
                                    : 'switch__button section activeButton'
                                }
                                type = 'button'
                                ref = {this.refSection}
                                value ='Adding new section'
                            />
                        </li>
                        <li>
                            <input
                                onClick = {this.changeWorkMode}
                                className = {
                                    this.state.mode !== 'project' ?
                                    'switch__button project'
                                    : 'switch__button project activeButton'
                                }
                                type = 'button'
                                ref = {this.refProject}
                                value ='Create new project'
                            />
                        </li>
                    </ul>
                </div>
                <div className = 'col--80--1'>
                    {this.state.mode === 'panel' &&
                        <OpenPanel />
                    }
                    {this.state.mode === 'search' &&
                        <SearchGuide />
                    }
                    {this.state.mode === 'add' &&
                        <AddComponents />
                    }
                    {this.state.mode === 'section' &&
                        <AddNewSection />
                    }
                    {this.state.mode === 'project' &&
                        <CreateNewProject />
                }
                </div>
            </div>
        )
    }
}

export default SwitchContainer;