import { ThunkAction } from 'redux-thunk';
import RootState from '../storeTypes';
import axios from '../../axios/axios';
import { UsersActionTypes } from './actionTypes';
import User from '../../models/user';
import { AxiosResponse } from 'axios';
import { APIUser } from '../apiTypes';
import { mapApiUserDataToModel } from '../mapAPIToModel/mapUser';

export type FetchUserAction = {
	type: UsersActionTypes.SetUser;
	payload: User;
};


export const fetchUser = (
	userId: number
): ThunkAction<Promise<void>, RootState, any, FetchUserAction> => {
	return async (dispatch) => {
		const url = `/users/${userId}`;
		try {
			const { data, status } = await axios.get<APIUser>(url);
			if (status === 200) {
				const user = mapApiUserDataToModel(data);
				dispatch({
					type: UsersActionTypes.SetUser,
					payload: user,
				});
			} else {
				throw new Error('User not found!');
			}
		} catch (err) {
			throw err;
		}
	};
};

export const updateUser = (
	userId: number,
	user: Partial<User>
): ThunkAction<Promise<void>, RootState, any, FetchUserAction> => {
	return async (dispatch) => {
		const url = `/users/${userId}`;
		try {
			const { data } = await axios.patch<
				Partial<User>,
				AxiosResponse<APIUser>
			>(url, user);

			const updatedUser = mapApiUserDataToModel(data);

			dispatch({
				type: UsersActionTypes.SetUser,
				payload: updatedUser,
			});
		} catch (err) {
			throw err;
		}
	};
};
