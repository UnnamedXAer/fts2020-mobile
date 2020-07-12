import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Divider, Headline, Title, Paragraph, useTheme, Theme } from 'react-native-paper';
import DetailsScreenHeader from './DetailsScreenHeader/DetailsScreenHeader';
import MembersList from '../MembersList/MembersList';
import User from '../../models/user';
import { Placeholder } from 'rn-placeholder';
import { PlaceholderLine, Shine } from '../UI/Placeholder/Placeholder';

interface Props {
	owner: User | undefined;
	createAt: Date | undefined;
	onOwnerPress: (id: User['id']) => void;
	iconName: string;
	active: boolean | undefined;
	name: string | undefined;
	description: string | undefined;
	members: User[] | undefined;
	onMemberSelect: (id: User['id']) => void;
}

const DetailsScreenInfo: React.FC<Props> = ({
	owner,
	createAt,
	onOwnerPress,
	iconName,
	active,
	name,
	description,
	members,
	onMemberSelect,
}) => {
	const theme = useTheme();
	return (
		<>
			<View style={styles.container}>
				{!active && (
					<Headline style={{ color: theme.colors.placeholder }}>
						[Inactive]{' '}
					</Headline>
				)}
				<Headline>{name}</Headline>
			</View>
			<DetailsScreenHeader
				owner={owner}
				createAt={createAt}
				iconName={iconName}
				theme={theme}
				onOwnerPress={onOwnerPress}
			/>
			<Divider style={styles.divider} />
			<View style={styles.section}>
				<Title>Description</Title>
				{description !== void 0 ? (
					<Paragraph>{description}</Paragraph>
				) : (
					<Placeholder Animation={Shine}>
						<PlaceholderLine height={16} />
						<PlaceholderLine height={16} />
						<PlaceholderLine height={16} />
					</Placeholder>
				)}
			</View>
			<Divider style={styles.divider} />
			<View style={styles.section}>
				<MembersList members={members} onSelect={onMemberSelect} theme={theme} />
			</View>
			<Divider style={styles.divider} />
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		paddingTop: 24,
		justifyContent: 'center',
	},
	section: {
		paddingHorizontal: 8,
		paddingBottom: 8,
	},
	divider: {
		marginHorizontal: 16,
	},
});

export default DetailsScreenInfo;
