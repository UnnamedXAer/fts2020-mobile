import { combineReducers, createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk';
import authReducer from './reducers/auth';
import appReducer from './reducers/app';
import flatsReducer from './reducers/flats';
import tasksReducer from './reducers/tasks';
import taskPeriodsReducer from './reducers/periods';
import usersReducer from './reducers/users';
import invitationsReducer from './reducers/invitations';
import navigationReducer from './reducers/navigation';

const rootReducer = combineReducers({
	auth: authReducer,
	app: appReducer,
	flats: flatsReducer,
	tasks: tasksReducer,
	users: usersReducer,
	periods: taskPeriodsReducer,
	invitations: invitationsReducer,
	navigation: navigationReducer
});

const middleware = [ReduxThunk];

const store = createStore(rootReducer, applyMiddleware(...middleware));

export default store;
