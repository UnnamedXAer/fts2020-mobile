import React from 'react';
import { TouchableHighlight, View, StyleSheet } from 'react-native';
import { Avatar, Headline, Paragraph } from 'react-native-paper';
import { Theme } from 'react-native-paper/lib/typescript/src/types';
import moment from 'moment';
import {
	invitationInactiveStatuses,
	InvitationStatusInfo,
} from '../../constants/invitation';
import { InvitationPresentation } from '../../models/invitation';

interface Props {
	item: InvitationPresentation;
	theme: Theme;
	onSelect: (id: number) => void;
}

export const InvitationRenderItem: React.FC<Props> = ({ item, theme, onSelect }) => {
	return (
		<TouchableHighlight
			underlayColor={theme.colors.primary}
			onPress={() => onSelect(item.id!)}
		>
			<View style={styles.itemContainer}>
				<View style={{ marginRight: 4 }}>
					<Avatar.Icon
						color={
							invitationInactiveStatuses.includes(item.status)
								? theme.colors.placeholder
								: theme.colors.primary
						}
						style={{ backgroundColor: theme.colors.background }}
						icon="all-inclusive"
					/>
				</View>
				<View style={{ flex: 1 }}>
					<Headline>{item.flat.name}</Headline>
					<View>
						<Paragraph style={{ color: theme.colors.placeholder }}>
							Invited by {item.sender.emailAddress} ({item.sender.userName}
							),
						</Paragraph>
						<Paragraph style={{ color: theme.colors.placeholder }}>
							at {moment(item.createAt).format('dddd, Do MMM YYYY')}
						</Paragraph>
						<Paragraph style={{ color: theme.colors.placeholder }}>
							Status: {InvitationStatusInfo[item.status]}
						</Paragraph>
					</View>
				</View>
			</View>
		</TouchableHighlight>
	);
};

const styles = StyleSheet.create({
	itemContainer: {
		paddingVertical: 8,
		paddingEnd: 8,
		paddingStart: 4,
		flexDirection: 'row',
	},
});

export default InvitationRenderItem;
