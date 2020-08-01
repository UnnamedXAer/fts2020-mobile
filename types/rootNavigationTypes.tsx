import { RootStackParamList, DrawerParamList } from './navigationTypes';
import { StackNavigationProp } from '@react-navigation/stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { CompositeNavigationProp } from '@react-navigation/native';

export type FlatDetailsScreenNavigationProp = CompositeNavigationProp<
	StackNavigationProp<RootStackParamList, 'FlatDetails'>,
	DrawerNavigationProp<DrawerParamList>
>;

export type InviteMembersScreenNavigationProp = CompositeNavigationProp<
	StackNavigationProp<RootStackParamList, 'InviteMembers'>,
	DrawerNavigationProp<DrawerParamList>
>;
export type NewFlatScreenNavigationProp = CompositeNavigationProp<
	StackNavigationProp<RootStackParamList, 'NewFlat'>,
	DrawerNavigationProp<DrawerParamList>
>;
export type NewFlatInfoScreenNavigationProp = CompositeNavigationProp<
	StackNavigationProp<RootStackParamList, 'NewFlatInfo'>,
	DrawerNavigationProp<DrawerParamList>
>;

export type TaskDetailsScreenNavigationProp = CompositeNavigationProp<
	StackNavigationProp<RootStackParamList, 'TaskDetails'>,
	DrawerNavigationProp<DrawerParamList>
>;

export type NewTaskNameScreenNavigationProp = CompositeNavigationProp<
	StackNavigationProp<RootStackParamList, 'NewTaskName'>,
	DrawerNavigationProp<DrawerParamList>
>;
export type NewTaskTimeScreenNavigationProp = CompositeNavigationProp<
	StackNavigationProp<RootStackParamList, 'NewTaskTime'>,
	DrawerNavigationProp<DrawerParamList>
>;
export type UpdateTaskMembersScreenNavigationProp = CompositeNavigationProp<
	StackNavigationProp<RootStackParamList, 'UpdateTaskMembers'>,
	DrawerNavigationProp<DrawerParamList>
>;
