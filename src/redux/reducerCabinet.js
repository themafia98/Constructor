const initialState = {
    idUser: 'id' + (Math.trunc(Math.random() * 10000)),
    dateConnect: new Date(Date.now()).toLocaleString().replace(/\s/ig,'').split(','),
};


export default (state = initialState, action) => {

    return state;
}

