import { AuthState, AppReducer, StoreAction, SimpleReducer } from '../storeTypes';
import { AuthActionTypes } from '../actions/actionTypes';
import User from '../../models/user';

const initialState: AuthState = {
	user: null,
	expirationTime: null,
};

type AuthActionPayload = { user: User; expirationTime: number };

type Reducer<T = AuthActionPayload> = (
	state: AuthState,
	action: StoreAction<T>
) => AuthState;

const setLoggedUser: SimpleReducer<AuthState, User> = (state, action) => {
	return {
		...state,
		user: action.payload,
	};
};

const logIn: Reducer = (state, action) => {
	return {
		...state,
		user: action.payload.user,
		expirationTime: action.payload.expirationTime,
	};
};

const logOut: Reducer<void> = (state) => {
	return {
		...initialState,
	};
};

const reducer: AppReducer<AuthState> = (state = initialState, action) => {
	switch (action.type) {
		case AuthActionTypes.Authorize:
			return logIn(state, action);
		case AuthActionTypes.LogOut:
			return logOut(state, action);
		case AuthActionTypes.SetLoggedUser:
			return setLoggedUser(state, action);
		case AuthActionTypes.UpdatePassword:
			return state;
		default:
			return state;
	}
};

export default reducer;
