import configureStore from 'redux-mock-store';


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
    idUser: "asdasdsdasda",
    projects: [
        {
            components: [
               {
                backgroundImage: null,
                color: null,
                content: null,
                fontSize: "135",
                image: null,
                name: "Header",
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
        components: []
    }
};
// here it is possible to pass in any middleware if needed into //configureStore
const mockStore = configureStore();

const store = mockStore(initialState);

export default store;
export {initialStateOffline};