import React from 'react';
import { Title, Theme, withTheme } from 'react-native-paper';
import { PlaceholderLine, Shine } from '../../UI/Placeholder/Placeholder';
import { Placeholder } from 'rn-placeholder';
import Invitation from '../../../models/invitation';
import FlatInvitationsListItem from './FlatInvitationsListItem';

interface Props {
	invitations: Invitation[] | undefined;
	onSelect: (id: Invitation['id']) => void;
	theme: Theme;
}

const FlatInvitationsList: React.FC<Props> = ({ invitations, onSelect, theme }) => {
	return (
		<>
			<Title>Invitations</Title>
			{invitations ? (
				invitations.map((invitation) => (
					<FlatInvitationsListItem
						key={invitation.id}
						invitation={invitation}
						onSelect={onSelect}
						theme={theme}
					/>
				))
			) : (
				<Placeholder Animation={Shine}>
					<PlaceholderLine height={40} />
					<PlaceholderLine height={40} />
				</Placeholder>
			)}
		</>
	);
};

export default withTheme(FlatInvitationsList);
