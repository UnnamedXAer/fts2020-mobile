import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CreateInfo from './CreateInfo/CreateInfo';
import { Theme } from 'react-native-paper';
import User from '../../../models/user';

interface Props {
	theme: Theme;
	owner: User | undefined;
	createAt: Date;
	onOwnerPress: (id: User['id']) => void;
	iconName: string;
}

const DetailsScreenHeader: React.FC<Props> = ({
	theme,
	owner,
	createAt,
	onOwnerPress,
	iconName,
}) => {
	return (
		<View style={[styles.section, styles.infoContainer]}>
			<View style={styles.avatarContainer}>
				<View style={[{ backgroundColor: theme.colors.disabled }, styles.avatar]}>
					<MaterialCommunityIcons
						name={iconName}
						size={40}
						color={theme.colors.background}
					/>
				</View>
			</View>
			<CreateInfo owner={owner} createAt={createAt} onPersonTouch={onOwnerPress} />
		</View>
	);
};

const styles = StyleSheet.create({
	section: {
		paddingHorizontal: 8,
		paddingBottom: 8,
	},
	infoContainer: {
		paddingVertical: 8,
		justifyContent: 'center',
		flexWrap: 'wrap',
		flexDirection: 'row',
	},
	avatarContainer: {
		marginVertical: 8,
		height: 64,
		width: 64,
		borderRadius: 32,
		backgroundColor: 'white',
		overflow: 'hidden',
	},
	avatar: {
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
});

export default DetailsScreenHeader;
