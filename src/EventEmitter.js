import {EventEmitter} from 'events';

const stream = new EventEmitter(); /** @Events head event stream */
const controllerStream = new EventEmitter(); /** @Events for controllers */

export {controllerStream};
export default stream;
