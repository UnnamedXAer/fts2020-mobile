import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TextInputProps } from 'react-native-paper/lib/typescript/src/components/TextInput/TextInput';
import { TextInput, Theme, withTheme } from 'react-native-paper';

interface Props extends TextInputProps {
	theme: Theme;
}

const Input: React.FC<Props> = (props) => {
	return (
		<TextInput
            {...props}
            style={[{ backgroundColor: props.theme.colors.surface }, props.style]}
		/>
	);
};

const styles = StyleSheet.create({});

export default withTheme(Input);
