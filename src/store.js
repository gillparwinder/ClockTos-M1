const { combineReducers, createStore } = require("redux");
import detailReducer from './reducers/detailReducer';

const rootReducer = combineReducers({
    detailReducer : detailReducer
})

const configureStore = () => createStore(rootReducer);
export default configureStore;