import configureStore, {applyMiddleware} from 'redux-mock-store';
import thunk from 'redux-thunk';
import firebase from '../Firebase/Firebase';
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

const middlewares = [thunk.withExtraArgument({firebase})] // add your middlewares like `redux-thunk`
// here it is possible to pass in any middleware if needed into //configureStore
const mockStore = configureStore(middlewares);

const store = mockStore(initialState);



export default store;
export {initialStateOffline};