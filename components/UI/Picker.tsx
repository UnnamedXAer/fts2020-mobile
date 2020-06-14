import React, { useState } from 'react';
import { TextInput as TextInputType, View } from 'react-native';
import {
	TextInput,
	HelperText,
	Provider,
	Portal,
	Title,
	Paragraph,
	Dialog,
	Text,
} from 'react-native-paper';
import { StateError } from '../../store/ReactTypes/customReactTypes';
import TouchableComponent from './TouchableComponent';
import { TouchableOpacity, TouchableHighlight } from 'react-native-gesture-handler';

export type Option = {
	label: string;
	value: any;
};

interface Props {
	label?: string;
	selectedValue: Option['value'];
	options: Option[];
	error?: StateError;
	disabled?: boolean;
	onChange: (newValue: any) => void;
	touched?: boolean;
}

const Picker = React.forwardRef<TextInputType, Props>((props, ref) => {
	const [modalOpen, setModalOpen] = useState(false);
	const showError = (props.error && props.touched !== false) as boolean;

	const selectHandler = (optionValue: Option['value']) => {
		props.onChange(optionValue);
		setModalOpen(false);
	};

	return (
		<>
			<TouchableOpacity
				onPress={() => {
					setModalOpen(true);
				}}
			>
				<View pointerEvents="none">
					<TextInput
						ref={ref}
						label={props.label}
						error={showError}
						value={
							props.options.find((x) => x.value === props.selectedValue)!
								.label
						}
						mode="outlined"
						editable={false}
					/>
				</View>
			</TouchableOpacity>
			<HelperText type="error" visible={showError}>
				{props.error}
			</HelperText>
			<Portal>
				<Dialog visible={modalOpen} onDismiss={() => setModalOpen(false)}>
					<Dialog.Title>{props.label}</Dialog.Title>
					<Dialog.Content>
						{props.options.map((option) => (
							<TouchableHighlight
								activeOpacity={0.9}
								underlayColor="#eee"
								key={option.value}
								onPress={() => selectHandler(option.value)}
							>
								<Text
									style={{
										fontSize: 24,
										paddingStart: 8,
										marginVertical: 8,
									}}
								>
									{option.label}
								</Text>
							</TouchableHighlight>
						))}
					</Dialog.Content>
				</Dialog>
			</Portal>
		</>
	);
});

export default Picker;
