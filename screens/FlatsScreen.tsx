import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const FlatsScreen = () => {
	return (
		<View style={styles.container}>
			<Text>Flats screen</Text>
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