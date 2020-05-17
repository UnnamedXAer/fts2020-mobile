import React from 'react';
import { StyleSheet, View, ViewStyle, TouchableOpacity } from 'react-native';
import { withTheme } from 'react-native-paper';
import { Theme } from 'react-native-paper/lib/typescript/src/types';

interface Props {
	contentContainerStyle?: ViewStyle;
	children: React.ReactNode;
	theme: Theme;
	onPress?: () => void;
}

const FloatingCard: React.FC<Props> = ({ contentContainerStyle, onPress, children }) => {
	return (
		<TouchableOpacity style={styles.touchableWrapper} onPress={onPress}>
			<View style={[styles.content, contentContainerStyle]}>{children}</View>
		</TouchableOpacity>
	);
};

export default withTheme(FloatingCard);

const styles = StyleSheet.create({
	touchableWrapper: {
		paddingHorizontal: 8,
		top: 80,
		left: 0,
		right: 0,
		position: 'absolute',
	},
	content: {
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
});
