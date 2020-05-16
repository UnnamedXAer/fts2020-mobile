import React from 'react';
import { TextInputProps } from 'react-native-paper/lib/typescript/src/components/TextInput/TextInput';
import { TextInput, Theme, withTheme, HelperText } from 'react-native-paper';
import { FormState } from '../../hooks/useForm';

interface Props extends TextInputProps {
	theme: Theme;
	formState: FormState;
	name: string;
	textChanged: (fieldName: any, txt: string) => void;
	blur: (name: any) => void;
}

const Input: React.FC<Props> = React.forwardRef((props, ref) => {
	const { formState, theme, name, blur, textChanged } = props;

	return (
		<>
			<TextInput
				ref={ref}
				onChangeText={(txt) => textChanged(name, txt)}
				onBlur={() => blur(name)}
				value={formState.values[name]}
				error={(formState.touches[name] && formState.errors[name]) as boolean}
				{...props}
				style={[
					{
						backgroundColor: theme.colors.surface,
					},
					props.style,
				]}
			/>
			<HelperText
				type="error"
				visible={(formState.touches[name] && formState.errors[name]) as boolean}
			>
				{formState.errors[name]}
			</HelperText>
		</>
	);
});

export default withTheme(Input);
