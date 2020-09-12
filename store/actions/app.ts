import { AppActionTypes } from './actionTypes';
import { StoreAction } from '../storeTypes';

export const setAppLoading = (
	loading: boolean
): StoreAction<boolean, AppActionTypes.SetLoading> => {
	return {
		type: AppActionTypes.SetLoading,
		payload: loading,
	};
};