import Flat, { FlatData } from '../../models/flat';
import { ThunkAction } from 'redux-thunk';
import RootState, { StoreAction } from '../storeTypes';
import {
	FlatsActionTypes,
	TasksActionTypes,
	TaskPeriodsActionTypes
} from './actionTypes';
import axios from '../../axios/axios';
import User from '../../models/user';
import AsyncStorage from '@react-native-community/async-storage';
import Invitation from '../../models/invitation';
import { APIFlat, APIInvitation } from '../apiTypes';
import { mapAPIFlatDataToModel } from '../mapAPIToModel/mapFlat';
import { mapAPIInvitationDataToModel } from '../mapAPIToModel/mapInvitation';
import { clearFlatTasks } from './tasks';

export type AddFlatActionPayload = { flat: Flat; tmpId: string };

export type SetFlatActionPayload = {
	flat: Flat,
}

type RefreshFlatActionType =
	| StoreAction<SetFlatActionPayload, FlatsActionTypes.ClearFlat>
	| StoreAction<{ id: number }, FlatsActionTypes.ClearFlat>

export type SetFlatInvitationsActionPayload = {
	flatId: number;
	invitations: Invitation[];
};

export type SetShowInactiveFlatsActionPayload = {
	show: boolean
}

type SetShowInactiveFlatsAction = {
	type: FlatsActionTypes.SetShowInactive;
	payload: SetShowInactiveFlatsActionPayload;
};

export type RemoveFlatMemberActionPayload = {
	flatId: number;
	userId: number;
};

export const createFlat = (
	flat: FlatData,
	tmpId: string
): ThunkAction<
	Promise<void>,
	RootState,
	any,
	StoreAction<AddFlatActionPayload, string>
> => {
	return async (dispatch) => {
		const url = '/flats';
		try {
			const { data } = await axios.post<APIFlat>(url, flat);
			const createdFlat = mapAPIFlatDataToModel(data);
			dispatch({
				type: FlatsActionTypes.Add,
				payload: {
					flat: createdFlat,
					tmpId: tmpId,
				},
			});
		} catch (err) {
			throw err;
		}
	};
};

export const fetchFlats = (): ThunkAction<
	Promise<void>,
	RootState,
	any,
	StoreAction<Flat[], string>
> => {
	return async (dispatch, getState) => {
		const loggedUser = getState().auth.user;
		const url = `/flats?userId=${loggedUser!.id}`;
		try {
			const { data } = await axios.get<APIFlat[]>(url);
			const flats = data.map(mapAPIFlatDataToModel);

			dispatch({
				type: FlatsActionTypes.Set,
				payload: flats
			});
		} catch (err) {
			throw err;
		}
	};
};

export const clearFlat = (id: number): ThunkAction<
	Promise<void>,
	RootState,
	any,
	RefreshFlatActionType> => {
	return async (dispatch) => {
		dispatch({
			type: FlatsActionTypes.ClearFlat,
			payload: { id }
		});
		await dispatch(clearFlatTasks(id));
	}
}


export const fetchFlat = (id: number): ThunkAction<
	Promise<void>,
	RootState,
	any,
	StoreAction<SetFlatActionPayload, FlatsActionTypes.SetFlat>
> => {
	return async (dispatch) => {
		const url = `/flats/${id}`;
		try {
			const { data, status } = await axios.get<APIFlat>(url);
			if (status === 200) {
				const flat = mapAPIFlatDataToModel(data);

				dispatch({
					type: FlatsActionTypes.SetFlat,
					payload: {
						flat,
					}
				});
			}
			else {
				throw new Error('Unauthorized access - You do not have permissions to view this flat.')
			}

		} catch (err) {
			throw err;
		}
	};
};

export const updateFlat = (
	flat: Partial<FlatData>
): ThunkAction<
	Promise<void>,
	RootState,
	any,
	StoreAction<SetFlatActionPayload, FlatsActionTypes.SetFlat>
> => {
	return async (dispatch) => {
		const url = `/flats/${flat.id}`;
		try {
			const requestPayload: Partial<APIFlat> = {
				name: flat.name!,
				description: flat.description,
				active: flat.active,
			};
			const { data } = await axios.patch<APIFlat>(url, requestPayload);
			const updatedTask = mapAPIFlatDataToModel(data);
			dispatch({
				type: FlatsActionTypes.SetFlat,
				payload: { flat: updatedTask },
			});
		} catch (err) {
			throw err;
		}
	};
};

export const leaveFlat = (
	id: number
): ThunkAction<
	Promise<void>,
	RootState,
	any,
	StoreAction<void, FlatsActionTypes.ClearState | TasksActionTypes.ClearState | TaskPeriodsActionTypes.ClearState>
