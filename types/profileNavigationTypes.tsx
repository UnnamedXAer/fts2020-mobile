import {
	ProfileStackParamList,
	DrawerParamList,
} from './navigationTypes';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';


export type ProfileScreenNavigationProp = CompositeNavigationProp<
	StackNavigationProp<ProfileStackParamList, 'Profile'>,
	DrawerNavigationProp<DrawerParamList>
>;
export type ChangePasswordScreenNavigationProp = CompositeNavigationProp<
	StackNavigationProp<ProfileStackParamList, 'ChangePassword'>,
	DrawerNavigationProp<DrawerParamList>
>;
