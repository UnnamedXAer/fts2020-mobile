import React from 'react';
import {
	ViewStyle,
	TextStyle,
	StyleSheet,
	View,
	GestureResponderEvent,
} from 'react-native';
import { Theme } from 'react-native-paper/lib/typescript/src/types';
import {
	withTheme,
	Text,
	ActivityIndicator,
	TouchableRipple,
	Colors,
} from 'react-native-paper';

interface Props {
	children: React.ReactNode;
	theme: Theme;
	style?: ViewStyle;
	textStyle?: TextStyle;
	loading?: boolean;
	disabled?: boolean;
	onPress: ((event: GestureResponderEvent) => void) & (() => void | null | Promise<void>);
	accent?: boolean;
}

const CustomButton: React.FC<Props> = (props) => {
	const { theme } = props;
	return (
		<TouchableRipple
			style={props.style}
			rippleColor={!props.accent ? Colors.teal100 : Colors.orange100}
			underlayColor={!props.accent ? Colors.teal100 : Colors.orange100}
            onPress={props.onPress}
            disabled={props.disabled}
		>
			<View style={styles.container}>
				<Text
					style={[
						styles.text,
						{
							color: props.disabled
								? theme.colors.disabled
								: !props.accent
								? theme.colors.primary
								: theme.colors.accent,
						},
						props.textStyle,
					]}
				>
					{props.children}
				</Text>
				<View style={styles.spinner}>
					{props.loading && (
						<ActivityIndicator
							size="small"
							color={
								!props.accent ? theme.colors.primary : theme.colors.accent
							}
						/>
					)}
				</View>
			</View>
		</TouchableRipple>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		paddingLeft: 28,
		paddingRight: 3,
		alignItems: 'center',
		borderRadius: 10,
	},
	spinner: {
		width: 25,
	},
	text: {
		fontSize: 24,
		textAlign: 'center',
		textAlignVertical: 'center',
		textTransform: 'capitalize',
		margin: 10,
	},
});

export default withTheme(CustomButton);
