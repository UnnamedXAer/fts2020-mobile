import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FlatsScreen from '../screens/FlatsScreen';
import LogInScreen from '../screens/LogInScreen';
import RootState from '../store/storeTypes';
import User from '../models/user';
import { tryAuthorize, logOut } from '../store/actions/auth';
import LoadingScreen from '../screens/LoadingScreen';
import RegistrationScreen from '../screens/RegistrationScreen';
import FlatDetailsScreen from '../screens/FlatDetailsScreen';
import { navigationContainerTheme } from '../config/theme';
import Link from '../components/UI/Link';
import { RootStackParamList } from '../types/types';
import TaskDetailsScreen from '../screens/TaskDetailsScreen';
import NewFlatInfoScreen from '../screens/NewFlatInfoScreen';
import NewFlatScreen from '../screens/NewFlatScreen';
import InviteMembersScreen from '../screens/InviteMembersScreen';

const RootStack = createStackNavigator<RootStackParamList>();
const RootStackNavigator = () => {
	const dispatch = useDispatch();
	return (
		<RootStack.Navigator
			screenOptions={{
				headerRight: (props) => <Link onPress={() => dispatch(logOut())}>L</Link>,
			}}
		>
			<RootStack.Screen
				name="Flats"
				options={{ title: 'Your Flats' }}
				component={FlatsScreen}
			/>
			<RootStack.Screen
				name="FlatDetails"
				options={{ title: 'View Flat' }}
				component={FlatDetailsScreen}
			/>
			<RootStack.Screen
				name="NewFlatInfo"
				options={{ title: 'Add Flat' }}
				component={NewFlatInfoScreen}
			/>
			<RootStack.Screen
				name="NewFlat"
				options={{ title: 'Add Flat' }}
				component={NewFlatScreen}
			/>
			<RootStack.Screen
				name="InviteMembers"
				options={{ title: 'Invite Members' }}
				component={InviteMembersScreen}
			/>
			<RootStack.Screen
				name="TaskDetails"
				options={{ title: 'View Task' }}
				component={TaskDetailsScreen}
			/>
		</RootStack.Navigator>
	);
};

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
		<NavigationContainer theme={navigationContainerTheme}>
			{loading ? (
				<LoadingScreen />
			) : loggedUser ? (
				<RootStackNavigator />
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
