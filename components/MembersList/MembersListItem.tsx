import React from 'react';
import User from '../../models/user';
import { Theme } from 'react-native-paper/lib/typescript/src/types';
import { List, Avatar } from 'react-native-paper';

interface Props {
	member: User;
	onSelect: (id: User['id']) => void;
	theme: Theme;
}

const MembersListItem: React.FC<Props> = ({ member, theme, onSelect }) => {
	return (
		<List.Item
			title={member.emailAddress}
			description={member.userName}
			left={() =>
				member.avatarUrl ? (
					<Avatar.Image
						source={{
							uri: member.avatarUrl,
						}}
						size={48}
					/>
				) : (
					<Avatar.Icon
						icon="account-outline"
						size={48}
						theme={{
							colors: {
								primary: theme.colors.disabled,
							},
						}}
					/>
				)
			}
			rippleColor={theme.colors.primary}
			onPress={() => onSelect(member.id)}
		/>
	);
};

export default MembersListItem;
