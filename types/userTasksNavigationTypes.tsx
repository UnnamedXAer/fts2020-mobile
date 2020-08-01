import { CompositeNavigationProp } from '@react-navigation/native';
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import {
	BottomTabParamList,
	DrawerParamList,
	RootStackParamList,
} from './navigationTypes';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { StackNavigationProp } from '@react-navigation/stack';

export type UserTasksScreenNavigationProp = CompositeNavigationProp<
	MaterialBottomTabNavigationProp<BottomTabParamList, 'CurrentPeriods'>,
	CompositeNavigationProp<
		StackNavigationProp<RootStackParamList, 'BottomTab'>,
		DrawerNavigationProp<DrawerParamList, 'RootStack'>
	>
>;
