import React,{Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {CSSTransition} from 'react-transition-group';
/* ------- Event stream ------- */
import Events from 'events';
/* ------- HOC for het firebase controll object ------- */
import withFirebase from '../../components/withFirebase';
/* ------- Moddlewares ------- */
import {middlewareLogOutUser} from '../../redux/middleware/loadUserMiddleware';
import middlewareDelete from '../../redux/middleware/middlewareDelete';
/* ------- Child components ------- */
import Loader from '../../components/loading/Loader';
import Header from '../../components/header/Header';
import Modal from '../../components/modalWindow/ModalWindow';
import ProjectsSection from '../../components/ProjectsSection/ProjectsSection';
import './Cabinet.scss';

class Cabinet extends React.PureComponent {

	static propTypes = {
		firebase: PropTypes.object.isRequired, /** @firebase class for use firebase functions */
		active: PropTypes.bool, /** @active - status firebase auth */
		dispatch: PropTypes.func.isRequired, /** @dispatch - redux */
		history: PropTypes.object.isRequired, /** @Router HTML5 history */
		location: PropTypes.object.isRequired, /** @Router */
		match: PropTypes.object.isRequired, /** @Router */
		idUser: PropTypes.string, /** @Session user id from redux */
		projects: PropTypes.arrayOf(PropTypes.object).isRequired /** @Projects array with user projects from redux */
	}

	cabinetStream = new Events();

	state = {
		modalActive: false,
		workMode: 'default',
	}

	logOut = () => {
		/** destroy session */
		this.props.dispatch(middlewareLogOutUser(this.props.idUser));
	}

	deletItem = event => {
		/** destroy project */
		this.props.dispatch(middlewareDelete({...event, uid: this.props.firebase.getCurrentUser().uid}));
	};

		changeWorkMode = event => {
		/** workMode changes */
		this.setState ({
		...this.state,
		modalActive: event.active,
		workMode: event.action
		});
		}


	render(){

		if (this.props.active){
		return (
		<Fragment>
				<Header cabinetStream = {this.cabinetStream} 
					title = {this.props.config.title} 
					idUser = {this.props.idUser} 
				/>
				<div className = 'Cabinet'>
				<CSSTransition
					in={this.state.modalActive}
					timeout={300}
					classNames="modalAnimation"
					unmountOnExit
					appear
				>
				<Modal
					cabinetStream = {this.cabinetStream}
					workMode = {this.state.workMode} 
				/>
				</CSSTransition>
				<ProjectsSection cabinetStream = {this.cabinetStream} />
				</div>
			</Fragment>
		)
		} else if (!this.props.firebase.getCurrentUser()) return <Redirect to = { '/'} />
		else return <Loader path = '/img/loading.gif' type = 'Cabinet' />
	}


	componentDidMount = () => {
		this.cabinetStream.on('EventDeleteItem', this.deletItem);
		this.cabinetStream.on('EventChangeWorkMode', this.changeWorkMode);
	};

	componentWillUnmount = () => {
		this.cabinetStream.off('EventDeleteItem', this.deletItem);
		this.cabinetStream.off('EventChangeWorkMode', this.changeWorkMode);
	}
}

	const mapStateToProps = (state) => {
	return {
		idUser: state.cabinet.idUser,
		projects: [...state.cabinet.projects],
		active: state.cabinet.active
	}
	};

	export default connect(mapStateToProps)(withFirebase(Cabinet));
