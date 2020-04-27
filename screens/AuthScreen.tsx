import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, TouchableHighlight } from 'react-native';
import { HelperText, Theme, withTheme, TouchableRipple, Text } from 'react-native-paper';
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

	const emailAddressTextChangeHandler = (txt: string) => {
		setEmailAddress(txt);
		const isValid = checkEmailAddress(txt.trim());
		setIsEmailAddressValid(isValid);
	};

	const emailAddressBlurHandler = () => {
		setEmailAddressTouched(true);
	};

	const passwordChangeHandler = (txt: string) => {
		setPassword(txt);
	};

	const submitHandler = () => {
		const email = emailAddress.trim();
		const isValid = checkEmailAddress(email);
		// if (!isValid) {
		// 	setIsEmailAddressValid(isValid);
		// 	return;
		// }
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
		}, 1300);
	};

	return (
		<View style={[styles.screen, {}, { backgroundColor: theme.colors.surface }]}>
			<Header style={styles.header}>Sign In</Header>
			<View style={styles.inputContainer}>
				<Input
					style={styles.input}
					label="Email Address"
					value={emailAddress}
					error={emailAddressTouched && !isEmailAddressValid}
					disabled={loading}
					onChangeText={emailAddressTextChangeHandler}
					onBlur={() => emailAddressBlurHandler()}
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
					value={password}
					disabled={loading}
					onChangeText={passwordChangeHandler}
				/>
				<HelperText
					type="error"
					visible={emailAddressTouched && !isEmailAddressValid}
				>
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
