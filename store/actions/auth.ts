import AsyncStorage from '@react-native-community/async-storage';
import { ThunkAction } from 'redux-thunk';
import { Credentials } from '../../models/auth';
import axios from '../../axios/axios';
import {
	TasksActionTypes,
	FlatsActionTypes,
	AuthActionTypes,
	UsersActionTypes,
	InvitationsActionTypes,
	TaskPeriodsActionTypes,
	AppActionTypes,
} from './actionTypes';
import RootState from '../storeTypes';
import User from '../../models/user';
import { FetchUserAction } from './users';
import { mapApiUserDataToModel } from '../mapAPIToModel/mapUser';

type AuthorizeActionPayload = {
	user: User;
	expirationTime: number;
};

type AuthorizeAction = {
	type: string;
	payload?: AuthorizeActionPayload;
};

export const authorize = (
	credentials: Credentials,
	isLogIn: boolean
): ThunkAction<Promise<void>, RootState, any, AuthorizeAction | FetchUserAction> => {
	return async (dispatch, _getState) => {
		const url = `/auth/${isLogIn ? 'login' : 'register'}`;
		try {
			const { data } = await axios.post(url, credentials);

			const user = mapApiUserDataToModel(data.user);

			const expirationTime = Date.now() + data.expiresIn;

			dispatch({
				type: AuthActionTypes.Authorize,
				payload: {
					user,
					expirationTime,
				},
			});

			dispatch({
				type: UsersActionTypes.SetUser,
				payload: user,
			});

			await AsyncStorage.multiSet([
				['loggedUser', JSON.stringify(user)],
				['expirationTime', '' + expirationTime],
			]);
		} catch (err) {
			throw err;
		}
	};
};

export const tryAuthorize = (): ThunkAction<
	Promise<void>,
	RootState,
	any,
	AuthorizeAction | FetchUserAction
> => {
	return async (dispatch) => {
		const [[_, savedUser], [_2, savedExpirationTime]] = await AsyncStorage.multiGet([
			'loggedUser',
			'expirationTime',
		]);
		const expirationTime = savedExpirationTime ? +savedExpirationTime : 0;

		if (
			savedUser &&
			expirationTime &&
			new Date(expirationTime).getTime() > Date.now()
		) {
			const userObj = JSON.parse(savedUser) as User;

			dispatch({
				type: AuthActionTypes.Authorize,
				payload: {
					user: userObj,
					expirationTime,
				},
			});

			dispatch({
				type: UsersActionTypes.SetUser,
				payload: userObj,
			});

			const expiresIn = +expirationTime - Date.now();
			if (expiresIn < 1000 * 60) {
				setTimeout(() => {
					dispatch(logOut());
				}, expiresIn);
			}
		} else {
			throw new Error('Auto-authorization was not possible.');
		}
	};
};

export const logOut = (): ThunkAction<Promise<void>, RootState, any, AuthorizeAction> => {
	return async (dispatch) => {
		const clearState = () => {
			dispatch({
				type: AuthActionTypes.LogOut,
			});
			dispatch({
				type: TasksActionTypes.ClearState,
			});
			dispatch({
				type: FlatsActionTypes.ClearState,
			});
			dispatch({
				type: InvitationsActionTypes.ClearState,
			});
			dispatch({
				type: TaskPeriodsActionTypes.ClearState,
			});
			dispatch({
				type: UsersActionTypes.ClearState,
			});
			dispatch({
				type: AppActionTypes.ClearState,
			});
		};

		try {
			await axios.post('/auth/logout');
			clearState();
		} catch (err) {
			if (await AsyncStorage.getItem('loggedUser')) {
				setTimeout(() => {
					dispatch(logOut());
				}, 500);
			} else {
				clearState();
			}
		}
		await AsyncStorage.multiRemove(['loggedUser', 'expirationTime']);
	};
};

export const updateLoggedUser = (
	user: User
): ThunkAction<
	Promise<void>,
	RootState,
	any,
	{ payload: User; type: AuthActionTypes.SetLoggedUser }
> => {
	return async (dispatch) => {
		await AsyncStorage.setItem('loggedUser', JSON.stringify(user));

		dispatch({
			type: AuthActionTypes.SetLoggedUser,
			payload: user,
		});
	};
};

export const updatePassword = (
	oldPassword: string,
	newPassword: string,
	confirmPassword: string
): ThunkAction<
	Promise<void>,
	RootState,
	any,
	{ type: AuthActionTypes.UpdatePassword }
> => {
	return async (dispatch) => {
		const url = `/auth/change-password`;
		try {
			await axios.post(url, {
				oldPassword,
				newPassword,
				confirmPassword,
			});

			dispatch({
				type: AuthActionTypes.UpdatePassword,
				payload: void 0,
			});
		} catch (err) {
			throw err;
		}
	};
};
