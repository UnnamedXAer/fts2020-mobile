import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
	Flats: undefined;
	UserTasks: undefined;
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
	NewTaskMembers: {
		id: number;
		newTask: boolean;
	};
	Profile: {
		id: number;
	};
	ChangePassword: undefined;
};

export type FlatDetailsScreenRouteProps = RouteProp<RootStackParamList, 'FlatDetails'>;
export type FlatDetailsScreenNavigationProps = StackNavigationProp<
	RootStackParamList,
	'FlatDetails'
>;

export type NewFlatInfoScreenRouteProps = RouteProp<RootStackParamList, 'NewFlatInfo'>;
export type NewFlatInfoScreenNavigationProps = StackNavigationProp<
	RootStackParamList,
	'NewFlatInfo'
>;

export type NewFlatScreenRouteProps = RouteProp<RootStackParamList, 'NewFlat'>;
export type NewFlatScreenNavigationProps = StackNavigationProp<
	RootStackParamList,
	'NewFlat'
>;

export type InviteMembersScreenRouteProps = RouteProp<
	RootStackParamList,
	'InviteMembers'
>;
export type InviteMembersScreenNavigationProps = StackNavigationProp<
	RootStackParamList,
	'InviteMembers'
>;

export type TaskDetailsScreenRouteProps = RouteProp<RootStackParamList, 'TaskDetails'>;
export type TaskDetailsScreenNavigationProps = StackNavigationProp<
	RootStackParamList,
	'TaskDetails'
>;

export type NewTaskNameScreenRouteProps = RouteProp<RootStackParamList, 'NewTaskName'>;
export type NewTaskNameScreenNavigationProps = StackNavigationProp<
	RootStackParamList,
	'NewTaskName'
>;

export type NewTaskTimeScreenRouteProps = RouteProp<RootStackParamList, 'NewTaskTime'>;
export type NewTaskTimeScreenNavigationProps = StackNavigationProp<
	RootStackParamList,
	'NewTaskTime'
>;

export type NewTaskMembersScreenRouteProps = RouteProp<
	RootStackParamList,
	'NewTaskMembers'
>;
export type NewTaskMembersScreenNavigationProps = StackNavigationProp<
	RootStackParamList,
	'NewTaskMembers'
>;

export type ProfileScreenRouteProps = RouteProp<RootStackParamList, 'Profile'>;
export type ProfileScreenNavigationProps = StackNavigationProp<
	RootStackParamList,
	'Profile'
>;

export type ChangePasswordScreenRouteProps = RouteProp<RootStackParamList, 'ChangePassword'>;
export type ChangePasswordScreenNavigationProps = StackNavigationProp<
	RootStackParamList,
	'ChangePassword'
>;