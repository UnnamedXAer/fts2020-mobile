import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

export type RootStackParamList = {
	Flats: undefined;
	FlatDetails: {
		id: number;
	};
	TaskDetails: {
		id: number;
	};
	NewFlatInfo: undefined;
	NewFlat: undefined;
	InviteMembers: { flatId: number };
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
