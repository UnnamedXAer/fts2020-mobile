import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
	Divider,
	Headline,
	Title,
	Paragraph,
	useTheme,
} from 'react-native-paper';
import { Placeholder } from 'rn-placeholder';
import DetailsScreenHeader from './DetailsScreenHeader/DetailsScreenHeader';
import MembersList from '../MembersList/MembersList';
import User from '../../models/user';
import { PlaceholderLine, Shine } from '../UI/Placeholder/Placeholder';
import { StateError } from '../../store/ReactTypes/customReactTypes';
import NotificationCard from '../UI/NotificationCard';
import {
	FlatDetailsScreenNavigationProp,
	TaskDetailsScreenNavigationProp,
} from '../../types/navigationTypes';

interface Props {
	navigation:
		| FlatDetailsScreenNavigationProp
		| TaskDetailsScreenNavigationProp;
	error: StateError;
	owner: User | undefined;
	createAt: Date | undefined;
	iconName: string;
	active: boolean | undefined;
	name: string | undefined;
	description: string | undefined;
	members: User[] | undefined;
	onMemberDelete?: (id: User['id']) => void;
	additionalInfo?: JSX.Element;
	ownerId?: number;
	loggedUserId: number;
}

const DetailsScreenInfo: React.FC<Props> = ({
	navigation,
	error,
	owner,
	createAt,
	iconName,
	active,
	name,
	description,
	members,
	onMemberDelete,
	additionalInfo,
	loggedUserId,
	ownerId,
}) => {
	const theme = useTheme();

	const personSelectHandler = (id: number) => {
		// TODO
		(navigation.navigate as any)('ProfileStack', {
			screen: 'Profile',
			params: { id },
		});
	};
	return (
		<>
			{error && (
				<NotificationCard severity="error">{error}</NotificationCard>
			)}
			<View style={styles.container}>
				{name ? (
					<>
						{active === false && (
							<Headline
								style={{ color: theme.colors.placeholder }}
							>
								[Inactive]{' '}
							</Headline>
						)}
						<Headline>{name}</Headline>
					</>
				) : (
					<Placeholder Animation={Shine}>
						<PlaceholderLine
							height={40}
							style={{
								width: '80%',
								alignSelf: 'center',
								marginBottom: 8,
								marginTop: 8,
							}}
						/>
					</Placeholder>
				)}
			</View>
			<DetailsScreenHeader
				owner={owner}
				createAt={createAt}
				iconName={iconName}
				theme={theme}
				onOwnerPress={personSelectHandler}
			/>
			<Divider style={styles.divider} />
			{additionalInfo && (
				<>
					<View style={styles.section}>{additionalInfo}</View>
					<Divider style={styles.divider} />
				</>
			)}
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
				<MembersList
					members={members}
					onSelect={personSelectHandler}
					theme={theme}
					onMemberDelete={onMemberDelete}
					loggedUserId={loggedUserId}
					ownerId={ownerId}
				/>
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
