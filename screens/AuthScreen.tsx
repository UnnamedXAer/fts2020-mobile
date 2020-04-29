import React, { useState, useRef, RefObject, MutableRefObject } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { HelperText, Theme, withTheme } from 'react-native-paper';
import Header from '../components/UI/Header';
import { checkEmailAddress } from '../utils/validation';
import Input from '../components/UI/Input';
import CustomButton from '../components/UI/CustomButton';

interface Props {
	theme: Theme;
}

const AuthScreen: React.FC<Props> = ({ theme }) => {
	const [loading, setLoading] = useState(false);
	const [emailAddress, setEmailAddress] = useState('');
	const [emailAddressTouched, setEmailAddressTouched] = useState(false);
	const [isEmailAddressValid, setIsEmailAddressValid] = useState(true);
	const [password, setPassword] = useState('');
	const [passwordTouched, setPasswordTouched] = useState(false);
	const [isPasswordValid, setIsPasswordValid] = useState(true);

	const passwordInpRef: MutableRefObject<TextInput | undefined> = useRef();

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

	const submitHandler = () => {
		const email = emailAddress.trim();
		const isEmailValid = checkEmailAddress(email);
		const isPwdValid = password.length > 0;

		setIsPasswordValid(isPwdValid);
		setPasswordTouched(true);
		setIsEmailAddressValid(isEmailValid);
		setEmailAddressTouched(true);

		if (!isEmailValid || !isPwdValid) {
			return;
		}

		setLoading(true);
		setTimeout(() => {
			setLoading(false);
		}, 1300);
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
					onBlur={() => inputBlurHandler()}
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
					error={!isPasswordValid}
					disabled={loading}
					onChangeText={passwordChangeHandler}
				/>
				<HelperText type="error" visible={passwordTouched && !isPasswordValid}>
					Please enter Password.
				</HelperText>
			</View>
			<View>
				<CustomButton
					disabled={loading || !isEmailAddressValid}
					onPress={submitHandler}
					loading={loading}
				>
					Sign In
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
		paddingTop: 20,
		fontSize: 44,
	},
	inputContainer: {
		width: '90%',
		maxWidth: 400,
		marginVertical: 16,
	},
	input: {
		fontSize: 24,
	},
});

export default withTheme(AuthScreen);
