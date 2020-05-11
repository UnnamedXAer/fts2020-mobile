import React, { useState, useRef, MutableRefObject } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { HelperText, Theme, withTheme, Button } from 'react-native-paper';
import Header from '../components/UI/Header';
import { checkEmailAddress } from '../utils/validation';
import Input from '../components/UI/Input';
import CustomButton from '../components/UI/CustomButton';
import { StateError } from '../store/ReactTypes/customReactTypes';
import NotificationCard from '../components/UI/NotificationCard';
import { useDispatch } from 'react-redux';
import { authorize } from '../store/actions/auth';
import { Credentials } from '../models/auth';
import HttpErrorParser from '../utils/parseError';
import useForm, { FormActionTypes } from '../hooks/useForm';

interface Props {
	theme: Theme;
	toggleAuthScreen: () => void;
}

const formFields = ['emailAddress', 'password'];

const LogInScreen: React.FC<Props> = ({ theme, toggleAuthScreen }) => {
	const [loading, setLoading] = useState(false);
	const [emailAddress, setEmailAddress] = useState('');
	const [emailAddressTouched, setEmailAddressTouched] = useState(false);
	const [isEmailAddressValid, setIsEmailAddressValid] = useState(false);
	const [password, setPassword] = useState('');
	const [passwordTouched, setPasswordTouched] = useState(false);
	const [isPasswordValid, setIsPasswordValid] = useState(false);
	const [error, setError] = useState<StateError>(null);

	const [formState, dispatchForm] = useForm(formFields);

	const dispatch = useDispatch();

	const passwordInpRef: MutableRefObject<TextInput | undefined> = useRef();

	const fieldTextChangeHandler = (fieldName: string, txt: string) => {
		dispatchForm({
			fieldId: fieldName,
			value: txt,
			type: FormActionTypes.UpdateValue
		});

		const error = validateFormField(fieldName, txt);
		dispatchForm({
			type: FormActionTypes.SetError,
			error: error
		});
	};

	const emailAddressTextChangeHandler = (txt: string) => {
		setEmailAddress(txt);
		const isValid = checkEmailAddress(txt.trim());
		setIsEmailAddressValid(isValid);
	};

	const inputBlurHandler = (name: 'password' | 'emailAddress') => {
		if (name === 'emailAddress') setEmailAddressTouched(true);
		else setPasswordTouched(true);
	};

	const passwordChangeHandler = (txt: string) => {
		setIsPasswordValid(txt.length > 0);
		setPassword(txt);
	};

	const submitHandler = async () => {
		setError(null);
		const email = emailAddress.trim();
		const isEmailValid = checkEmailAddress(email);
		const isPwdValid = password.length > 0;

		setIsPasswordValid(isPwdValid);
		setPasswordTouched(true);
		setIsEmailAddressValid(isEmailValid);
		setEmailAddressTouched(true);

		if (!isEmailValid || !isPwdValid) {
			setError('Correct the form.');
			return;
		}
		setLoading(true);

		const credentianls = new Credentials({
			emailAddress: emailAddress,
			password: password,
		});

		try {
			await dispatch(authorize(credentianls, true));
		} catch (err) {
			const error = new HttpErrorParser(err);
			const msg = error.getMessage();
			setError(msg);
			setLoading(false);
		}
	};

	return (
		<View style={[styles.screen, { backgroundColor: theme.colors.surface }]}>
			<Header style={styles.header}>Sign In</Header>
			<View style={styles.inputContainer}>
				<Input
					style={styles.input}
					label="Email Address"
					keyboardType="email-address"
					returnKeyType="next"
					returnKeyLabel="next"
					onSubmitEditing={() => passwordInpRef!.current!.focus()}
					value={emailAddress}
					error={emailAddressTouched && !isEmailAddressValid}
					disabled={loading}
					onChangeText={emailAddressTextChangeHandler}
					onBlur={() => inputBlurHandler('emailAddress')}
				/>
				<HelperText
					type="error"
					visible={emailAddressTouched && !isEmailAddressValid}
				>
					{emailAddress === ''
						? 'Please enter Email Address'
						: 'Email Address is invalid'}
					.
				</HelperText>
			</View>
			<View style={styles.inputContainer}>
				<Input
					style={styles.input}
					label="Password"
					secureTextEntry
					returnKeyType="done"
					returnKeyLabel="Submit"
					onSubmitEditing={submitHandler}
					ref={passwordInpRef as MutableRefObject<TextInput>}
					value={password}
					error={passwordTouched && !isPasswordValid}
					disabled={loading}
					onChangeText={passwordChangeHandler}
					onBlur={() => inputBlurHandler('password')}
				/>
				<HelperText type="error" visible={passwordTouched && !isPasswordValid}>
					Please enter Password.
				</HelperText>
			</View>
			<View style={styles.errorContainer}>
				{error !== null && (
					<NotificationCard serverity="error">{error}</NotificationCard>
				)}
			</View>
			<View style={styles.linkContainer}>
				<Button onPress={toggleAuthScreen}>Switch to SIGN UP</Button>
			</View>
			<View>
				<CustomButton
					disabled={loading || !isEmailAddressValid}
					onPress={submitHandler}
					loading={loading}
				>
					SIGN IN
				</CustomButton>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	screen: {
		paddingTop: 100,
		flex: 1,
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
	},
});

export default withTheme(LogInScreen);
