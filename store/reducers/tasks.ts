import { AppReducer, TasksState, SimpleReducer } from '../storeTypes';
import { TasksActionTypes } from '../actions/actionTypes';
import Task, { UserTask } from '../../models/task';
import User from '../../models/user';
import {
	CreateTaskActionPayload,
	SetShowInactiveTasksActionPayload,
	ClearFlatTasksActionPayload
} from '../actions/tasks';

const initialState: TasksState = {
	tasks: [],
	tasksLoadTimes: {},
	userTasks: [],
	userTasksLoadTime: 0,
	createdTasksTmpIds: {},
	showInactive: false
};

const setUserTasks: SimpleReducer<TasksState, Task[]> = (state, action) => {
	return {
		...state,
		userTasks: action.payload,
		userTasksLoadTime: Date.now(),
	};
};

const setUserTask: SimpleReducer<TasksState, Task> = (state, action) => {
	const updatedUserTasks = [...state.userTasks];

	const idx = updatedUserTasks.findIndex((x) => x.id === action.payload.id);

	if (idx !== -1) {
		const updatedTask = new UserTask({
			id: updatedUserTasks[idx].id,
			flatName: updatedUserTasks[idx].flatName,
			name: action.payload.name,
			flatId: updatedUserTasks[idx].flatId,
			timePeriodUnit: updatedUserTasks[idx].timePeriodUnit,
			timePeriodValue: updatedUserTasks[idx].timePeriodValue,
			active: action.payload.active,
		});
		updatedUserTasks[idx] = updatedTask;
	}

	return {
		...state,
		userTasks: updatedUserTasks,
	};
};

const setTask: SimpleReducer<TasksState, Task> = (state, action) => {
	const task = action.payload;
	const updatedTasks = [...state.tasks];
	const taskIdx = updatedTasks.findIndex((x) => x.id === task.id);

	if (taskIdx === -1) {
		updatedTasks.push(task);
	} else {
		const updatedTask = new Task({ ...task });

		if (!task.owner && updatedTasks[taskIdx].owner) {
			updatedTask.owner = updatedTasks[taskIdx].owner;
		}
		if (!task.members && updatedTasks[taskIdx].members) {
			updatedTask.members = updatedTasks[taskIdx].members;
		}
		updatedTasks[taskIdx] = updatedTask;
	}

	return {
		...state,
		tasks: updatedTasks,
	};
};

const setFlatTasks: SimpleReducer<
	TasksState,
	{ flatId: number; tasks: Task[] }
> = (state, action) => {

	const { flatId, tasks } = action.payload;
	const updatedTasks = state.tasks
		.filter((x) => x.flatId !== flatId)
		.concat(tasks);

	const currentTime = Date.now();
	return {
		...state,
		tasks: updatedTasks,
		tasksLoadTimes: { ...state.tasksLoadTimes, [flatId]: currentTime }
	};
};

const clearFlatTasks: SimpleReducer<
	TasksState,
	ClearFlatTasksActionPayload
> = (state, action) => {

	const { flatId } = action.payload;
	const updatedTasks = state.tasks
		.filter((x) => x.flatId !== flatId);

	const updatedLoadTimes = { ...state.tasksLoadTimes };
	delete updatedLoadTimes[flatId];

	return {
		...state,
		tasks: updatedTasks,
		tasksLoadTimes: updatedLoadTimes
	};
};

const addTask: SimpleReducer<TasksState, CreateTaskActionPayload> = (state, action) => {
	const { tmpId, task } = action.payload;
	const updatedTasks = state.tasks.concat(task);

	return {
		...state,
		tasks: updatedTasks,
		createdTasksTmpIds: { ...state.createdTasksTmpIds, [tmpId]: task.id! }
	};
};

const setMembers: SimpleReducer<
	TasksState,
	{ taskId: number; members: User[] }
> = (state, action) => {
	const { taskId, members } = action.payload;
	const updatedTasks = [...state.tasks];

	const editedTaskIndex = updatedTasks.findIndex((x) => x.id === taskId);

	const updatedTask = new Task({
		...updatedTasks[editedTaskIndex],
		members: members,
	});

	updatedTasks[editedTaskIndex] = updatedTask;

	return {
		...state,
		tasks: updatedTasks,
	};
};

const setOwner: SimpleReducer<
	TasksState,
	{ taskId: number; user: User }
> = (state, action) => {
	const { taskId, user } = action.payload;
	const updatedTasks = [...state.tasks];

	const editedTaskIndex = updatedTasks.findIndex((x) => x.id === taskId);

	const updatedTask = new Task({
		...updatedTasks[editedTaskIndex],
		owner: user,
	});

	updatedTasks[editedTaskIndex] = updatedTask;

	return {
		...state,
		tasks: updatedTasks,
	};
};

const setShowInactive: SimpleReducer<
	TasksState, SetShowInactiveTasksActionPayload
> = (state, action) => {
	return {
		...state,
		showInactive: action.payload.show
	};
};

const clearState: SimpleReducer<TasksState, undefined> = (state, action) => {
	return {
		...initialState,
	};
};

const reducer: AppReducer<TasksState, TasksActionTypes> = (
	state = initialState,
	action
) => {
	switch (action.type) {
		case TasksActionTypes.SetTask:
			return setTask(state, action);
		case TasksActionTypes.SetFlatTasks:
			return setFlatTasks(state, action);
		case TasksActionTypes.SetUserTasks:
			return setUserTasks(state, action);
		case TasksActionTypes.SetUserTask:
			return setUserTask(state, action);
		case TasksActionTypes.Add:
			return addTask(state, action);
		case TasksActionTypes.SetMembers:
			return setMembers(state, action);
		case TasksActionTypes.SetOwner:
			return setOwner(state, action);
		case TasksActionTypes.SetShowInactive:
			return setShowInactive(state, action);
		case TasksActionTypes.ClearFlatTasks:
			return clearFlatTasks(state, action);
		case TasksActionTypes.ClearState:
			return clearState(state, action);
		default:
			return state;
	}
};

export default reducer;
