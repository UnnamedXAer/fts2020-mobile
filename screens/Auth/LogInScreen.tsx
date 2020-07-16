import React, { useState, useRef, MutableRefObject } from 'react';
import {
	StyleSheet,
	View,
	TextInput,
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
	Keyboard,
	ScrollView,
	StatusBar,
} from 'react-native';
import { Theme, withTheme, Button } from 'react-native-paper';
import Header from '../../components/UI/Header';
import validateAuthFormField from '../../utils/validation';
import Input from '../../components/UI/Input';
import CustomButton from '../../components/UI/CustomButton';
import { StateError } from '../../store/ReactTypes/customReactTypes';
import NotificationCard from '../../components/UI/NotificationCard';
import { useDispatch } from 'react-redux';
import { authorize } from '../../store/actions/auth';
import { Credentials } from '../../models/auth';
import HttpErrorParser from '../../utils/parseError';
import useForm, { FormActionTypes, createInitialState } from '../../hooks/useForm';

interface Props {
	theme: Theme;
	toggleAuthScreen: () => void;
}

const formFields = ['emailAddress', 'password'] as const;
type FormFields = typeof formFields[number];

const initialState = createInitialState<FormFields>({
	emailAddress: '',
	password: '',
});

const LogInScreen: React.FC<Props> = ({ theme, toggleAuthScreen }) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<StateError>(null);

	const [formState, dispatchForm] = useForm<FormFields>(initialState);

	const dispatch = useDispatch();

	const passwordInpRef: MutableRefObject<TextInput | null> = useRef(null);

	const fieldTextChangeHandler = (fieldName: FormFields, txt: string) => {
		dispatchForm({
			fieldId: fieldName,
			value: txt,
			type: FormActionTypes.UpdateValue,
		});
	};

	const inputBlurHandler = (name: FormFields) => {
		dispatchForm({
			fieldId: name,
			type: FormActionTypes.MarkAsTouched,
		});
		const fieldError = validateAuthFormField(name, formState.values);
		dispatchForm({
			type: FormActionTypes.SetError,
			error: fieldError,
			fieldId: name,
		});
	};

	const submitHandler = async () => {
		setError(null);
		let isFormValid = true;
		formFields.forEach((fieldName) => {
			const fieldError = validateAuthFormField(fieldName, formState.values);
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
			setError('Correct the form.');
			return;
		}
		setLoading(true);

		const credentianls = new Credentials({
			...formState.values,
		});

		try {
			await dispatch(authorize(credentianls, true));
		} catch (err) {
			const error = new HttpErrorParser(err);
			let msg: string = error.getMessage();
			const errArray = error.getFieldsErrors();
			errArray.forEach((x) => {
				x.msg;
				dispatchForm({
					type: FormActionTypes.SetError,
					error: x.msg,
					fieldId: x.param,
				});
			});

			setError(msg);
			setLoading(false);
		}
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
					<Header style={styles.header}>Sign In</Header>
					<View style={styles.inputContainer}>
						<Input
							style={styles.input}
							name="emailAddress"
							label="Email Address"
							keyboardType="email-address"
							returnKeyType="next"
							returnKeyLabel="next"
							onSubmitEditing={() => passwordInpRef!.current!.focus()}
							textChanged={fieldTextChangeHandler}
							blur={inputBlurHandler}
							formState={formState}
						/>
					</View>
					<View style={styles.inputContainer}>
						<Input
							style={styles.input}
							name="password"
							label="Password"
							secureTextEntry
							returnKeyType="done"
							returnKeyLabel="Submit"
							onSubmitEditing={submitHandler}
							ref={passwordInpRef}
							disabled={loading}
							textChanged={fieldTextChangeHandler}
							blur={inputBlurHandler}
							formState={formState}
						/>
					</View>
					<View style={styles.errorContainer}>
						{error !== null && (
							<NotificationCard severity="error">{error}</NotificationCard>
						)}
					</View>
					<View style={styles.linkContainer}>
						<Button onPress={toggleAuthScreen}>Switch to SIGN UP</Button>
					</View>
					<View>
						<CustomButton
							disabled={loading}
							onPress={submitHandler}
							loading={loading}
						>
							SIGN IN
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
		paddingTop: 50,
		flexDirection: 'column',
		alignItems: 'center',
	},
	header: {
		paddingTop: 16,
		fontSize: 44,
	},
	inputContainer: {
		width: '90%',
		maxWidth: 400,
		marginVertical: 8,
	},
	input: {
		fontSize: 24,
	},
	errorContainer: {
		width: '90%',
		maxWidth: 400,
	},
	linkContainer: {
		alignItems: 'flex-start',
		width: '90%',
		marginBottom: 16,
	},
});

export default withTheme(LogInScreen);
