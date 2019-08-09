import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import firebase from '../Firebase/Firebase';

/** stores for  jest */

const initialStateOffline = {
    cabinet: {
    active: false,
    idUser: null,
    projects: [
        {
            components: [],
            id:null,
            title: null,
            type: null,
        }
    ],
    },
    builder: {}
};

const initialState = {
    cabinet: {
    active: true,
    idUser: "testToken",
    projects: [
        {
            components: [
               {
                backgroundImage: null,
                color: null,
                content: null,
                fontSize: "135",
                image: null,
                targetSection: "Header",
                type: "text"
                }
            ],
            id: 0,
            title: "Test1",
            type: "landing",
        }
    ],
    },
    builder: {
        loadProject: true,
        haveUpdateLoading: true,
        idProject: 0,
        typeProject: "portfolio",
        components: [],
        sectionsProject: [],
    }
};

const middlewares = [thunk.withExtraArgument({firebase})] /** test middlewares */
const mockStore = configureStore(middlewares); /** test config store */

const store = mockStore(initialState); /** init test store */

export default store;
export {initialStateOffline};