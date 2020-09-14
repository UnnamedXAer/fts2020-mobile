import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Paragraph, Text, Divider, Title } from 'react-native-paper';
import moment from 'moment';
import { Placeholder } from 'rn-placeholder';
import { Shine, PlaceholderLine } from '../../components/UI/Placeholder/Placeholder';
import { Theme } from 'react-native-paper/lib/typescript/src/types';
import Flat from '../../models/flat';

interface Props {
	flat: Flat | undefined;
	theme: Theme;
}

const InvitationDetailsFlatInfo: React.FC<Props> = ({ theme, flat }) => {
	return flat ? (
		<View
			style={{
				flexShrink: 1,
				position: 'relative',
			}}
		>
			<Paragraph
				style={{
					position: 'absolute',
					top: -20,
					left: -16 - 40,
					backgroundColor: theme.colors.background,
					paddingHorizontal: 16,
					color: theme.colors.placeholder,
					fontStyle: 'italic',
					fontSize: 12,
				}}
			>
				Flat Information
			</Paragraph>
			<Title>{flat.name}</Title>
			<Paragraph style={{ color: theme.colors.placeholder }}>
				Create by:{' '}
				<Text>
					{flat.owner?.emailAddress} ({flat.owner?.userName})
				</Text>
			</Paragraph>
			<Paragraph style={{ color: theme.colors.placeholder }}>
				Create at: <Text>{moment(flat?.createAt).format('Do MMMM YYYY')}</Text>
			</Paragraph>
			<View>
				<Divider style={{ marginVertical: 8 }} />
				<Paragraph style={{ color: theme.colors.placeholder }}>
					Flat description:
				</Paragraph>
				<Paragraph>{flat.description !== '' ? flat.description : '-'}</Paragraph>
			</View>
		</View>
	) : (
		<View style={{ flex: 1 }}>
			<Placeholder Animation={Shine}>
				<PlaceholderLine
					style={[styles.placeholderLine, styles.titlePlaceholderLine]}
				/>
				<PlaceholderLine style={styles.placeholderLine} />
				<PlaceholderLine style={styles.placeholderLine} />
				<Divider style={{ marginVertical: 8 }} />

				<PlaceholderLine style={[styles.placeholderLine, { height: 12 }]} />
				<PlaceholderLine
					style={[styles.placeholderLine, { height: 12, width: '60%' }]}
				/>
			</Placeholder>
		</View>
	);
};

const styles = StyleSheet.create({
	placeholderLine: {
		width: '90%',
		height: 14,
	},
	titlePlaceholderLine: {
		height: 24,
	},
	invitationTextWrapper: {},
});

export default InvitationDetailsFlatInfo;
