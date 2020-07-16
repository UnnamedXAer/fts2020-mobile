import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import Header from '../../components/UI/Header';

const LoadingScreen = () => {
	return (
		<View
			style={{
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<ActivityIndicator size="large" />
			<Header style={{
				marginTop: 30
			}}>FTS 2020</Header>
		</View>
	);
};

export default LoadingScreen;
