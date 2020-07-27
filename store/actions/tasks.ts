import axios from '../../axios/axios';
import { TasksActionTypes } from './actionTypes';
import Task, { UserTask, TaskData } from '../../models/task';
import { ThunkAction } from 'redux-thunk';
import RootState, { StoreAction } from '../storeTypes';
import User from '../../models/user';
import { AsyncStorage } from 'react-native';
import { APITask, APIUserTask, APIUser } from '../apiTypes';
import {
	mapApiTaskDataToModel,
	mapApiUserTaskDataToModel
} from '../mapAPIToModel/mapTask';
import { mapApiUserDataToModel } from '../mapAPIToModel/mapUser';

type FetchFlatTasksAction = {
	type: TasksActionTypes.SetFlatTasks;
	payload: {
		tasks: Task[];
		flatId: number;
	};
};

type FetchUserTasksAction = {
	type: TasksActionTypes.SetUserTasks;
	payload: UserTask[];
};

type FetchTaskAction = {
	type: TasksActionTypes.SetTask;
	payload: Task;
};

type SetTaskMembersAction = {
	type: TasksActionTypes.SetMembers;
	payload: { members: User[]; taskId: number };
};

export type ClearFlatTasksActionPayload = { flatId: number }
type ClearFlatTasksAction = {
	type: TasksActionTypes.ClearFlatTasks;
	payload: ClearFlatTasksActionPayload;
};

export type SetShowInactiveTasksActionPayload = {
	show: boolean
}

type SetShowInactiveTasksAction = {
	type: TasksActionTypes.SetShowInactive;
	payload: SetShowInactiveTasksActionPayload;
};


export type CreateTaskActionPayload = { task: Task, tmpId: string }

export const createTask = (
	task: TaskData,
	tmpId: string
): ThunkAction<Promise<void>, RootState, any, StoreAction<CreateTaskActionPayload, string>> => {
	return async (dispatch) => {
		const url = `/flats/${task.flatId}/tasks`;
		try {
			const requestPayload: APITask = {
				title: task.name!,
				description: task.description,
				flatId: task.flatId!,
				startDate: task.startDate?.toISOString(),
				endDate: task.endDate?.toISOString(),
				timePeriodUnit: task.timePeriodUnit,
				timePeriodValue: task.timePeriodValue,
			};
			const { data } = await axios.post<APITask>(url, requestPayload);
			const createdTask = mapApiTaskDataToModel(data);
			dispatch({
				type: TasksActionTypes.Add,
				payload: { task: createdTask, tmpId }
			});
		} catch (err) {
			throw err;
		}
	};
};

export const fetchTask = (
	id: number
): ThunkAction<Promise<void>, RootState, any, FetchTaskAction> => {
	return async (dispatch) => {
		const url = `/tasks/${id}`;
		try {
			const { data } = await axios.get<APITask>(url);
			const task = mapApiTaskDataToModel(data);
			dispatch({
				type: TasksActionTypes.SetTask,
				payload: task,
			});
		} catch (err) {
			throw err;
		}
	};
};

export const fetchFlatTasks = (
	id: number
): ThunkAction<Promise<void>, RootState, any, FetchFlatTasksAction> => {
	return async (dispatch) => {
		const url = `/flats/${id}/tasks`;
		try {
			const { data } = await axios.get<APITask[]>(url);
			const tasks = data.map(mapApiTaskDataToModel);

			dispatch({
				type: TasksActionTypes.SetFlatTasks,
				payload: {
					flatId: id,
					tasks,
				},
			});
		} catch (err) {
			throw err;
		}
	};
};

export const clearFlatTasks = (
	id: number
): ThunkAction<Promise<void>, RootState, any, ClearFlatTasksAction> => {
	return async (dispatch) => {
		dispatch({
			type: TasksActionTypes.ClearFlatTasks,
			payload: {
				flatId: id,
			},
		});
	};
};

export const fetchUserTasks = (): ThunkAction<
	Promise<void>,
	RootState,
	any,
	FetchUserTasksAction
