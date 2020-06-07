import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, List, IconButton } from 'react-native-paper';
import { Theme } from 'react-native-paper/lib/typescript/src/types';
import User from '../../models/user';

export enum MembersStatus {
	'loading',
	'not_found',
	'accepted',
	'ok',
	'error',
	'invalid',
	'already_member',
}

interface Props {
	emails: User['emailAddress'][];
	loggedUser: User;
	members: Partial<User>[];
	membersStatus: {
		[key: string]: MembersStatus;
	};
	formLoading: boolean;
	onRemove: (email: string) => void;
	theme: Theme;
}

const InviteMembersEmailList: React.FC<Props> = ({
	emails,
	formLoading,
	loggedUser,
	members,
	membersStatus,
	onRemove,
	theme,
}) => {
	const colors = theme.colors;

	const items = emails.map((email) => {
		const member = members.find((x) => x.emailAddress === email);

		return (
			<List.Item
				key={email}
				title={email}
				description={member?.userName}
				left={() => <List.Icon color="#000" icon="folder" />}
				right={() => <IconButton color={colors.placeholder} icon="close" />}
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
