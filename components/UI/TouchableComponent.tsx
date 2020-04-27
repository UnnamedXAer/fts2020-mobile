import React from 'react';
import {
	TouchableOpacity,
	TouchableNativeFeedback,
	Platform,
	TouchableOpacityProps,
	TouchableNativeFeedbackProps,
} from 'react-native';
import { Theme } from 'react-native-paper/lib/typescript/src/types';
import { withTheme, Colors } from 'react-native-paper';

interface Props extends TouchableNativeFeedbackProps, TouchableOpacityProps {
	theme: Theme;
}

const TouchableComponent: React.FC<Props> = (props) => {
	return Platform.OS === 'android' && Platform.Version >= 21 ? (
		<TouchableNativeFeedback
			background={TouchableNativeFeedback.Ripple(Colors.teal100, false)}
			{...props}
		>
			{props.children}
		</TouchableNativeFeedback>
	) : (
		<TouchableOpacity {...props}>{props.children}</TouchableOpacity>
	);
};

export default withTheme(TouchableComponent);
