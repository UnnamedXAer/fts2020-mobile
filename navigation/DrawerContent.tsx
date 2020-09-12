import React from 'react';
import {
	Drawer as PaperDrawer,
	Avatar,
	TouchableRipple,
	Paragraph,
} from 'react-native-paper';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
	DrawerContentScrollView,
	DrawerItem,
	DrawerContentComponentProps,
	DrawerContentOptions,
} from '@react-navigation/drawer';
import { useDispatch } from 'react-redux';
import User from '../models/user';
import { logOut, setAppLoading } from '../store/actions/auth';

const DrawerContent = (
	props: DrawerContentComponentProps<DrawerContentOptions> & { loggedUser: User }
) => {
	const dispatch = useDispatch();

	return (
		<View style={{ flex: 1 }}>
			<DrawerContentScrollView {...props}>
				<PaperDrawer.Section>
					<TouchableRipple
						onPress={() => props.navigation.navigate('ProfileStack')}
					>
						<View
							style={{
								flexDirection: 'row',
								margin: 16,
							}}
						>
							<Avatar.Image source={{ uri: props.loggedUser.avatarUrl }} />
							<View
								style={{
									marginLeft: 16,
									justifyContent: 'center',
								}}
							>
								<Paragraph style={{ fontWeight: 'bold' }}>
									{props.loggedUser.emailAddress}
								</Paragraph>
								<Paragraph style={{ color: '#888' }}>
									{props.loggedUser.userName}
								</Paragraph>
							</View>
						</View>
					</TouchableRipple>
				</PaperDrawer.Section>
				<PaperDrawer.Section>
					<DrawerItem
						icon={({ color, size }) => (
							<MaterialCommunityIcons
								name="view-week"
								size={size}
								color={color}
							/>
						)}
						label="Flats & Tasks"
						onPress={() => {
							props.navigation.navigate('RootStack');
						}}
					/>
					<DrawerItem
						icon={({ color, size }) => (
							<MaterialCommunityIcons
								name="all-inclusive"
								size={size}
								color={color}
							/>
						)}
						label="Invitations"
						onPress={() => {
							props.navigation.navigate('InvitationsStack');
						}}
					/>
					<DrawerItem
						icon={({ color, size }) => (
							<MaterialCommunityIcons
								name="account-outline"
								size={size}
								color={color}
							/>
						)}
						label="Profile"
						onPress={() => {
							props.navigation.navigate('ProfileStack');
						}}
					/>
					<DrawerItem
						icon={({ color, size }) => (
							<MaterialCommunityIcons
								name="information-outline"
								size={size}
								color={color}
							/>
						)}
						label="About"
						onPress={() => {
							props.navigation.navigate('About');
						}}
					/>
				</PaperDrawer.Section>
			</DrawerContentScrollView>
			<PaperDrawer.Section>
				<DrawerItem
					icon={({ color, size }) => (
						<MaterialCommunityIcons name="logout" size={size} color={color} />
					)}
					label="SignOut"
					onPress={async () => {
						dispatch(setAppLoading(true));
						await dispatch(logOut());
						props.navigation.reset({
							index: 0,
							routes: [{ name: 'RootStack' }],
						});
						dispatch(setAppLoading(false));
					}}
				/>
			</PaperDrawer.Section>
		</View>
	);
};

export default DrawerContent;