> => {
	return async (dispatch) => {
		const url = `/tasks`;
		try {
			const { data } = await axios.get<APIUserTask[]>(url);
			const tasks = data.map(mapApiUserTaskDataToModel);

			dispatch({
				type: TasksActionTypes.SetUserTasks,
				payload: tasks,
			});
		} catch (err) {
			throw err;
		}
	};
};

export const fetchTaskMembers = (
	taskId: number
): ThunkAction<Promise<void>, RootState, any, SetTaskMembersAction> => {
	return async (dispatch) => {
		const url = `/tasks/${taskId}/members`;
		try {
			const { data } = await axios.get<APIUser[]>(url);
			const members = data.map(mapApiUserDataToModel);
			dispatch({
				type: TasksActionTypes.SetMembers,
				payload: {
					members,
					taskId,
				},
			});
		} catch (err) {
			throw err;
		}
	};
};

export const fetchTaskOwner = (
	userId: number,
	taskId: number
): ThunkAction<
	Promise<void>,
	RootState,
	any,
	StoreAction<{ user: User; taskId: number }, TasksActionTypes.SetOwner>
> => {
	return async (dispatch) => {
		const url = `/users/${userId}`;
		try {
			const { data } = await axios.get<APIUser>(url);

			const user = mapApiUserDataToModel(data);

			dispatch({
				type: TasksActionTypes.SetOwner,
				payload: {
					user,
					taskId,
				},
			});
		} catch (err) {
			throw err;
		}
	};
};

export const updateTask = (
	task: Partial<Task>
): ThunkAction<
	Promise<void>,
	RootState,
	any,
	StoreAction<
		Task,
		TasksActionTypes.SetTask | TasksActionTypes.SetUserTask
	>
> => {
	return async (dispatch) => {
		const url = `/tasks/${task.id}`;
		try {
			const requestPayload: Partial<APITask> = {
				title: task.name!,
				description: task.description,
				timePeriodUnit: task.timePeriodUnit,
				timePeriodValue: task.timePeriodValue,
				active: task.active,
			};
			const { data } = await axios.patch<APITask>(url, requestPayload);
			const updatedTask = mapApiTaskDataToModel(data);
			dispatch({
				type: TasksActionTypes.SetTask,
				payload: updatedTask,
			});
			dispatch({
				type: TasksActionTypes.SetUserTask,
				payload: updatedTask,
			});
		} catch (err) {
			throw err;
		}
	};
};

export const updatedTaskMembers = (
	taskId: number,
	members: number[]
): ThunkAction<Promise<void>, RootState, any, SetTaskMembersAction> => {
	return async (dispatch) => {
		const url = `/tasks/${taskId}/members`;
		try {
			const { data } = await axios.put<APIUser[]>(url, { members });
			const taskMembers = data.map(mapApiUserDataToModel);
			dispatch({
				type: TasksActionTypes.SetMembers,
				payload: { taskId, members: taskMembers },
			});
		} catch (err) {
			throw err;
		}
	};
};

export const readSaveShowInactive = (
): ThunkAction<Promise<void>, RootState, any, SetShowInactiveTasksAction> => {
	return async (dispatch, getState) => {
		const userId = getState().auth.user!.id;

		try {
			const savedShow = await AsyncStorage.getItem('tasksShowInactive_' + userId);
			const show = savedShow === '1';

			dispatch(setShowInactiveTasks(show, true));
		} catch (err) {
			throw err;
		}
	};
};

export const setShowInactiveTasks = (
	show: boolean,
	skipSaving?: boolean
): ThunkAction<Promise<void>, RootState, any, SetShowInactiveTasksAction> => {
	return async (dispatch, getState) => {
		const userId = getState().auth.user!.id;

		try {
			dispatch({
				type: TasksActionTypes.SetShowInactive,
				payload: { show },
			});
			if (skipSaving !== true) {
				await AsyncStorage.setItem('tasksShowInactive_' + userId, show ? '1' : '0');
			}
		} catch (err) {
			throw err;
		}
	};
};
