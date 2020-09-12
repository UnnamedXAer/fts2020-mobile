import { AppReducer, StoreAction, AppState } from '../storeTypes';
import User from '../../models/user';
import { AppActionTypes } from '../actions/actionTypes';

const initialState: AppState = {
	loading: false,
};

type AuthActionPayload = { user: User; expirationTime: number };

type Reducer<T = AuthActionPayload> = (
	state: AppState,
	action: StoreAction<T>
) => AppState;

const setLoading: Reducer<boolean> = (state, action) => {
	return {
		...state,
		loading: action.payload,
	};
};

const clearState: Reducer = (state, action) => {
	return {
		...initialState,
		loading: state.loading,
	};
};

const reducer: AppReducer<AppState> = (state = initialState, action) => {
	switch (action.type) {
		case AppActionTypes.SetLoading:
			return setLoading(state, action);
		case AppActionTypes.ClearState:
			return clearState(state, action);
		default:
			return state;
	}
};

export default reducer;
