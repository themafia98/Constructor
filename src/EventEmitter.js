import {EventEmitter} from 'events';

const stream = new EventEmitter();
const controllerStream = new EventEmitter();

export {controllerStream};
export default stream;
