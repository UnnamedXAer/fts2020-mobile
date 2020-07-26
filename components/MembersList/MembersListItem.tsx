import React from 'react';
import User from '../../models/user';
import { Theme } from 'react-native-paper/lib/typescript/src/types';
import { List, Avatar, IconButton } from 'react-native-paper';

export type MemberAction = {
	icon: string;
	onPress: (id: number) => void | Promise<void>;
	disabled?: boolean;
};

interface Props {
	member: User;
	onSelect: (id: User['id']) => void;
	theme: Theme;
	actions?: MemberAction[];
	sendMailAction: MemberAction;
}

const MembersListItem: React.FC<Props> = ({
	member,
	theme,
	onSelect,
	actions,
	sendMailAction,
}) => {
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
			right={() => (
				<>
					<IconButton
						icon={sendMailAction.icon}
						onPress={() => sendMailAction.onPress}
						color={
							theme.colors[
								sendMailAction.disabled ? 'disabled' : 'placeholder'
							]
						}
					/>
					{actions?.map((action) => (
						<IconButton
							icon={action.icon}
							onPress={() => action.onPress}
							color={
								theme.colors[action.disabled ? 'disabled' : 'placeholder']
							}
						/>
					))}
				</>
			)}
			rippleColor={theme.colors.primary}
			onPress={() => onSelect(member.id)}
		/>
	);
};

export default MembersListItem;
