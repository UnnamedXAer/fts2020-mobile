import { combineReducers, createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import authReducer from './reducers/auth';
import flatsReducer from './reducers/flats';
import tasksReducer from './reducers/tasks';
import usersReducer from './reducers/users';

const rootReducer = combineReducers({
	auth: authReducer,
	flats: flatsReducer,
	tasks: tasksReducer,
	users: usersReducer
});

const store = createStore(
	rootReducer,
	applyMiddleware(ReduxThunk)
);

export default store;
