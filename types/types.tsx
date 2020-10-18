import User from '../models/user';

export type NewFlatMember = {
	emailAddress: User['emailAddress'];
	userName: User['userName'];
};

export type FABAction = {
	icon: string;
	onPress: () => void;
	label: string;
};

export type ProviderDisplayName = 'GitHub' | 'Google';
export type AuthProvider = null | ProviderDisplayName | 'Local';

export type RedirectTo = {
	screen: string;
	params?: RedirectTo | { [key: string]: any };
};