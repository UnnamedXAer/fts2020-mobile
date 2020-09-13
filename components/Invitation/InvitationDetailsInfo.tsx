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
			<Paragraph>
				[ {moment(invitation?.createAt).format('dddd, Do MMM YYYY')} ]
			</Paragraph>
			<Paragraph>
				The user{' '}
				<Text
					style={{
						fontWeight: 'bold',
					}}
				>
					{invitation.sender.emailAddress} ({invitation.sender.userName})
				</Text>{' '}
				invites you to join to the{' '}
				<Text
					style={{
						fontWeight: 'bold',
					}}
				>
					{invitation.flat.name}
				</Text>{' '}
				flat.
			</Paragraph>
		</View>
	) : (
		<View>
			{/* <Placeholder Animation={Shine}>
				<PlaceholderLine style={styles.invitationInfoPlaceholderLine} />
				<PlaceholderLine style={styles.invitationInfoPlaceholderLine} />
				<PlaceholderLine style={styles.invitationInfoPlaceholderLine} />
				<PlaceholderLine style={styles.invitationInfoPlaceholderLine} />
			</Placeholder> */}
		</View>
	);
};

const styles = StyleSheet.create({
	invitationInfoPlaceholderLine: {
		width: '90%',
		height: 16,
	},
	invitationTextWrapper: {},
});

export default InvitationDetailsInfo;
