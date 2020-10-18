import { RedirectTo } from '../../types/types';
import { StoreAction } from '../storeTypes';
import { NavigationActionTypes } from './actionTypes';

export type SetRedirectToAction = StoreAction<
	RedirectTo | null,
	NavigationActionTypes.SetRedirect
>;

export const setRedirectTo = (options: RedirectTo | null): SetRedirectToAction => {
	return {
		type: NavigationActionTypes.SetRedirect,
		payload: options
	};
};
