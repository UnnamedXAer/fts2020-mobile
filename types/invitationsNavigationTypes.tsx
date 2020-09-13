import { InvitationsStackParamList, DrawerParamList } from './navigationTypes';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';

export type InvitationsScreenNavigationProp = CompositeNavigationProp<
	StackNavigationProp<InvitationsStackParamList, 'Invitations'>,
	DrawerNavigationProp<DrawerParamList>
>;

export type InvitationDetailsScreenNavigationProp = CompositeNavigationProp<
	StackNavigationProp<InvitationsStackParamList, 'InvitationDetails'>,
	DrawerNavigationProp<DrawerParamList>
>;
