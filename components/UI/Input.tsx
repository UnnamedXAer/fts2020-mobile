import React from 'react';
import { TextInputProps } from 'react-native-paper/lib/typescript/src/components/TextInput/TextInput';
import { TextInput, Theme, withTheme } from 'react-native-paper';

interface Props extends TextInputProps {
	theme: Theme;
}

const Input: React.FC<Props> = React.forwardRef((props, ref) => {

	return (
		<TextInput
			ref={ref}
            {...props}
            style={[{ backgroundColor: props.theme.colors.surface }, props.style]}
		/>
	);
});

export default withTheme(Input);
