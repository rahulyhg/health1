import { createStore } from 'redux';
import habitsReducer from '../reducer/habits';

var store = createStore(habitsReducer);

export default store;
