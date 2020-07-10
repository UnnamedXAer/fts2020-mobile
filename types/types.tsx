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
