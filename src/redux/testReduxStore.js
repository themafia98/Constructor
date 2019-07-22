import configureStore from 'redux-mock-store';

const initialState = {cabinet: {idUser:"0", projects: []}};

// here it is possible to pass in any middleware if needed into //configureStore
const mockStore = configureStore();

const store = mockStore(initialState);

export default store;