import {
	RootStackParams,
	ProfileStackParams,
	InvitationsStackParams,
} from './navigationParamsTypes';
import { TaskPeriodUnit } from '../constants/task';

export type NestedNavigatorParams<ParamList> = {
	[K in keyof ParamList]: undefined extends ParamList[K]
		? { screen: K; params?: ParamList[K] }
		: { screen: K; params?: ParamList[K] };
}[keyof ParamList];

export type RootStackParamList = {
	BottomTab: BottomTabParamList;
	FlatDetails: {
		id: number;
	};
	TaskDetails: {
		id: number;
	};
	NewFlatInfo: undefined;
	NewFlat: undefined;
	InviteMembers: { flatId: number; isNewFlat: boolean };
	NewTaskName: {
		flatId: number;
		name?: string;
		description?: string;
		periodUnit?: TaskPeriodUnit;
		periodValue?: string;
		startDate?: Date;
		endDate?: Date;
	};
	NewTaskTime: {
		flatId: number;
		name: string;
		description: string;
		periodUnit?: TaskPeriodUnit;
		periodValue?: string;
		startDate?: Date;
		endDate?: Date;
	};
	UpdateTaskMembers: {
		id: number;
		newTask: boolean;
	};
};

export type ProfileStackParamList = {
	Profile: {
		id: number;
	};
	ChangePassword: undefined;
};

export type InvitationsStackParamList = {
	Invitations: undefined;
	InvitationDetails: {
		token: string;
		openedByLink: boolean;
	};
};

export type BottomTabParamList = {
	UserTasks: undefined;
	Flats: undefined;
	CurrentPeriods: undefined;
};

export type DrawerParamList = {
	RootStack: RootStackParams;
	InvitationsStack: InvitationsStackParams;
	ProfileStack: ProfileStackParams;
	About: undefined;
	SignOut: undefined;
};
