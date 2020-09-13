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
	onPress: ((event: GestureResponderEvent) => void) &
		(() => void | null | Promise<void>);
	accent?: boolean;
	color?: 'primary' | 'accent' | 'error';
}

const CustomButton = React.forwardRef<View, Props>((props, ref) => {
	const { theme } = props;

	let color = theme.colors[props.color || 'primary'];
	let spinnerColor = color;
	if (props.disabled || props.loading) {
		color = theme.colors.disabled;
	} else if (props.accent) {
		color = theme.colors['accent'];
		spinnerColor = color;
	}

	let rippleColor = Colors.teal100;
	if (props.accent) {
		rippleColor = Colors.orange100;
	} else if (props.color) {
		switch (props.color) {
			case 'error':
				rippleColor = Colors.red100;
				break;
			case 'accent':
				rippleColor = Colors.orange100;
				break;
			default:
				break;
		}
	}

	return (
		<TouchableRipple
			style={props.style}
			rippleColor={rippleColor}
			underlayColor={rippleColor}
			onPress={
				props.onPress as
					| (((event: GestureResponderEvent) => void) & (() => void | null))
					| undefined
			}
			disabled={props.disabled || props.loading}
		>
			<View style={styles.container} ref={ref}>
				<Text
					style={[
						styles.text,
						{
							color: color,
						},
						props.textStyle,
					]}
				>
					{props.children}
				</Text>
				<View style={styles.spinner}>
					{props.loading && (
						<ActivityIndicator size="small" color={spinnerColor} />
					)}
				</View>
			</View>
		</TouchableRipple>
	);
});

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
		margin: 10,
	},
});

export default withTheme(CustomButton);
