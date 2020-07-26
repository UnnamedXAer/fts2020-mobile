import React from 'react';
import { Title, Theme } from 'react-native-paper';
import { Placeholder } from 'rn-placeholder';
import { Linking } from 'expo';
import { PlaceholderLine, Shine } from '../UI/Placeholder/Placeholder';
import User from '../../models/user';
import MembersListItem, { MemberAction } from './MembersListItem';

interface Props {
	members: User[] | undefined;
	onSelect: (id: User['id']) => void;
	theme: Theme;
	onMemberDelete?: (id: User['id']) => void;
	ownerId?: number;
	loggedUserId: number;
}

const MembersList: React.FC<Props> = ({
	members,
	onSelect,
	theme,
	onMemberDelete,
	loggedUserId,
	ownerId,
}) => {
	const sendMailHandler = (id: number) => {
		const emailAddress = members!.find((x) => x.id === id)!;
		Linking.openURL(`mailto:${emailAddress}?subject=FTS2020%20-%20member%20message`);
	};

	return (
		<>
			<Title>Members</Title>
			{members ? (
				members.map((member) => {
					const actions: MemberAction[] = [
						{
							icon: 'email',
							onPress: sendMailHandler,
							disabled: loggedUserId === member.id,
						},
					];

					if (onMemberDelete) {
						actions.push({
							icon: 'delete',
							onPress: onMemberDelete,
							disabled: ownerId === member.id,
						});
					}
					return (
						<MembersListItem
							key={member.id}
							member={member}
							onSelect={onSelect}
							actions={actions}
							theme={theme}
						/>
					);
				})
			) : (
				<Placeholder Animation={Shine}>
					<PlaceholderLine height={40} />
					<PlaceholderLine height={40} />
				</Placeholder>
			)}
		</>
	);
};

export default MembersList;