> => {
	return async (dispatch, getState) => {
		const url = `/flats/${id}/members`;
		const userId = getState().auth.user!.id;
		try {
			await axios.delete(url, {
				data: {
					userId
				}
			});

			dispatch({
				type: FlatsActionTypes.ClearState,
				payload: void 0
			});
			dispatch({
				type: TasksActionTypes.ClearState,
				payload: void 0
			});
			dispatch({
				type: TaskPeriodsActionTypes.ClearState,
				payload: void 0
			});
		} catch (err) {
			throw err;
		}
	};
};

export const fetchFlatOwner = (
	userId: number,
	flatId: number
): ThunkAction<
	Promise<void>,
	RootState,
	any,
	StoreAction<{ user: User; flatId: number }, FlatsActionTypes.SetOwner>
> => {
	return async dispatch => {
		const url = `/users/${userId}`;
		try {
			const { data } = await axios.get(url);

			const user = new User(
				data.id,
				data.emailAddress,
				data.userName,
				data.provider,
				new Date(data.joinDate),
				data.avatarUrl,
				data.active
			);

			dispatch({
				type: FlatsActionTypes.SetOwner,
				payload: {
					user,
					flatId
				}
			});
		} catch (err) {
			throw err;
		}
	};
};

export const fetchFlatMembers = (
	flatId: number
): ThunkAction<
	Promise<void>,
	RootState,
	any,
	StoreAction<{ flatId: number, members: User[] }, FlatsActionTypes.SetMembers>
> => {
	return async dispatch => {
		const url = `/flats/${flatId}/members`;
		try {
			const { data } = await axios.get(url);

			const members = data.map(
				(user: any) =>
					new User(
						user.id,
						user.emailAddress,
						user.userName,
						user.provider,
						new Date(user.joinDate),
						user.avatarUrl,
						user.active
					)
			);
			dispatch({
				type: FlatsActionTypes.SetMembers,
				payload: {
					members,
					flatId
				}
			});
		} catch (err) {
			throw err;
		}
	};
};

export const addFlatInvitations = (
	emails: User['emailAddress'][],
	flatId: number
): ThunkAction<
	Promise<void>,
	RootState,
	any,
	StoreAction<
		SetFlatInvitationsActionPayload,
		FlatsActionTypes.SetInvitations
	>
> => {
	return async (dispatch) => {
		const url = `/flats/${flatId}/members/invite`;
		try {
			const { data } = await axios.post<APIInvitation[]>(url, {
				members: emails,
			});

			const invitations = data.map(mapAPIInvitationDataToModel);

			dispatch({
				type: FlatsActionTypes.SetInvitations,
				payload: {
					invitations,
					flatId,
				},
			});
		} catch (err) {
			throw err;
		}
	};
};

export const fetchFlatInvitations = (
	flatId: number
): ThunkAction<
	Promise<void>,
	RootState,
	any,
	StoreAction<
		SetFlatInvitationsActionPayload,
		FlatsActionTypes.SetInvitations
	>
> => {
	return async (dispatch) => {
		const url = `/flats/${flatId}/invitations`;
		try {
			const { data } = await axios.get<APIInvitation[]>(url);

			const invitations = data.map(mapAPIInvitationDataToModel);
			dispatch({
				type: FlatsActionTypes.SetInvitations,
				payload: {
					invitations,
					flatId,
				},
			});
		} catch (err) {
			throw err;
		}
	};
};

export const deleteFlatMember = (
	id: number,
	userId: number
): ThunkAction<
	Promise<void>,
	RootState,
	any,
	| StoreAction<RemoveFlatMemberActionPayload, FlatsActionTypes.RemoveMember>
	| StoreAction<
		void,
		TasksActionTypes.ClearState | TaskPeriodsActionTypes.ClearState
	>
> => {
	return async (dispatch) => {
		const url = `/flats/${id}/members`;
		try {
			await axios.delete(url, {
				data: {
					userId,
				},
			});

			dispatch({
				type: FlatsActionTypes.RemoveMember,
				payload: { flatId: id, userId },
			});
		} catch (err) {
			throw err;
		}
	};
};

export const readSaveShowInactive = (
): ThunkAction<Promise<void>, RootState, any, SetShowInactiveFlatsAction> => {
	return async (dispatch, getState) => {
		const userId = getState().auth.user!.id;

		try {
			const savedShow = await AsyncStorage.getItem('flatsShowInactive_' + userId);
			const show = savedShow === '1';

			dispatch(setShowInactiveFlats(show, true));
		} catch (err) {
			throw err;
		}
	};
};

export const setShowInactiveFlats = (
	show: boolean,
	skipSaving?: boolean
): ThunkAction<Promise<void>, RootState, any, SetShowInactiveFlatsAction> => {
	return async (dispatch, getState) => {
		const userId = getState().auth.user!.id;

		try {
			dispatch({
				type: FlatsActionTypes.SetShowInactive,
				payload: { show },
			});
			if (skipSaving !== true) {
				await AsyncStorage.setItem('flatsShowInactive_' + userId, show ? '1' : '0');
			}
		} catch (err) {
			throw err;
		}
	};
};