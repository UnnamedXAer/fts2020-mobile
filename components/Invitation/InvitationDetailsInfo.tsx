import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Paragraph, Text } from 'react-native-paper';
import moment from 'moment';
import { Placeholder } from 'rn-placeholder';
import { Shine, PlaceholderLine } from '../../components/UI/Placeholder/Placeholder';
import { InvitationPresentation } from '../../models/invitation';
import { Theme } from 'react-native-paper/lib/typescript/src/types';

interface Props {
	invitation: InvitationPresentation | undefined;
	theme: Theme;
}

const InvitationDetailsInfo: React.FC<Props> = ({ theme, invitation }) => {
	return invitation ? (
		<View
			style={{
				flexShrink: 1,
			}}
		>
			<Paragraph
				style={{
					textAlign: 'right',
					color: theme.colors.placeholder,
					fontStyle: 'italic',
					fontSize: 12,
				}}
			>
				{moment(invitation?.createAt).format('dddd, Do MMM YYYY')}
			</Paragraph>
			<Paragraph>
				User{' '}
				<Text
					style={{
						fontWeight: 'bold',
					}}
				>
					{invitation.sender.emailAddress} ({invitation.sender.userName})
				</Text>{' '}
				invites you to join to a flat.
			</Paragraph>
		</View>
	) : (
		<View style={{ flex: 1 }}>
			<Placeholder Animation={Shine}>
				<PlaceholderLine
					style={[
						styles.invitationInfoPlaceholderLine,
						styles.datePlaceholderLine,
					]}
				/>
				<PlaceholderLine style={styles.invitationInfoPlaceholderLine} />
				<PlaceholderLine style={styles.invitationInfoPlaceholderLine} />
				<PlaceholderLine style={styles.invitationInfoPlaceholderLine} />
			</Placeholder>
		</View>
	);
};

const styles = StyleSheet.create({
	invitationInfoPlaceholderLine: {
		width: '90%',
		height: 14,
	},
	datePlaceholderLine: {
		width: '50%',
		height: 12,
		alignSelf: 'flex-end',
	},
	invitationTextWrapper: {},
});

export default InvitationDetailsInfo;
