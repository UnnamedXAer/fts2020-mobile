import { AsyncStorage } from 'react-native';
import { ThunkAction } from 'redux-thunk';
import { Credentials } from '../../models/auth';
import axios from '../../axios/axios';
import {
	AUTHORIZE,
	LOGOUT,
	TasksActionTypes,
	FlatsActionTypes,
	AuthActionTypes,
} from './actionTypes';
import RootState, { StoreAction } from '../storeTypes';
import User from '../../models/user';

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
): ThunkAction<Promise<void>, RootState, any, AuthorizeAction> => {
	return async (dispatch, _getState) => {
		const url = `/auth/${isLogIn ? 'login' : 'register'}`;
		try {
			const { data } = await axios.post(url, credentials);

			const user = new User(
				data.user.id,
				data.user.emailAddress,
				data.user.userName,
				data.user.provider,
				new Date(data.user.joinDate),
				data.user.avatarUrl,
				data.user.active
			);

			const expirationTime = Date.now() + data.expiresIn;

			dispatch({
				type: AUTHORIZE,
				payload: {
					user,
					expirationTime,
				},
			});

			setTimeout(() => {
				dispatch(logOut());
			}, data.expiresIn);

			await AsyncStorage.multiSet([['loggedUser', JSON.stringify(user)], ['expirationTime', '' + expirationTime]]);
		} catch (err) {
			throw err;
		}
	};
};

export const tryAuthorize = (): ThunkAction<Promise<void>, RootState, any, AuthorizeAction> => {
	return async (dispatch) => {
		const [[_, savedUser], [_2, expirationTime]] = await AsyncStorage.multiGet(['loggedUser', 'expirationTime']);
		if (
			savedUser &&
			expirationTime &&
			new Date(+expirationTime).getTime() > Date.now()
		) {
			dispatch({
				type: AUTHORIZE,
				payload: {
					user: JSON.parse(savedUser),
					expirationTime: +expirationTime,
				},
			});

			setTimeout(() => {
				dispatch(logOut());
			}, +expirationTime - Date.now());
		} else {
			throw new Error('Auto-authorization was not possible.');
		}
	}
};

export const logOut = (): ThunkAction<
	Promise<void>,
	RootState,
	any,
	AuthorizeAction
> => {
	return async (dispatch) => {
		const clearState = () => {
			dispatch({
				type: LOGOUT,
			});
			dispatch({
				type: TasksActionTypes.ClearState,
			});
			dispatch({
				type: FlatsActionTypes.ClearState,
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
		const url = `/auth/changePassword`;
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
