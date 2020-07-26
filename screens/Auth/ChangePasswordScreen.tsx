import React, { useState, useRef, MutableRefObject, useEffect } from 'react';
import {
	StyleSheet,
	View,
	TextInput as TextInputType,
	ScrollView,
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
	Keyboard,
	StatusBar,
} from 'react-native';
import { Theme, withTheme } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { updatePassword } from '../../store/actions/auth';
import validateAuthFormField from '../../utils/validation';
import Input from '../../components/UI/Input';
import CustomButton from '../../components/UI/CustomButton';
import { StateError } from '../../store/ReactTypes/customReactTypes';
import NotificationCard from '../../components/UI/NotificationCard';
import HttpErrorParser from '../../utils/parseError';
import useForm, {
	createInitialState,
	FormActionTypes,
	FormState,
} from '../../hooks/useForm';
import {
	ChangePasswordScreenRouteProps,
	ChangePasswordScreenNavigationProps,
} from '../../types/navigationTypes';

interface Props {
	route: ChangePasswordScreenRouteProps;
	navigation: ChangePasswordScreenNavigationProps;
	theme: Theme;
}

const formFields = ['oldPassword', 'password', 'confirmPassword'] as const;
type FormFields = typeof formFields[number];

const initialState: FormState<FormFields> = createInitialState<FormFields>({
	oldPassword: '',
	password: '',
	confirmPassword: '',
});

const RegistrationScreen: React.FC<Props> = ({ theme, navigation }) => {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<StateError>(null);
	const [formState, dispatchForm] = useForm<FormFields>(initialState);
	const [success, setSuccess] = useState(false);

	const passwordInpRef: MutableRefObject<TextInputType | null> = useRef(null);
	const confirmPasswordInpRef: MutableRefObject<TextInputType | null> = useRef(null);

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
		if (name === 'password' || name === 'confirmPassword') {
			const errorPassword = validateAuthFormField(
				'password',
				formState.values,
				false
			);
			const errorConfirmPassword = validateAuthFormField(
				'confirmPassword',
				formState.values,
				false
			);

			dispatchForm({
				type: FormActionTypes.SetError,
				fieldId: 'password',
				error: errorPassword,
			});
			dispatchForm({
				type: FormActionTypes.SetError,
				fieldId: 'confirmPassword',
				error: errorConfirmPassword,
			});
		} else {
			const error = validateAuthFormField(name, formState.values, false);
			dispatchForm({
				type: FormActionTypes.SetError,
				fieldId: name,
				error: error,
			});
		}
		dispatchForm({
			type: FormActionTypes.MarkAsTouched,
			fieldId: name,
		});
	};

	const submitHandler = async () => {
		setError(null);
		setLoading(true);
		setSuccess(false);
		let isFormValid = true;

		for (const name in formState.values) {
			let error = validateAuthFormField(
				name as FormFields,
				formState.values,
				false
			);

			isFormValid = isFormValid && error === null;

			dispatchForm({
				type: FormActionTypes.SetError,
				fieldId: name as FormFields,
				error: error,
			});
		}
		dispatchForm({
			type: FormActionTypes.SetAllTouched,
		});

		if (!isFormValid) {
			dispatchForm({
				type: FormActionTypes.SetFormError,
				error: 'Please correct marked fields.',
			});
			setLoading(false);
			return;
		}

		try {
			await dispatch(
				updatePassword(
					formState.values.oldPassword,
					formState.values.password,
					formState.values.confirmPassword
				)
			);
			if (isMounted.current) {
				setSuccess(true);
				dispatchForm({
					type: FormActionTypes.ResetForm,
					state: initialState,
				});
			}
		} catch (err) {
			if (isMounted.current) {
				const httpError = new HttpErrorParser(err);
				const fieldsErrors = httpError.getFieldsErrors();
				fieldsErrors.forEach((x) =>
					dispatchForm({
						type: FormActionTypes.SetError,
						fieldId: x.param as FormFields,
						error: x.msg,
					})
				);
				dispatchForm({
					type: FormActionTypes.SetFormError,
					error: httpError.getMessage(),
				});
				setSuccess(false);
			}
		}
		isMounted.current && setLoading(false);
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
					<View style={styles.inputContainer}>
						<Input
							style={styles.input}
							label="Old Password"
							name="oldPassword"
							secureTextEntry
							returnKeyType="next"
							returnKeyLabel="next"
							onSubmitEditing={() => passwordInpRef!.current!.focus()}
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
						{(formState.formError !== null || success) && (
							<NotificationCard
								severity={formState.formError ? 'error' : 'success'}
							>
								{formState.formError
									? formState.formError
									: 'Password changed successfully.'}
							</NotificationCard>
						)}
					</View>
					<View style={{ flexDirection: 'row' }}>
						<CustomButton
							accent
							onPress={navigation.goBack}
							disabled={loading}
						>
							CANCEL
						</CustomButton>
						<CustomButton onPress={submitHandler} loading={loading}>
							SAVE
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
		marginVertical: 4,
	},
	input: {
		fontSize: 16,
		height: 50,
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
