import React from 'react';
import { Title, Theme } from 'react-native-paper';
import { PlaceholderLine, Shine } from '../UI/Placeholder/Placeholder';
import { Placeholder } from 'rn-placeholder';
import User from '../../models/user';
import MembersListItem from './MembersListItem';

interface Props {
	members: User[] | undefined;
	onSelect: (id: User['id']) => void;
	theme: Theme;
}

const MembersList: React.FC<Props> = ({ members, onSelect, theme }) => {
	return (
		<>
			<Title>Members</Title>
			{members ? (
				members.map((member) => (
					<MembersListItem
						key={member.id}
						member={member}
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

export default MembersList;
