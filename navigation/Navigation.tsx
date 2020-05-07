import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FlatsScreen from '../screens/FlatsScreen';
import LogInScreen from '../screens/LogInScreen';
import RootState from '../store/storeTypes';
import User from '../models/user';
import { tryAuthorize } from '../store/actions/auth';
import LoadingScreen from '../screens/LoadingScreen';
import RegistrationScreen from '../screens/RegistrationScreen';

const FlatsStack = createStackNavigator();
const FlatsStackNavigator = () => (
	<FlatsStack.Navigator>
		<FlatsStack.Screen name="Flats" component={FlatsScreen} />
	</FlatsStack.Navigator>
);

const AppNavitaionContainer = () => {
	const [loading, setLoading] = useState(true);
	const loggedUser = useSelector<RootState, User | null>((state) => state.auth.user);
	const [isLogIn, setIsLogIn] = useState(true);
	const dispatch = useDispatch();

	useEffect(() => {
		if (!loggedUser) {
			const tryRestoreSession = async () => {
				try {
					await dispatch(tryAuthorize());
				} catch (err) {}
				setLoading(false);
			};
			tryRestoreSession();
		} else {
			setLoading(false);
		}
	}, [loggedUser]);

	return (
		<NavigationContainer>
			{loading ? (
				<LoadingScreen />
			) : loggedUser ? (
				<FlatsStackNavigator />
			) : isLogIn ? (
				<LogInScreen
					toggleAuthScreen={() => setIsLogIn((prevState) => !prevState)}
				/>
			) : (
				<RegistrationScreen
					toggleAuthScreen={() => setIsLogIn((prevState) => !prevState)}
				/>
			)}
		</NavigationContainer>
	);
};

export default AppNavitaionContainer;
