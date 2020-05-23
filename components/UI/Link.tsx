import React from 'react';
import { TextStyle, ViewStyle, View } from 'react-native';
import { TouchableRipple, Paragraph, withTheme, Text } from 'react-native-paper';
import { Theme } from 'react-native-paper/lib/typescript/src/types';

interface Props {
	onPress: () => void;
	textStyle?: TextStyle;
	style?: ViewStyle;
	theme: Theme;
	children: string;
	disabled?: boolean;
}

const Link: React.FC<Props> = (props) => {
	return (
		<TouchableRipple
			disabled={props.disabled}
			onPress={props.onPress}
			style={props.style}
		>
			<Text
				style={[
					{
						color: !props.disabled
							? props.theme.colors.primary
							: props.theme.colors.disabled,
					},
					props.textStyle,
				]}
			>
				{props.children}
			</Text>
		</TouchableRipple>
	);
};

export default withTheme(Link);
