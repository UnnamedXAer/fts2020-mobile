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
};

export type FlatDetailsScreenRouteProps = RouteProp<RootStackParamList, 'FlatDetails'>;
export type FlatDetailsScreenNavigationProp = StackNavigationProp<
	RootStackParamList,
	'FlatDetails'
>;

export type TaskDetailsScreenRouteProps = RouteProp<RootStackParamList, 'TaskDetails'>;
export type TaskDetailsScreenNavigationProp = StackNavigationProp<
	RootStackParamList,
	'TaskDetails'
>;
