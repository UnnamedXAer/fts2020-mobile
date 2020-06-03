import React, { useRef, MutableRefObject, useState } from 'react';
import {
	StyleSheet,
	View,
	ScrollView,
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
	Keyboard,
	StatusBar,
	TextInput,
} from 'react-native';
import { withTheme } from 'react-native-paper';
import { Theme } from 'react-native-paper/lib/typescript/src/types';
import Header from '../components/UI/Header';
import CustomButton from '../components/UI/CustomButton';
import { NewFlatScreenNavigationProps } from '../types/types';
import Input from '../components/UI/Input';
import useForm, { createInitialState, FormActionTypes } from '../hooks/useForm';
import { StateError } from '../store/ReactTypes/customReactTypes';
import { validateFlatFields } from '../utils/validation';
import NotificationCard from '../components/UI/NotificationCard';

interface Props {
	theme: Theme;
	navigation: NewFlatScreenNavigationProps;
}

const newFlatFormFields = ['name', 'description'] as const;
export type NewFlatFormFields = typeof newFlatFormFields[number];

const initialState = createInitialState<NewFlatFormFields>({ name: '', description: '' });

const NewFlatScreen: React.FC<Props> = ({ theme, navigation }) => {
	const descriptionInpRef: MutableRefObject<TextInput | undefined> = useRef();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<StateError>(null);
	const [formState, dispatchForm] = useForm<NewFlatFormFields>(initialState);

	const fieldTextChangeHandler = (fieldName: NewFlatFormFields, txt: string) => {
		dispatchForm({
			fieldId: fieldName,
			value: txt,
			type: FormActionTypes.UpdateValue,
		});
	};

	const inputBlurHandler = (name: NewFlatFormFields) => {
		dispatchForm({
			fieldId: name,
			type: FormActionTypes.MarkAsTouched,
		});
		const fieldError = validateFlatFields(name, formState.values);
		dispatchForm({
			type: FormActionTypes.SetError,
			error: fieldError,
			fieldId: name,
		});
	};

	const submitHandler = async () => {
		setError(null);
		let isFormValid = true;
		newFlatFormFields.forEach((fieldName) => {
			const fieldError = validateFlatFields(fieldName, formState.values);
			isFormValid = isFormValid && fieldError === null;

			dispatchForm({
				type: FormActionTypes.SetError,
				error: fieldError,
				fieldId: fieldName,
			});
		});

		dispatchForm({
			type: FormActionTypes.SetAllTouched,
		});

		if (!isFormValid) {
			setError('Please correct the form.');
			return;
		}
		setLoading(true);
		navigation.popToTop();
		navigation.navigate('InviteMembers');
	};

	return (
		<KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior="height">
			<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
				<ScrollView
					contentContainerStyle={[
						styles.screen,
						{ backgroundColor: theme.colors.surface },
					]}
				>
					<Header style={styles.header}>Add Flat</Header>
					<View style={styles.inputContainer}>
						<Input
							style={styles.input}
							name="name"
							label="Name"
							keyboardType="default"
							returnKeyType="next"
							returnKeyLabel="next"
							onSubmitEditing={() => descriptionInpRef!.current!.focus()}
							disabled={loading}
							formState={formState}
							textChanged={fieldTextChangeHandler}
							blur={inputBlurHandler}
						/>
					</View>
					<View style={styles.inputContainer}>
						<Input
							style={styles.input}
							name="Desciption"
							label="Description"
							keyboardType="default"
							returnKeyType="done"
							returnKeyLabel="submit"
							ref={descriptionInpRef as MutableRefObject<TextInput>}
							onSubmitEditing={submitHandler}
							disabled={loading}
							formState={formState}
							textChanged={fieldTextChangeHandler}
							blur={inputBlurHandler}
						/>
					</View>
					<View style={styles.inputContainer}>
						{error && (
							<NotificationCard serverity="error">{error}</NotificationCard>
						)}
					</View>
					<View style={styles.actions}>
						<CustomButton accent onPress={() => navigation.popToTop()}>
							CANCEL
						</CustomButton>
						<CustomButton onPress={submitHandler}>
							NEXT
						</CustomButton>
					</View>
				</ScrollView>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	keyboardAvoidingView: {
		flex: 1,
		marginTop: StatusBar.currentHeight,
	},
	screen: {
		flexDirection: 'column',
		alignItems: 'center',
	},
	header: {
		paddingTop: 16,
		fontSize: 44,
	},
	infoParagraph: {
		fontSize: 20,
		marginVertical: 8,
	},
	infoParagraphHelper: {
		fontSize: 14,
		color: '#666',
		marginVertical: 8,
	},
	inputContainer: {
		width: '90%',
		maxWidth: 400,
		marginVertical: 4,
	},
	input: {
		fontSize: 16,
		height: 50,
	},
	actions: {
		flexDirection: 'row',
		alignItems: 'flex-end',
	},
});
export default withTheme(NewFlatScreen);
