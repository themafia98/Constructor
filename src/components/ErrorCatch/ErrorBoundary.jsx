

import React from 'react';
import eventEmitter from '../../EventEmitter';
import ErrorPage from './ErrorPage';
import {Redirect} from 'react-router-dom';
class ErrorBoundary extends React.PureComponent {

      state = { 
        hasError: false,
      };

    static getDerivedStateFromError(error) {
        console.log(error);
      // Обновить состояние с тем, чтобы следующий рендер показал запасной UI.
      return { hasError: true};
    }

    updateApplication = event => {
      this.setState({hasError: false});
    };
  
    componentDidCatch(error, info) {
      // Можно также сохранить информацию об ошибке в соответствующую службу журнала ошибок
     console.error(error + "," + info);
    }
  
    render() {
      if (this.state.hasError) return <ErrorPage />
      return this.props.children;
    }

    componentDidMount = () => {
      eventEmitter.on('EventErrorCatchUpdate',this.updateApplication);
    }

    componentWillUnmount = () => {
      eventEmitter.off('EventErrorCatchUpdate',this.updateApplication);
    }
  }

  export default ErrorBoundary;