import React from 'react';
import User from '../../../models/user';
import { Theme } from 'react-native-paper/lib/typescript/src/types';
import { List, Avatar } from 'react-native-paper';
import Invitation from '../../../models/invitation';
import { InvitationStatusInfo } from '../../../constants/invitation';

interface Props {
	invitation: Invitation;
	onSelect: (id: User['id']) => void;
	theme: Theme;
}

const FlatInvitationsListItem: React.FC<Props> = ({ invitation, theme, onSelect }) => {
	return (
		<List.Item
			title={invitation.emailAddress}
			description={InvitationStatusInfo[invitation.status]}
			left={() => (
				<Avatar.Icon
					icon="contact-mail-outline"
					size={48}
					theme={{
						colors: {
							primary: theme.colors.disabled,
						},
					}}
				/>
			)}
			rippleColor={theme.colors.primary}
			onPress={() => onSelect(invitation.id)}
		/>
	);
};

export default FlatInvitationsListItem;
