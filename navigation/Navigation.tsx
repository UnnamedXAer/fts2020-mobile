import 'react-native-gesture-handler';
import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FlatsScreen from '../screens/FlatsScreen';
import AuthScreen from '../screens/AuthScreen';
import RootState from '../store/storeTypes';
import User from '../models/user';

const FlatsStack = createStackNavigator();
const FlatsStackNavigator = () => (
	<FlatsStack.Navigator>
		<FlatsStack.Screen name="Flats" component={FlatsScreen} />
	</FlatsStack.Navigator>
);

const AuthStack = createStackNavigator();
const AuthStackNavigator = () => {
	return (
		<AuthStack.Navigator>
			<AuthStack.Screen name="SignIn" component={AuthScreen} />
		</AuthStack.Navigator>
	);
};

const AppNavitaionContainer = () => {
	const loggedUser = useSelector<RootState, User | null>((state) => state.auth.user);

	return (
		<NavigationContainer>
			{loggedUser ? <FlatsStackNavigator /> : <AuthStackNavigator />}
		</NavigationContainer>
	);
};

export default AppNavitaionContainer;
