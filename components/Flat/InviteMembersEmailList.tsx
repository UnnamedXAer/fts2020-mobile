import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, List } from 'react-native-paper';
import { Theme } from 'react-native-paper/lib/typescript/src/types';
import User from '../../models/user';
import InvitationMembersEmailListItem, {
	MembersStatus,
} from './InvitationMembersEmailListItem';

interface Props {
	emails: User['emailAddress'][];
	loggedUser: User;
	members: Partial<User>[];
	membersStatus: {
		[key: string]: MembersStatus;
	};
	formLoading: boolean;
	onEmailRemove: (email: string) => void;
	theme: Theme;
}

const InviteMembersEmailList: React.FC<Props> = ({
	emails,
	formLoading,
	loggedUser,
	members,
	membersStatus,
	onEmailRemove,
	theme,
}) => {
	const colors = theme.colors;

	const items = emails.map((email) => {
		const member = members.find((x) => x.emailAddress === email);
		const isLoggedUser = loggedUser.id === member?.id;

		return (
			<InvitationMembersEmailListItem
				key={email}
				colors={colors}
				email={email}
				member={member}
				isLoggedUser={isLoggedUser}
				memberStatus={membersStatus[email]}
				formLoading={formLoading}
				onRemove={onEmailRemove}
			/>
		);
	});

	const validEmailsCount = Object.values(membersStatus).filter(
		(x) =>
			x === MembersStatus.ok ||
			x === MembersStatus.error ||
			x === MembersStatus.not_found
	).length;

	return (
		<>
			<List.Section>
				<List.Subheader>Added emails</List.Subheader>
				{items}
			</List.Section>
			<Text style={styles.summary}>
				{validEmailsCount === 0
					? 'Add email addresses to invite people to your flat.'
					: validEmailsCount === 1
					? 'One invitation will be sent.'
					: `${validEmailsCount} invitations will be sent.`}
			</Text>
		</>
	);
};

export default InviteMembersEmailList;

const styles = StyleSheet.create({
	summary: {
		fontStyle: 'italic',
		fontSize: 12,
		textAlign: 'right',
		color: '#64b5f6',
	},
});
