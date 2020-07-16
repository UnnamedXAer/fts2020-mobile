import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FlatsScreen from '../screens/Flat/FlatsScreen';
import RootState from '../store/storeTypes';
import User from '../models/user';
import { tryAuthorize, logOut } from '../store/actions/auth';
import LoadingScreen from '../screens/Auth/LoadingScreen';
import { navigationContainerTheme } from '../config/theme';
import Link from '../components/UI/Link';
import { RootStackParamList } from '../types/navigationTypes';
import TaskDetailsScreen from '../screens/Task/TaskDetailsScreen';
import NewFlatInfoScreen from '../screens/Flat/NewFlat/NewFlatInfoScreen';
import NewFlatScreen from '../screens/Flat/NewFlat/NewFlatScreen';
import NewTaskNameScreen from '../screens/NewTask/NewTaskNameScreen';
import NewTaskTimeScreen from '../screens/NewTask/NewTaskTimeScreen';
import NewTaskMembersScreen from '../screens/Task/TaskMembersUpdateScreen';
import UserTasksScreen from '../screens/Task/UserTasksScreen';
import { readSaveShowInactive } from '../store/actions/tasks';
import FlatDetailsScreen from '../screens/Flat/FlatDetailsScreen';
import InviteMembersScreen from '../screens/Flat/NewFlat/InviteMembersScreen';
import LogInScreen from '../screens/Auth/LogInScreen';
import RegistrationScreen from '../screens/Auth/RegistrationScreen';

const RootStack = createStackNavigator<RootStackParamList>();
const RootStackNavigator = () => {
	const dispatch = useDispatch();
	const loggedUser = useSelector((state: RootState) => state.auth.user!);
	return (
		<RootStack.Navigator
			screenOptions={{
				headerRight: (props) => (
					<Link onPress={() => dispatch(logOut())}>
						{loggedUser.emailAddress}
					</Link>
				),
			}}
			initialRouteName="UserTasks"
		>
			<RootStack.Screen
				name="Flats"
				options={{ title: 'Your Flats' }}
				component={FlatsScreen}
			/>
			<RootStack.Screen
				name="UserTasks"
				options={{ title: 'Your Tasks' }}
				component={UserTasksScreen}
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
			<RootStack.Screen
				name="NewTaskName"
				options={{ title: 'New Task' }}
				component={NewTaskNameScreen}
			/>
			<RootStack.Screen
				name="NewTaskTime"
				options={{ title: 'New Task' }}
				component={NewTaskTimeScreen}
			/>
			<RootStack.Screen
				name="NewTaskMembers"
				options={(props) => ({
					title: props.route.params.newTask ? 'New Task' : 'Update Task',
				})}
				component={NewTaskMembersScreen}
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
			dispatch(readSaveShowInactive());
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
