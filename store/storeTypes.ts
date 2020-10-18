import User from '../models/user';
import { Action } from 'redux';
import Flat from '../models/flat';
import Task, { UserTask } from '../models/task';
import { Period, CurrentPeriod } from '../models/period';
import { InvitationPresentation } from '../models/invitation';
import { RedirectTo } from '../types/types';

export type RootState = {
	auth: AuthState;
	app: AppState;
	flats: FlatsState;
	invitations: InvitationsState;
	tasks: TasksState;
	users: UsersState;
	periods: PeriodsState;
	navigation: NavigationState;
};

export type AuthState = {
	user: User | null;
	expirationTime: number | null;
};

export type AppState = {
	loading: boolean;
};

export type UsersState = {
	users: User[];
};

export type FlatsState = {
	flats: Flat[];
	flatsLoadTime: number;
	createdFlatsTmpIds: { [key: string]: number | undefined };
	showInactive: boolean;
};

export type InvitationsState = {
	userInvitations: InvitationPresentation[] | null;
	userInvitationsLoadTime: number;
};

export type TasksState = {
	tasks: Task[];
	tasksLoadTimes: { [key: number]: number };
	userTasks: UserTask[];
	userTasksLoadTime: number;
	createdTasksTmpIds: { [key: string]: number };
	showInactive: boolean;
};

export type PeriodsState = {
	taskPeriods: {
		[taskId: number]: Period[];
	};
	currentPeriods: CurrentPeriod[] | null;
};

export type NavigationState = {
	redirectTo: RedirectTo | null;
}

export type AppReducer<TState, AType = string, APayload = any> = (
	state: TState,
	action: StoreAction<APayload, AType>
) => TState;

export type SimpleReducer<S, P> = (state: S, action: StoreAction<P>) => S;

type StoreActionPayload<T> = {
	payload: T;
};

export type StoreAction<P = any, A = string> = StoreActionPayload<P> & Action<A>;

export default RootState;
