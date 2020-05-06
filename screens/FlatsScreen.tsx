import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { logOut } from '../store/actions/auth';

const FlatsScreen = () => {
	const dispatch = useDispatch();
	return (
		<View style={styles.container}>
			<Text>Flats screen</Text>
			<Button onPress={() => dispatch(logOut())}>Log Out</Button>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
	  flex: 1,
	  backgroundColor: '#fff',
	  alignItems: 'center',
	  justifyContent: 'center',
	},
  });

export default FlatsScreen;