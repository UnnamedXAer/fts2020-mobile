import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator, TextInput, Title, Avatar, Button } from 'react-native-paper';

const AuthScreen = () => {

    const [loading, setLoading] = useState(false);
    const [emailAddress, setEmailAddress] = useState('');
    const [emailAddressError, setEmailAddressError] = useState(null);


	return (
		<View>
			<Title>Sign In</Title>
			<View>
				<View>
					<TextInput placeholder="Email Address" value={emailAddress} error={!!emailAddressError} disabled={loading} />
                    
				</View>
			</View>
            <View>
                <Button disabled={loading}>Sign In</Button>
            </View>
		</View>
	);
};

const styles = StyleSheet.create({
    
});
export default AuthScreen;
