import React, { useState, useRef, MutableRefObject, useEffect } from 'react';
import {
	StyleSheet,
	View,
	TextInput,
	ScrollView,
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
	Keyboard,
	StatusBar,
	Dimensions,
} from 'react-native';
import { Theme, withTheme, Button, Paragraph } from 'react-native-paper';
import { Linking } from 'expo';
import Header from '../../components/UI/Header';
import validateAuthFormField from '../../utils/validation';
import Input from '../../components/UI/Input';
import { StateError } from '../../store/ReactTypes/customReactTypes';
import NotificationCard from '../../components/UI/NotificationCard';
import { useDispatch } from 'react-redux';
import { authorize } from '../../store/actions/auth';
import { Credentials } from '../../models/auth';
import HttpErrorParser from '../../utils/parseError';
import useForm, { createInitialState, FormActionTypes } from '../../hooks/useForm';
import ExternalProviders from '../../components/Auth/ExternalProviders/ExternalProviders';
import { AuthProvider, ProviderDisplayName } from '../../types/types';
import { APP_SERVER_URL } from '../../config/env';

interface Props {
	theme: Theme;
	toggleAuthScreen: () => void;
}

const formFields = ['emailAddress', 'password', 'confirmPassword', 'userName'] as const;
type FormFields = typeof formFields[number];

const initialState = createInitialState<FormFields>({
	confirmPassword: '',
	emailAddress: '',
	password: '',
	userName: '',
});

const RegistrationScreen: React.FC<Props> = ({ theme, toggleAuthScreen }) => {
	const [loading, setLoading] = useState(false);
	const [currentProvider, setCurrentProvider] = useState<AuthProvider>(null);
	const [error, setError] = useState<StateError>(null);
	const [formState, dispatchForm] = useForm<FormFields>(initialState);
	const dispatch = useDispatch();

	const passwordInpRef: MutableRefObject<TextInput | null> = useRef(null);
	const confirmPasswordInpRef: MutableRefObject<TextInput | null> = useRef(null);
	const userNameInpRef: MutableRefObject<TextInput | null> = useRef(null);

	const isMounted = useRef(true);
	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

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
		if (loading) {
			return;
		}
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
		setCurrentProvider('Local');

		const credentials = new Credentials({
			...formState.values,
		});

		try {
			await dispatch(authorize(credentials, false));
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

			if (isMounted.current) {
				setError(msg);
				setLoading(false);
				setCurrentProvider(null);
			}
		}
	};

	const externalProviderPressHandler = async (provider: ProviderDisplayName) => {
		if (loading) {
			return;
		}
		setLoading(true);
		setCurrentProvider(provider);

		try {
			const isOpened = await Linking.openURL(
				`${APP_SERVER_URL}/auth/${provider.toLowerCase()}/login`
			);
			if (!isOpened) {
				throw new Error(`Could not start ${provider} authorization process.`);
			}
		} catch (err) {
			if (isMounted.current) {
				setError(
					`Sorry, could not start ${provider} authorization process. \nPlease try again later or use other sign method.`
				);
			}
		}
		if (isMounted.current) {
			setLoading(false);
			setCurrentProvider(null);
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
					<Header style={styles.header}>Sign Up</Header>
					<View style={styles.inputContainer}>
						<Input
							style={styles.input}
							name="emailAddress"
							label="Email Address"
							keyboardType="email-address"
							returnKeyType="next"
							returnKeyLabel="next"
							onSubmitEditing={() => userNameInpRef!.current!.focus()}
							disabled={loading}
							formState={formState}
							textChanged={fieldTextChangeHandler}
							blur={inputBlurHandler}
						/>
					</View>
					<View style={styles.inputContainer}>
						<Input
							style={styles.input}
							label="User Name"
							name="userName"
							keyboardType="default"
							returnKeyType="next"
							returnKeyLabel="next"
							onSubmitEditing={() => passwordInpRef!.current!.focus()}
							ref={userNameInpRef}
							disabled={loading}
							formState={formState}
							textChanged={fieldTextChangeHandler}
							blur={inputBlurHandler}
						/>
					</View>
					<View style={styles.inputContainer}>
						<Input
							style={styles.input}
							label="Password"
							name="password"
							secureTextEntry
							returnKeyType="next"
							returnKeyLabel="next"
							onSubmitEditing={() =>
								confirmPasswordInpRef!.current!.focus()
							}
							ref={passwordInpRef}
							disabled={loading}
							formState={formState}
							textChanged={fieldTextChangeHandler}
							blur={inputBlurHandler}
						/>
					</View>
					<View style={styles.inputContainer}>
						<Input
							style={styles.input}
							label="Confirm Password"
							name="confirmPassword"
							secureTextEntry
							returnKeyType="done"
							returnKeyLabel="Submit"
							onSubmitEditing={submitHandler}
							ref={confirmPasswordInpRef}
							disabled={loading}
							formState={formState}
							textChanged={fieldTextChangeHandler}
							blur={inputBlurHandler}
						/>
					</View>
					<View style={styles.errorContainer}>
						{error !== null && (
							<NotificationCard severity="error">{error}</NotificationCard>
						)}
					</View>
					<View style={styles.linkContainer}>
						<Button onPress={toggleAuthScreen}>Switch to SIGN IN</Button>
					</View>
					<View>
						<Button
							mode="contained"
							uppercase
							onPress={submitHandler}
							loading={loading && currentProvider === 'Local'}
						>
							sign up
						</Button>
					</View>
					<View
						style={{
							marginVertical: 8,
						}}
					>
						<Paragraph>Or Sign Up with</Paragraph>
					</View>
					<View>
						<ExternalProviders
							loadingProvider={currentProvider}
							providerPressHandler={externalProviderPressHandler}
						/>
					</View>
				</ScrollView>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
};

const scale = Dimensions.get('window').scale;

const styles = StyleSheet.create({
	keyboardAvoidingView: {
		flex: 1,
		marginTop: StatusBar.currentHeight,
	},
	screen: {
		paddingTop: scale > 2.5 ? 50 : 24,
		flexDirection: 'column',
		alignItems: 'center',
	},
	header: {
		paddingTop: 16,
		fontSize: scale > 2.5 ? 44 : 32,
	},
	inputContainer: {
		width: '90%',
		maxWidth: 400,
		marginVertical: 4,
	},
	input: {
		fontSize: 16,
		height: 55,
	},
	errorContainer: {
		width: '90%',
		maxWidth: 400,
	},
	linkContainer: {
		alignItems: 'flex-start',
		width: '90%',
	},
});

export default withTheme(RegistrationScreen);
