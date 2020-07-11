import React from 'react';
import { StyleSheet, View, ViewStyle, TextStyle } from 'react-native';
import { Paragraph, Card } from 'react-native-paper';
import { MaterialIcons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { assertUnreachable } from '../../utils/assertUnreachable';
import { Severity } from '../../store/ReactTypes/customReactTypes';

interface Props {
	severity?: Severity;
	children: React.ReactNode;
}

const NotificationCard: React.FC<Props> = ({ severity = 'info', children }) => {
	let serverityTextStyle: TextStyle;
	let serverityCardStyle: ViewStyle;
	let NotificationIcon: React.ReactElement;

	switch (severity) {
		case 'info':
			serverityCardStyle = {
				backgroundColor: 'rgb(232, 244, 253)',
			};
			serverityTextStyle = {
				color: 'rgb(13, 60, 97)',
			};
			NotificationIcon = (
				<MaterialIcons
					name="info-outline"
					size={26}
					style={{ color: '#2196f3' }}
				/>
			);
			break;
		case 'error':
			serverityCardStyle = {
				backgroundColor: 'rgb(253, 236, 234)',
			};
			serverityTextStyle = {
				color: 'rgb(97, 26, 21)',
			};
			NotificationIcon = (
				<MaterialIcons
					name="error-outline"
					size={26}
					style={{ color: '#f44336' }}
				/>
			);
			break;
		case 'warning':
			serverityCardStyle = {
				backgroundColor: 'rgb(255, 244, 229)',
			};
			serverityTextStyle = {
				color: 'rgb(102, 60, 0)',
			};
			NotificationIcon = (
				<AntDesign name="warning" size={24} style={{ color: '#ff9800' }} />
			);
			break;
		case 'success':
			serverityCardStyle = {
				backgroundColor: 'rgb(237, 247, 237)',
			};
			serverityTextStyle = {
				color: 'rgb(30, 70, 32)',
			};
			NotificationIcon = (
				<MaterialCommunityIcons
					name="checkbox-marked-circle-outline"
					size={26}
					style={{ color: '#4caf50' }}
				/>
			);
			break;
		default:
			assertUnreachable(severity);
	}

	return (
		<Card style={[styles.card, serverityCardStyle]}>
			<View style={styles.container}>
				{NotificationIcon}
				<Paragraph style={[styles.text, serverityTextStyle]}>
					{children}
				</Paragraph>
			</View>
		</Card>
	);
};

const styles = StyleSheet.create({
	card: {
		elevation: 0,
		width: '100%',
		paddingHorizontal: 8,
		paddingVertical: 8,
		marginVertical: 5,
	},
	container: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	text: {
		flex: 1,
		paddingStart: 10,
		fontSize: 18,
	},
});

export default NotificationCard;
