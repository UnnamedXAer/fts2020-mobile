import React from 'react';
import {
	List,
	IconButton,
	Text,
	Avatar,
	ActivityIndicator,
	Divider,
} from 'react-native-paper';
import User from '../../models/user';
import { Theme } from 'react-native-paper/lib/typescript/src/types';
import { APP_NAME } from '../../config/env';

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
	email: string;
	member: Partial<User> | undefined;
	colors: Theme['colors'];
	isLoggedUser: boolean;
	memberStatus: MembersStatus;
	formLoading: boolean;
	onRemove: (email: string) => void;
}

const InvitationMembersEmailListItem: React.FC<Props> = ({
	colors,
	email,
	member,
	isLoggedUser,
	memberStatus,
	formLoading,
	onRemove,
}) => {
	let secondaryTextColor: keyof Theme['colors'];
	let sateIndicator: React.ReactNode;
	let secondaryText: string;

	switch (memberStatus) {
		case MembersStatus.loading:
			secondaryTextColor = 'placeholder';
			sateIndicator = (
				<ActivityIndicator
					style={{ width: 48, height: 48, marginHorizontal: 0 }}
				/>
			);
			secondaryText = 'Loading...';
			break;
		case MembersStatus.already_member:
		case MembersStatus.ok:
			secondaryTextColor = 'primary';
			sateIndicator = member?.avatarUrl ? (
				<Avatar.Image
					source={{ uri: member?.avatarUrl }}
					size={48}
					style={{ width: 48, height: 48, marginHorizontal: 0 }}
				/>
			) : (
				<Avatar.Icon
					color={colors.primary}
					icon="account-outline"
					size={48}
					theme={{
						colors: {
							primary: colors.background,
						},
					}}
					style={{ width: 48, height: 48, marginHorizontal: 0 }}
				/>
			);
			secondaryText = member ? member.userName! : '';
			break;
		case MembersStatus.accepted:
			secondaryTextColor = 'primary';
			sateIndicator = (
				<Avatar.Icon
					color={colors.primary}
					icon="check"
					size={48}
					theme={{
						colors: {
							primary: colors.background,
						},
					}}
				/>
			);
			secondaryText = member ? member.userName! : '';
			break;
		case MembersStatus.invalid:
			secondaryTextColor = 'error';
			sateIndicator = (
				<Avatar.Icon
					color={colors.accent}
					icon="close-circle-outline"
					size={48}
					theme={{
						colors: {
							primary: colors.background,
						},
					}}
				/>
			);
			secondaryText = 'Error: This is not a valid email address.';
			break;
		case MembersStatus.not_found:
			secondaryTextColor = 'accent';
			sateIndicator = (
				<Avatar.Icon
					color={colors.accent}
					icon="account-question-outline"
					size={48}
					theme={{
						colors: {
							primary: colors.background,
						},
					}}
				/>
			);
			secondaryText = 'Email address is not registered in ' + APP_NAME;
			break;
		default:
			secondaryTextColor = 'accent';
			sateIndicator = (
				<Avatar.Icon
					icon="help-circle-outline"
					size={48}
					color={colors.notification}
					theme={{
						colors: {
							primary: colors.background,
						},
					}}
				/>
			);
			secondaryText = `Info: Could not check if email address is registered in ${APP_NAME} due to internal error, but invitation will be sent.`;
			break;
	}
	let primaryTextColor: keyof Theme['colors'] = 'text';
	let primaryText = email;
	if (isLoggedUser) {
		primaryTextColor = 'placeholder';
		primaryText = '[You] ' + primaryText;
	} else if (memberStatus === MembersStatus.already_member) {
		primaryTextColor = 'placeholder';
		primaryText = '[Already flat member] ' + primaryText;
	}

	return (
		<>
			<List.Item
				title={
					<Text style={{ color: colors[primaryTextColor] }}>{primaryText}</Text>
				}
				description={
					<Text style={{ color: colors[secondaryTextColor] }}>
						{secondaryText}
					</Text>
				}
				left={
					() =>
						// <View
						// 	style={{
						// 		justifyContent: 'center',
						// 		alignItems: 'center',
						// 		width: 40,
						// 	}}
						// >
						sateIndicator
					// </View>
				}
				right={() => (
					<IconButton
						color={colors.placeholder}
						icon="close"
						disabled={formLoading}
						onPress={() => onRemove(email)}
					/>
				)}
			/>
			<Divider />
		</>
	);
};

export default InvitationMembersEmailListItem;
