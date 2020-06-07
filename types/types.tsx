import User from '../models/user';

export type NewFlatMember = {
	emailAddress: User['emailAddress'];
	userName: User['userName'];
};
