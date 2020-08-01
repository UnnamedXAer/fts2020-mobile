import { RootStackParams, ProfileStackParams } from './navigationParamsTypes';

export type NestedNavigatorParams<ParamList> = {
	[K in keyof ParamList]: undefined extends ParamList[K]
		? { screen: K; params?: ParamList[K] }
		: { screen: K; params: ParamList[K] };
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
	};
	NewTaskTime: {
		flatId: number;
		name: string;
		description: string;
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

export type BottomTabParamList = {
	UserTasks: undefined;
	Flats: undefined;
	CurrentPeriods: undefined;
};

export type DrawerParamList = {
	RootStack: RootStackParams;
	ProfileStack: ProfileStackParams;
	About: undefined;
	SignOut: undefined;
};
