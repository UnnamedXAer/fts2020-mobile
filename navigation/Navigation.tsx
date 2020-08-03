import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import {
	createStackNavigator,
	HeaderBackButton,
} from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import FlatsScreen from '../screens/Flat/FlatsScreen';
import RootState from '../store/storeTypes';
import User from '../models/user';
import { tryAuthorize, logOut } from '../store/actions/auth';
import LoadingScreen from '../screens/Auth/LoadingScreen';
import { navigationContainerTheme } from '../config/theme';
import {
	ProfileStackParamList,
	DrawerParamList,
	BottomTabParamList,
	RootStackParamList,
} from '../types/navigationTypes';
import TaskDetailsScreen from '../screens/Task/TaskDetailsScreen';
import NewFlatInfoScreen from '../screens/Flat/NewFlat/NewFlatInfoScreen';
import NewFlatScreen from '../screens/Flat/NewFlat/NewFlatScreen';
import NewTaskNameScreen from '../screens/NewTask/NewTaskNameScreen';
import NewTaskTimeScreen from '../screens/NewTask/NewTaskTimeScreen';
import UpdateTaskMembersScreen from '../screens/Task/UpdateTaskMembersScreen';
import UserTasksScreen from '../screens/Task/UserTasksScreen';
import { readSaveShowInactive } from '../store/actions/tasks';
import FlatDetailsScreen from '../screens/Flat/FlatDetailsScreen';
import InviteMembersScreen from '../screens/Flat/NewFlat/InviteMembersScreen';
import LogInScreen from '../screens/Auth/LogInScreen';
import RegistrationScreen from '../screens/Auth/RegistrationScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import ChangePasswordScreen from '../screens/Auth/ChangePasswordScreen';
import CurrentPeriodsScreen from '../screens/CurrentPeriods/CurrentPeriodsScreen';
import AboutScreen from '../screens/About/AboutScreen';
import { NewTaskTimeScreenNavigationProp } from '../types/rootNavigationTypes';
import { NewTaskTimeScreenRouteProps } from '../types/rootRoutePropTypes';

const Drawer = createDrawerNavigator<DrawerParamList>();
const DrawerNavigator = ({ loggedUser }: { loggedUser: User }) => {
	return (
		<Drawer.Navigator initialRouteName="RootStack">
			<Drawer.Screen
				name="RootStack"
				options={{ title: 'Flats & Tasks' }}
				component={RootStackNavigator}
			/>
			<Drawer.Screen name="ProfileStack" options={{ title: 'Profile' }}>
				{(props) => (
					<ProfileStackNavigator {...props} loggedUser={loggedUser} />
				)}
			</Drawer.Screen>
			<Drawer.Screen
				name="About"
				options={{ title: 'About' }}
				component={AboutScreen}
			/>
			<Drawer.Screen name="SignOut" options={{ title: 'Sign Out' }}>
				{() => {
					const dispatch = useDispatch();
					console.log('logged out');
					useEffect(() => {
						(async () => await dispatch(logOut()))();
					}, []);
					return null;
				}}
			</Drawer.Screen>
		</Drawer.Navigator>
	);
};

const BottomTab = createMaterialBottomTabNavigator<BottomTabParamList>();
const BottomTabNavigator = () => {
	return (
		<BottomTab.Navigator>
			<BottomTab.Screen
				name="UserTasks"
				options={{ title: 'Your Tasks' }}
				component={UserTasksScreen}
			/>
			<BottomTab.Screen
				name="Flats"
				options={{ title: 'Your Flats' }}
				component={FlatsScreen}
			/>
			<BottomTab.Screen
				name="CurrentPeriods"
				options={{ title: 'Your Current Periods' }}
				component={CurrentPeriodsScreen}
			/>
		</BottomTab.Navigator>
	);
};

const RootStack = createStackNavigator<RootStackParamList>();
const RootStackNavigator = () => {
	return (
		<RootStack.Navigator initialRouteName="BottomTab">
			<RootStack.Screen
				name="BottomTab"
				options={{ title: 'FTS 2020' }}
				component={BottomTabNavigator}
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
				options={(props) => ({
					title: 'Invite Members',
					headerLeft: (btnProps) => (
						<HeaderBackButton
							{...btnProps}
							onPress={
								props.route.params.isNewFlat
									? () =>
											props.navigation.replace(
												'FlatDetails',
												{
													id:
														props.route.params
															.flatId,
												}
											)
									: btnProps.onPress
							}
						/>
					),
				})}
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
				options={({
					navigation,
					route: { params },
				}: {
					navigation: NewTaskTimeScreenNavigationProp;
					route: NewTaskTimeScreenRouteProps;
				}) => {
					return {
						title: 'New Task',
						headerLeft: (bntProps) => (
							<HeaderBackButton
								{...bntProps}
								onPress={() =>
									navigation.replace('NewTaskName', {
										...params,
									})
								}
							/>
						),
					};
				}}
				component={NewTaskTimeScreen}
			/>
			<RootStack.Screen
				name="UpdateTaskMembers"
				options={(props) => ({
					title: props.route.params.newTask
						? 'New Task'
						: 'Update Task',
					headerLeft: (btnProps) => (
						<HeaderBackButton
							{...btnProps}
							onPress={
								props.route.params.newTask
									? () =>
											props.navigation.replace(
												'TaskDetails',
												{
													id: props.route.params.id,
												}
											)
									: btnProps.onPress
							}
						/>
					),
				})}
				component={UpdateTaskMembersScreen}
			/>
		</RootStack.Navigator>
	);
};

const ProfileStack = createStackNavigator<ProfileStackParamList>();
const ProfileStackNavigator = ({
	navigation,
	loggedUser,
}: {
	navigation: any;
	loggedUser: User;
}) => {
	return (
		<ProfileStack.Navigator>
			<ProfileStack.Screen
				name="Profile"
				initialParams={{ id: loggedUser.id }}
				options={{
					title: 'View Profile',
					headerLeft: (props) => (
						<HeaderBackButton
							{...props}
							onPress={() => navigation.goBack()}
						/>
					),
				}}
				component={ProfileScreen}
			/>
			<ProfileStack.Screen
				name="ChangePassword"
				options={{
					title: 'Change Password',
				}}
				component={ChangePasswordScreen}
			/>
		</ProfileStack.Navigator>
	);
};

const AppNavitaionContainer = () => {
	const [loading, setLoading] = useState(true);
	const loggedUser = useSelector<RootState, User | null>(
		(state) => state.auth.user
	);
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
				<DrawerNavigator loggedUser={loggedUser} />
			) : isLogIn ? (
				<LogInScreen
					toggleAuthScreen={() =>
						setIsLogIn((prevState) => !prevState)
					}
				/>
			) : (
				<RegistrationScreen
					toggleAuthScreen={() =>
						setIsLogIn((prevState) => !prevState)
					}
				/>
			)}
		</NavigationContainer>
	);
};

export default AppNavitaionContainer;
