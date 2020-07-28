import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
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
import ProfileScreen from '../screens/Profile/ProfileScreen';
import ChangePasswordScreen from '../screens/Auth/ChangePasswordScreen';
import CurrentPeriodsScreen from '../screens/CurrentPeriods/CurrentPeriodsScreen';
import AboutScreen from '../screens/About/AboutScreen';
import { TouchableWithoutFeedback } from 'react-native';

const Drawer = createDrawerNavigator /*<DrawerParamList>*/();
const DrawerNavigator = ({ loggedUser }: { loggedUser: User }) => {
	return (
		<Drawer.Navigator>
			<Drawer.Screen
				name="FlatsAndTasks"
				options={{ title: 'Flats & Tasks' }}
				component={BottomTabNavigator}
			/>
			<Drawer.Screen name="ProfileStack" options={{ title: 'Profile' }}>
				{() => <ProfileStackNavigator loggedUser={loggedUser} />}
			</Drawer.Screen>
			<Drawer.Screen
				name="About"
				options={{ title: 'About' }}
				component={AboutScreen}
			/>
			<Drawer.Screen
				name="SignOut"
				options={{ title: 'Sign Out' }}

				// component={() => (
				// 	<TouchableWithoutFeedback
				// 		onPress={
				// 			() =>{
				// 				console.log(
				// 					'logged out'
				// 				) /*dispatch(logOut()*)*/}
				// 		}
				// )} />
			>
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

const BottomTab = createBottomTabNavigator /*<BottomTabParamList>*/();
const BottomTabNavigator = () => {
	return (
		<BottomTab.Navigator>
			<BottomTab.Screen
				name="UserTasks"
				options={{ title: 'Your Tasks' }}
				component={RootStackNavigator}
			/>
			<BottomTab.Screen
				name="Flats"
				options={{ title: 'Your Flats' }}
				component={RootStackNavigator}
			/>
			<BottomTab.Screen
				name="CurrentPeriods"
				options={{ title: 'Your Current Periods' }}
				component={CurrentPeriodsScreen}
			/>
		</BottomTab.Navigator>
	);
};

// const FlatsStack = createStackNavigator /*<FlatsStackParamList>*/();
// const FlatsStackNavigator = () => {
// 	return (
// 		<FlatsStack.Navigator initialRouteName="Flats">
// 			<FlatsStack.Screen
// 				name="Flats"
// 				options={{ title: 'Your Flats' }}
// 				component={FlatsScreen}
// 			/>
// 			<FlatsStack.Screen
// 				name="FlatDetails"
// 				options={{ title: 'View Flat' }}
// 				component={FlatDetailsScreen}
// 			/>
// 			<FlatsStack.Screen
// 				name="NewFlatInfo"
// 				options={{ title: 'Add Flat' }}
// 				component={NewFlatInfoScreen}
// 			/>
// 			<FlatsStack.Screen
// 				name="NewFlat"
// 				options={{ title: 'Add Flat' }}
// 				component={NewFlatScreen}
// 			/>
// 			<FlatsStack.Screen
// 				name="InviteMembers"
// 				options={{ title: 'Invite Members' }}
// 				component={InviteMembersScreen}
// 			/>
// 		</FlatsStack.Navigator>
// 	);
// };

// const TasksStack = createStackNavigator /*<TasksStackParamList>*/();
// const TasksStackNavigator = () => {
// 	return (
// 		<TasksStack.Navigator initialRouteName="UserTasks">
// 			<TasksStack.Screen
// 				name="UserTasks"
// 				options={{ title: 'Your Tasks' }}
// 				component={UserTasksScreen}
// 			/>
// 			<TasksStack.Screen
// 				name="TaskDetails"
// 				options={{ title: 'View Task' }}
// 				component={TaskDetailsScreen}
// 			/>
// 			<TasksStack.Screen
// 				name="NewTaskName"
// 				options={{ title: 'New Task' }}
// 				component={NewTaskNameScreen}
// 			/>
// 			<TasksStack.Screen
// 				name="NewTaskTime"
// 				options={{ title: 'New Task' }}
// 				component={NewTaskTimeScreen}
// 			/>
// 			<TasksStack.Screen
// 				name="NewTaskMembers"
// 				options={(props) => ({
// 					title: ((props.route.params as unknown) as {
// 						newTask: boolean;
// 					}).newTask
// 						? 'New Task'
// 						: 'Update Task',
// 				})}
// 				component={NewTaskMembersScreen}
// 			/>
// 		</TasksStack.Navigator>
// 	);
// };

const ProfileStack = createStackNavigator /*<ProfileStackParamList>*/();
const ProfileStackNavigator = ({ loggedUser }: { loggedUser: User }) => {
	return (
		<ProfileStack.Navigator initialRouteName="Profile">
			<ProfileStack.Screen
				name="ProfileDetails"
				initialParams={{ id: loggedUser.id }}
				options={{
					title: 'View Profile',
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
			initialRouteName="Flats"
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
					title: props.route.params.newTask
						? 'New Task'
						: 'Update Task',
				})}
				component={NewTaskMembersScreen}
			/>
			{/* <RootStack.Screen
				name="Profile"
				options={{
					title: 'View Profile',
				}}
				component={ProfileScreen}
			/>
			<RootStack.Screen
				name="ChangePassword"
				options={{
					title: 'Change Password',
				}}
				component={ChangePasswordScreen}
			/> */}
		</RootStack.Navigator>
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
