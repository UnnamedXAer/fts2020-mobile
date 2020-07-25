export const AUTHORIZE = 'AUTHORIZE';
export const LOGOUT = 'LOGOUT';

export enum AuthActionTypes {
	SetLoggedUser = 'AUTH_SET_LOGGEDUSER',
	UpdatePassword = 'USER_UPDATE_PASSWORD',
}

export enum FlatsActionTypes {
	Add = 'FLATS_ADD_FLAT',
	Set = 'FLATS_SET_FLATS',
	SetFlat = 'FLATS_SET_FLAT',
	SetOwner = 'FLATS_SET_FLAT_OWNER',
	SetMembers = 'FLATS_SET_FLAT_MEMBERS',
	SetInvitations = 'FLATS_SET_FLAT_INVITATIONS',
	SetShowInactive = 'FLATS_SET_SHOW_INACTIVE',
	ClearState = 'FLATS_CLEAR_STATE',
}

export enum InvitationsActionTypes {
	SetUserInvitations = 'INVITATIONS_SET_USER_INVITATIONS',
	SetUserInvitation = 'INVITATIONS_SET_USER_INVITATION',
	ClearState = 'INVITATIONS_CLEAR_STATE',
}

export enum TasksActionTypes {
	Add = 'TASK_ADD',
	SetTask = 'TASKS_SET_TASK',
	SetOwner = 'TASK_SET_OWNER',
	SetFlatTasks = 'TASK_SET_FLAT_TASKS',
	SetUserTasks = 'TASK_SET_USER_TASKS',
	SetUserTask = 'TASKS_SET_USER_TASK',
	SetMembers = 'FLAT_TASK_SET_MEMBERS',
	SetShowInactive = 'TASKS_SET_SHOW_INACTIVE',
	ClearState = 'TASK_CLEAR_STATE',
}

export enum TaskPeriodsActionTypes {
	SetTaskPeriods = 'PERIODS_SET_TASK_PERIODS',
	CompletePeriod = 'PERIODS_COMPLETE_PERIOD',
	ClearTaskPeriods = 'PERIODS_CLEAR_TASK_PERIODS',
	ClearState = 'PERIODS_CLEAR_STATE',
}

export enum UsersActionTypes {
	SetUser = 'USER_SET',
	UpdateUser = 'USER_UPDATE',
}
