import 'react-native-gesture-handler';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createDrawerNavigator, DrawerNavigationProp } from '@react-navigation/drawer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Linking } from 'expo';
import FlatsScreen from '../screens/Flat/FlatsScreen';
import RootState from '../store/storeTypes';
import User from '../models/user';
import { tryAuthorize } from '../store/actions/auth';
import LoadingScreen from '../screens/Auth/LoadingScreen';
import { navigationContainerTheme } from '../config/theme';
import {
	ProfileStackParamList,
	DrawerParamList,
	BottomTabParamList,
	RootStackParamList,
	InvitationsStackParamList,
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
import LogInScreen, { ExternalProvider } from '../screens/Auth/LogInScreen';
import RegistrationScreen from '../screens/Auth/RegistrationScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import ChangePasswordScreen from '../screens/Auth/ChangePasswordScreen';
import CurrentPeriodsScreen from '../screens/CurrentPeriods/CurrentPeriodsScreen';
import AboutScreen from '../screens/About/AboutScreen';
import {
	NewTaskTimeScreenNavigationProp,
	InviteMembersScreenNavigationProp,
} from '../types/rootNavigationTypes';
import {
	NewTaskTimeScreenRouteProps,
	InviteMembersScreenRouteProps,
} from '../types/rootRoutePropTypes';
import InvitationsScreen from '../screens/Invitations/InvitationsScreen';
import DrawerContent, { RedirectTo } from './DrawerContent';
import { setAppLoading } from '../store/actions/app';
import InvitationDetailsScreen from '../screens/Invitations/InvitationDetailsScreen';
import { Provider } from '../store/apiTypes';

const Drawer = createDrawerNavigator<DrawerParamList>();
const DrawerNavigator = ({
	loggedUser,
	redirectTo,
}: {
	loggedUser: User;
	redirectTo: RedirectTo | null;
}) => {
	return (
		<Drawer.Navigator
			initialRouteName="RootStack"
			drawerContent={(props) => (
				<DrawerContent
					{...props}
					loggedUser={loggedUser}
					redirectTo={redirectTo}
				/>
			)}
		>
			<Drawer.Screen
				name="RootStack"
				options={{ title: 'Flats & Tasks' }}
				component={RootStackNavigator}
			/>
			<Drawer.Screen
				name="InvitationsStack"
				options={{ title: 'Invitations' }}
				component={InvitationsStackNavigator}
			/>
			<Drawer.Screen name="ProfileStack" options={{ title: 'Profile' }}>
				{(props) => <ProfileStackNavigator {...props} loggedUser={loggedUser} />}
			</Drawer.Screen>
			<Drawer.Screen
				name="About"
				options={{ title: 'About' }}
				component={AboutScreen}
			/>
		</Drawer.Navigator>
	);
};

const BottomTab = createMaterialBottomTabNavigator<BottomTabParamList>();
const BottomTabNavigator = () => {
	return (
		<BottomTab.Navigator>
			<BottomTab.Screen
				name="UserTasks"
				options={{ title: 'Your Tasks', tabBarIcon: 'all-inclusive' }}
				component={UserTasksScreen}
			/>
			<BottomTab.Screen
				name="Flats"
				options={{ title: 'Your Flats', tabBarIcon: 'home-city-outline' }}
				component={FlatsScreen}
			/>
			<BottomTab.Screen
				name="CurrentPeriods"
				options={{
					title: 'Your Current Periods',
					tabBarIcon: 'format-list-checks',
				}}
				component={CurrentPeriodsScreen}
			/>
		</BottomTab.Navigator>
	);
};

const RootStack = createStackNavigator<RootStackParamList>();
const RootStackNavigator = ({
	navigation,
}: {
	navigation: DrawerNavigationProp<DrawerParamList>;
}) => {
	return (
		<RootStack.Navigator initialRouteName="BottomTab">
			<RootStack.Screen
				name="BottomTab"
				options={{
					title: 'FTS 2020',
					headerLeft: (headerLeftProps) => {
						return (
							<HeaderBackButton
								{...headerLeftProps}
								backImage={(props) => (
									<MaterialCommunityIcons
										name="menu"
										color={props.tintColor}
										size={24}
										style={{
											padding: 4,
										}}
									/>
								)}
								onPress={() => navigation.openDrawer()}
								label="Menu"
								truncatedLabel="M"
							/>
						);
					},
				}}
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
				options={({
					navigation,
					route,
				}: {
					navigation: InviteMembersScreenNavigationProp;
					route: InviteMembersScreenRouteProps;
				}) => {
					return {
						title: 'Invite Members',
						headerLeft: (btnProps) => (
							<HeaderBackButton
								{...btnProps}
								onPress={
									route.params.isNewFlat
										? () =>
												navigation.replace('FlatDetails', {
													id: route.params.flatId,
												})
										: btnProps.onPress
								}
							/>
						),
					};
				}}
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
					title: props.route.params.newTask ? 'New Task' : 'Update Task',
					headerLeft: (btnProps) => (
						<HeaderBackButton
							{...btnProps}
							onPress={
								props.route.params.newTask
									? () =>
											props.navigation.replace('TaskDetails', {
												id: props.route.params.id,
											})
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
	navigation: DrawerNavigationProp<DrawerParamList>;
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

const InvitationsStack = createStackNavigator<InvitationsStackParamList>();
const InvitationsStackNavigator = ({
	navigation,
}: {
	navigation: DrawerNavigationProp<DrawerParamList>;
}) => {
	return (
		<InvitationsStack.Navigator>
			<InvitationsStack.Screen
				name="Invitations"
				options={{
					title: 'Invitations',
					headerLeft: (props) => (
						<HeaderBackButton
							{...props}
							onPress={() => navigation.goBack()}
						/>
					),
				}}
				component={InvitationsScreen}
			/>
			<InvitationsStack.Screen
				name="InvitationDetails"
				options={(optionsProps) => {
					return {
						title: 'View Invitation',
						headerLeft: (props) =>
							optionsProps.route.params.openedByLink ? (
								<HeaderBackButton
									{...props}
									onPress={() =>
										navigation.navigate('RootStack', {
											screen: 'BottomTab',
										})
									}
								/>
							) : (
								<HeaderBackButton {...props} />
							),
					};
				}}
				component={InvitationDetailsScreen}
			/>
		</InvitationsStack.Navigator>
	);
};

const AppNavigationContainer = () => {
	const { user: loggedUser } = useSelector((state: RootState) => state.auth);
	const { loading } = useSelector((state: RootState) => state.app);
	const [isLogIn, setIsLogIn] = useState(true);
	const [redirectTo, setRedirectTo] = useState<RedirectTo | null>(null);
	const [
		openedByExternalProvider,
		setOpenedByExternalProvider,
	] = useState<null | ExternalProvider>(null);
	const dispatch = useDispatch();

	const linkHandler = useCallback((url: string | null) => {
		if (url) {
			let match = url.match(/\/--[\/]invitations\/[a-z0-9-]+/);
			if (match?.index && match.index > -1) {
				const token = match[0].substring(
					match[0].lastIndexOf('/') + 1,
					url.length
				);

				return setRedirectTo({
					screen: 'InvitationsStack',
					params: {
						screen: 'InvitationDetails',
						params: {
							token,
							openedByLink: true,
						},
					},
				});
			}
			match = url.match(/\/--[\/]auth\/success\/(github|google)/);
			if (match?.index && match.index > -1) {
				const provider = match[1];
				switch (provider) {
					case 'github':
						setOpenedByExternalProvider('GitHub');
						break;
					case 'Google':
						setOpenedByExternalProvider('Google');
					default:
						break;
				}
				return;
			}
		}
	}, []);

	useEffect(() => {
		const checkInitialUrl = async () => {
			const initUrl = await Linking.getInitialURL();
			console.log('initUrl', initUrl);
			linkHandler(initUrl);
		};

		checkInitialUrl();

		const urlChangeHandler = (ev: Linking.EventType) => {
			console.log('URL CHANGED: ', ev.url);
			linkHandler(ev.url);
		};

		Linking.addEventListener('url', urlChangeHandler);

		return () => {
			Linking.removeEventListener('url', urlChangeHandler);
		};
	}, [linkHandler]);

	useEffect(() => {
		if (!loggedUser) {
			const tryRestoreSession = async () => {
				try {
					await dispatch(tryAuthorize());
				} catch (err) {}
				dispatch(setAppLoading(false));
			};
			tryRestoreSession();
		} else {
			dispatch(readSaveShowInactive());
			dispatch(setAppLoading(false));
		}
	}, [loggedUser, dispatch]);

	return (
		<NavigationContainer
			theme={navigationContainerTheme}
			fallback={<LoadingScreen />}
		>
			{loading ? (
				<LoadingScreen />
			) : loggedUser ? (
				<DrawerNavigator loggedUser={loggedUser} redirectTo={redirectTo} />
			) : isLogIn ? (
				<LogInScreen
					externalProvider={openedByExternalProvider}
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

export default AppNavigationContainer;
