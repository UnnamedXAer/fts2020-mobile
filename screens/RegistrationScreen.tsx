import React, { useState, useRef, MutableRefObject } from 'react';
import { StyleSheet, View, TextInput, ScrollView } from 'react-native';
import { HelperText, Theme, withTheme } from 'react-native-paper';
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

interface Props {
	theme: Theme;
	toggleAuthScreen: () => void;
}

const RegistrationScreen: React.FC<Props> = ({ theme, toggleAuthScreen }) => {
	const [loading, setLoading] = useState(false);
	const [emailAddress, setEmailAddress] = useState('');
	const [emailAddressTouched, setEmailAddressTouched] = useState(false);
	const [isEmailAddressValid, setIsEmailAddressValid] = useState(false);
	const [password, setPassword] = useState('');
	const [passwordTouched, setPasswordTouched] = useState(false);
	const [isPasswordValid, setIsPasswordValid] = useState(false);
	const [confirmPassword, setConfirmPassword] = useState('');
	const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
	const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false);

	const [error, setError] = useState<StateError>(null);

	const dispatch = useDispatch();

	const passwordInpRef: MutableRefObject<TextInput | undefined> = useRef();
	const confirmPasswordInpRef: MutableRefObject<TextInput | undefined> = useRef();

	const emailAddressTextChangeHandler = (txt: string) => {
		setEmailAddress(txt);
		const isValid = checkEmailAddress(txt.trim());
		setIsEmailAddressValid(isValid);
	};

	const inputBlurHandler = (name: 'password' | 'emailAddress' | 'confirmPassword') => {
		if (name === 'emailAddress') setEmailAddressTouched(true);
		else if (name === 'confirmPassword') setConfirmPasswordTouched(true);
		else setPasswordTouched(true);
	};

	const passwordChangeHandler = (txt: string) => {
		setIsPasswordValid(txt.length > 0);
        setPassword(txt);
        if (confirmPasswordTouched) {
            setIsConfirmPasswordValid(txt === confirmPassword);
        }
    };
    
    const confirmPasswordChangeHandler = (txt: string) => {
		setIsConfirmPasswordValid(txt === password);
		setConfirmPassword(txt);
	};

	const submitHandler = async () => {
		setError(null);
		const email = emailAddress.trim();
		const isEmailValid = checkEmailAddress(email);
        const isPwdValid = password.length > 0;
        const isConfirmPwdValid = password === confirmPassword;

		setIsPasswordValid(isPwdValid);
        setPasswordTouched(true);
        setIsConfirmPasswordValid(isConfirmPwdValid);
        setConfirmPasswordTouched(true);
		setIsEmailAddressValid(isEmailValid);
		setEmailAddressTouched(true);

		if (!isEmailValid || !isPwdValid || !isConfirmPwdValid) {
			setError('Correct the form.');
			return;
		}
		setLoading(true);

		const credentianls = new Credentials({
			emailAddress: emailAddress,
            password: password,
            confirmPassword: confirmPassword
		});

		try {
			await dispatch(authorize(credentianls, false));
		} catch (err) {
			const error = new HttpErrorParser(err);
			const msg = error.getMessage();
			setError(msg);
			setLoading(false);
		}
	};

	return (
		<ScrollView contentContainerStyle={[styles.screen, { backgroundColor: theme.colors.surface }]}>
			<Header style={styles.header}>Sign Up</Header>
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
					returnKeyType="next"
					returnKeyLabel="next"
					onSubmitEditing={() => confirmPasswordInpRef!.current!.focus()}
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
			<View style={styles.inputContainer}>
				<Input
					style={styles.input}
					label="Confirm Password"
					secureTextEntry
					returnKeyType="done"
					returnKeyLabel="Submit"
					onSubmitEditing={submitHandler}
					ref={confirmPasswordInpRef as MutableRefObject<TextInput>}
					value={confirmPassword}
					error={confirmPasswordTouched && !isConfirmPasswordValid}
					disabled={loading}
					onChangeText={confirmPasswordChangeHandler}
					onBlur={() => inputBlurHandler('confirmPassword')}
				/>
				<HelperText type="error" visible={confirmPasswordTouched && !isConfirmPasswordValid}>
					Passwords do not match.
				</HelperText>
			</View>
			<View style={styles.errorContainer}>
				{error !== null && (
					<NotificationCard serverity="error">{error}</NotificationCard>
				)}
			</View>
			<View>
				<CustomButton
					disabled={loading || !isEmailAddressValid || !isPasswordValid || !isConfirmPasswordValid}
					onPress={submitHandler}
					loading={loading}
				>
					Sign Up
				</CustomButton>
			</View>
		</ScrollView>
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
});

export default withTheme(RegistrationScreen);
