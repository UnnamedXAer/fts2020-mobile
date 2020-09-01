import {
	NestedNavigatorParams,
	RootStackParamList,
	ProfileStackParamList,
	InvitationsStackParamList,
} from './navigationTypes';

export type RootStackParams = NestedNavigatorParams<RootStackParamList>;
export type ProfileStackParams = NestedNavigatorParams<ProfileStackParamList>;
export type InvitationsStackParams = NestedNavigatorParams<InvitationsStackParamList>;
