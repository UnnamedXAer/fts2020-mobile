import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './navigationTypes';

export type FlatDetailsScreenRouteProps = RouteProp<
	RootStackParamList,
	'FlatDetails'
>;

export type NewFlatInfoScreenRouteProps = RouteProp<
	RootStackParamList,
	'NewFlatInfo'
>;

export type NewFlatScreenRouteProps = RouteProp<RootStackParamList, 'NewFlat'>;

export type InviteMembersScreenRouteProps = RouteProp<
	RootStackParamList,
	'InviteMembers'
>;

export type TaskDetailsScreenRouteProps = RouteProp<
	RootStackParamList,
	'TaskDetails'
>;

export type NewTaskNameScreenRouteProps = RouteProp<
	RootStackParamList,
	'NewTaskName'
>;

export type NewTaskTimeScreenRouteProps = RouteProp<
	RootStackParamList,
	'NewTaskTime'
>;

export type NewTaskMembersScreenRouteProps = RouteProp<
	RootStackParamList,
	'UpdateTaskMembers'
>;
