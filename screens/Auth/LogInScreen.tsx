import React, { useState, useRef, MutableRefObject, useEffect } from 'react';
import {
	StyleSheet,
	View,
	TextInput,
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
	Keyboard,
	ScrollView,
	StatusBar,
	Dimensions,
} from 'react-native';
import { Theme, withTheme, Button, Paragraph } from 'react-native-paper';
import Header from '../../components/UI/Header';
import validateAuthFormField from '../../utils/validation';
import Input from '../../components/UI/Input';
import { StateError } from '../../store/ReactTypes/customReactTypes';
import NotificationCard from '../../components/UI/NotificationCard';
import { useDispatch } from 'react-redux';
import { authorize, fetchLoggedUser } from '../../store/actions/auth';
import { Credentials } from '../../models/auth';
import HttpErrorParser from '../../utils/parseError';
import useForm, {
	FormActionTypes,
	createInitialState,
	FormState,
} from '../../hooks/useForm';
import { Linking } from 'expo';
import { APP_SERVER_URL } from '../../config/env';
import ExternalProviders from '../../components/Auth/ExternalProviders/ExternalProviders';
import { AuthProvider, ProviderDisplayName } from '../../types/types';

interface Props {
	theme: Theme;
	toggleAuthScreen: () => void;
	externalProvider: ProviderDisplayName | null;
}

const formFields = ['emailAddress', 'password'] as const;
type FormFields = typeof formFields[number];

const initialState: FormState<FormFields> = createInitialState<FormFields>({
	emailAddress: '',
	password: '',
});

const LogInScreen: React.FC<Props> = ({ theme, toggleAuthScreen, externalProvider }) => {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const [currentProvider, setCurrentProvider] = useState<AuthProvider>(null);
	const [error, setError] = useState<StateError>(null);
	const [formState, dispatchForm] = useForm<FormFields>(initialState);
	const passwordInpRef: MutableRefObject<TextInput | null> = useRef(null);

	const isMounted = useRef(true);
	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	useEffect(() => {
		if (externalProvider) {
			setCurrentProvider(externalProvider);
			setLoading(true);
			(async () => {
				try {
					await dispatch(fetchLoggedUser());
				} catch (err) {
					if (isMounted.current) {
						setError(
							'Could not have authorize by ' +
								externalProvider +
								'.\n' +
								err
						);

						setLoading(false);
						setCurrentProvider(null);
					}
				}
			})();
		}
	}, [externalProvider, dispatch]);

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
			await dispatch(authorize(credentials, true));
		} catch (err) {
			const httpError = new HttpErrorParser(err);
			let msg = httpError.getMessage();
			const errArray = httpError.getFieldsErrors();
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
						<Button
							mode="contained"
							uppercase
							onPress={submitHandler}
							loading={loading && currentProvider === 'Local'}
						>
							sign in
						</Button>
					</View>
					<View
						style={{
							marginVertical: 8,
						}}
					>
						<Paragraph>Or Sign In with</Paragraph>
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
		marginVertical: 8,
	},
	input: {
		fontSize: scale > 2.5 ? 24 : 16,
		height: scale > 2.5 ? 64 : 55,
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
