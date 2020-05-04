import React from 'react';
import {
	StyleSheet,
	View,
	GestureResponderEvent,
	StyleProp,
	ViewStyle,
	TextStyle,
} from 'react-native';
import { Paragraph, Card, withTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { Theme } from 'react-native-paper/lib/typescript/src/types';

interface Props {
	serverity?: 'error' | 'warning' | 'info' | 'success';
	onPress?: (ev: GestureResponderEvent) => void;
	children: React.ReactNode;
	theme: Theme;
}

const NotificationCard: React.FC<Props> = (props) => {
	let serverityTextStyle: TextStyle;
	let serverityCardStyle: ViewStyle;
	let inconColor: string;

	switch (props.serverity) {
		case 'error':
			serverityCardStyle = {
				borderColor: '',
				backgroundColor: 'rgb(253, 236, 234)',
			};
			serverityTextStyle = {
				color: 'rgb(97, 26, 21)',
			};
			inconColor = '#f44336';
			break;

		default:
			serverityCardStyle = {
				borderColor: 'rgb(166, 213, 250)',
				backgroundColor: 'rgb(232, 244, 253)',
			};
			serverityTextStyle = {
				color: 'rgb(13, 60, 97)',
			};
			inconColor = '#2196f3';

			break;
	}

	return (
		<Card style={[styles.card, serverityCardStyle]}>
			<View style={styles.container}>
				<MaterialIcons
					name="error-outline"
					size={26}
					style={{ color: inconColor }}
				/>
				<Paragraph style={[styles.text, serverityTextStyle]}>
					{props.children}
				</Paragraph>
			</View>
		</Card>
	);
};

const styles = StyleSheet.create({
	card: {
		elevation: 0,
		width: '100%',
		paddingHorizontal: 10,
		paddingVertical: 10,
		marginVertical: 5,
		// borderWidth: 1,
	},
	container: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	text: {
		paddingStart: 10,
		fontSize: 18,
	},
});

export default withTheme(NotificationCard);
