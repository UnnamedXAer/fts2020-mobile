import { RouteProp, CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import { DrawerNavigationProp } from '@react-navigation/drawer';

type NestedNavigatorParams<ParamList> = {
	[K in keyof ParamList]: undefined extends ParamList[K]
		? { screen: K; params?: ParamList[K] }
		: { screen: K; params: ParamList[K] };
}[keyof ParamList];

export type ProfileStackParamList = {
	Profile: {
		id: number;
	};
	ChangePassword: undefined;
};

export type TasksStackParamList = {
	UserTasks: undefined;
	TaskDetails: {
		id: number;
	};
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

export type FlatsStackParamList = {
	Flats: undefined;
	FlatDetails: {
		id: number;
	};
	NewFlatInfo: undefined;
	NewFlat: undefined;
	InviteMembers: {
		flatId: number;
		isNewFlat: boolean;
	};
};

export type CurrentPeriodsStackParamList = {
	CurrentPeriods: undefined;
};

type TasksStackParams = NestedNavigatorParams<TasksStackParamList>;
type FlatsStackParams = NestedNavigatorParams<FlatsStackParamList>;
type ProfileStackParams = NestedNavigatorParams<ProfileStackParamList>;
type CurrentPeriodsStackParams = NestedNavigatorParams<
	CurrentPeriodsStackParamList
>;

export type BottomTabParamList = {
	TasksStack: TasksStackParams;
	FlatsStack: FlatsStackParams;
	CurrentPeriodsStack: CurrentPeriodsStackParams;
};

export type DrawerParamList = {
	FlatsAndTasksBottomTab: MaterialBottomTabNavigationProp<BottomTabParamList>;
	ProfileStack: ProfileStackParams;
	About: undefined;
	SignOut: undefined;
};

export type FlatDetailsScreenNavigationProp = CompositeNavigationProp<
	StackNavigationProp<FlatsStackParamList, 'FlatDetails'>,
	CompositeNavigationProp<
		MaterialBottomTabNavigationProp<BottomTabParamList>,
		DrawerNavigationProp<DrawerParamList>
	>
>;
export type FlatsScreenNavigationProp = CompositeNavigationProp<
	StackNavigationProp<FlatsStackParamList, 'Flats'>,
	CompositeNavigationProp<
		MaterialBottomTabNavigationProp<BottomTabParamList>,
		DrawerNavigationProp<DrawerParamList>
	>
>;
export type InviteMembersScreenNavigationProp = CompositeNavigationProp<
	StackNavigationProp<FlatsStackParamList, 'InviteMembers'>,
	CompositeNavigationProp<
		MaterialBottomTabNavigationProp<BottomTabParamList>,
		DrawerNavigationProp<DrawerParamList>
	>
>;
export type NewFlatScreenNavigationProp = CompositeNavigationProp<
	StackNavigationProp<FlatsStackParamList, 'NewFlat'>,
	CompositeNavigationProp<
		MaterialBottomTabNavigationProp<BottomTabParamList>,
		DrawerNavigationProp<DrawerParamList>
	>
>;
export type NewFlatInfoScreenNavigationProp = CompositeNavigationProp<
	StackNavigationProp<FlatsStackParamList, 'NewFlatInfo'>,
	CompositeNavigationProp<
		MaterialBottomTabNavigationProp<BottomTabParamList>,
		DrawerNavigationProp<DrawerParamList>
	>
>;

export type TaskDetailsScreenNavigationProp = CompositeNavigationProp<
	StackNavigationProp<TasksStackParamList, 'TaskDetails'>,
	CompositeNavigationProp<
		MaterialBottomTabNavigationProp<BottomTabParamList>,
		DrawerNavigationProp<DrawerParamList>
	>
>;
export type UserTasksScreenNavigationProp = CompositeNavigationProp<
	StackNavigationProp<TasksStackParamList, 'UserTasks'>,
	CompositeNavigationProp<
		MaterialBottomTabNavigationProp<BottomTabParamList>,
		DrawerNavigationProp<DrawerParamList>
	>
>;
export type NewTaskNameScreenNavigationProp = CompositeNavigationProp<
	StackNavigationProp<TasksStackParamList, 'NewTaskName'>,
	CompositeNavigationProp<
		MaterialBottomTabNavigationProp<BottomTabParamList>,
		DrawerNavigationProp<DrawerParamList>
	>
>;
export type NewTaskTimeScreenNavigationProp = CompositeNavigationProp<
	StackNavigationProp<TasksStackParamList, 'NewTaskTime'>,
	CompositeNavigationProp<
		MaterialBottomTabNavigationProp<BottomTabParamList>,
		DrawerNavigationProp<DrawerParamList>
	>
>;
export type UpdateTaskMembersScreenNavigationProp = CompositeNavigationProp<
	StackNavigationProp<TasksStackParamList, 'UpdateTaskMembers'>,
	CompositeNavigationProp<
		MaterialBottomTabNavigationProp<BottomTabParamList>,
		DrawerNavigationProp<DrawerParamList>
	>
>;

/* */
export type ProfileScreenNavigationProp = CompositeNavigationProp<
	StackNavigationProp<ProfileStackParamList, 'Profile'>,
	CompositeNavigationProp<
		MaterialBottomTabNavigationProp<BottomTabParamList>,
		DrawerNavigationProp<DrawerParamList>
	>
>;
export type ChangePasswordScreenNavigationProp = CompositeNavigationProp<
	StackNavigationProp<ProfileStackParamList, 'ChangePassword'>,
	CompositeNavigationProp<
		MaterialBottomTabNavigationProp<BottomTabParamList>,
		DrawerNavigationProp<DrawerParamList>
	>
>;
/* */

export type CurrentPeriodsScreenNavigationProp = CompositeNavigationProp<
	StackNavigationProp<CurrentPeriodsStackParamList, 'CurrentPeriods'>,
	CompositeNavigationProp<
		MaterialBottomTabNavigationProp<BottomTabParamList>,
		DrawerNavigationProp<DrawerParamList>
	>
>;

/* ------ ----- ----- ------*/
/* ------ Route Props ------*/
/* ------ ----- ----- ------*/

export type FlatDetailsScreenRouteProps = RouteProp<
	FlatsStackParamList,
	'FlatDetails'
>;

export type NewFlatInfoScreenRouteProps = RouteProp<
	FlatsStackParamList,
	'NewFlatInfo'
>;

export type NewFlatScreenRouteProps = RouteProp<FlatsStackParamList, 'NewFlat'>;

export type InviteMembersScreenRouteProps = RouteProp<
	FlatsStackParamList,
	'InviteMembers'
>;

export type TaskDetailsScreenRouteProps = RouteProp<
	TasksStackParamList,
	'TaskDetails'
>;

export type NewTaskNameScreenRouteProps = RouteProp<
	TasksStackParamList,
	'NewTaskName'
>;

export type NewTaskTimeScreenRouteProps = RouteProp<
	TasksStackParamList,
	'NewTaskTime'
>;

export type NewTaskMembersScreenRouteProps = RouteProp<
	TasksStackParamList,
	'UpdateTaskMembers'
>;

export type ProfileScreenRouteProps = RouteProp<
	ProfileStackParamList,
	'Profile'
>;

export type ChangePasswordScreenRouteProps = RouteProp<
	ProfileStackParamList,
	'ChangePassword'
>;
