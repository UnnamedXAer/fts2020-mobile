import { CompositeNavigationProp } from '@react-navigation/native';
import { MaterialBottomTabNavigationProp } from '@react-navigation/material-bottom-tabs';
import {
	BottomTabParamList,
	RootStackParamList,
	DrawerParamList,
} from './navigationTypes';
import { StackNavigationProp } from '@react-navigation/stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';

export type CurrentPeriodsScreenNavigationProp = CompositeNavigationProp<
	MaterialBottomTabNavigationProp<BottomTabParamList, 'CurrentPeriods'>,
	CompositeNavigationProp<
		StackNavigationProp<RootStackParamList, 'BottomTab'>,
		DrawerNavigationProp<DrawerParamList, 'RootStack'>
	>
>;
