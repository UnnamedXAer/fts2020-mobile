import { RedirectTo } from '../../types/types';
import { NavigationActionTypes } from '../actions/actionTypes';
import { AppReducer, NavigationState, SimpleReducer } from '../storeTypes';

const initialState: NavigationState = {
	redirectTo: null
};

const setRedirectTo: SimpleReducer<NavigationState, RedirectTo> = (state, action) => {
	return {
		...state,
		redirectTo: action.payload
	};
};

const clearState: SimpleReducer<NavigationState, undefined> = (state, action) => {
	return {
		...initialState
	};
};

const reducer: AppReducer<NavigationState, NavigationActionTypes> = (
	state = initialState,
	action
) => {
	switch (action.type) {
		case NavigationActionTypes.SetRedirect:
			return setRedirectTo(state, action);
		case NavigationActionTypes.ClearState:
			return clearState(state, action);
		default:
			return state;
	}
};

export default reducer;
