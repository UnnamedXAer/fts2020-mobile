import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	StyleSheet,
	View,
	ScrollView,
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
	Keyboard,
} from 'react-native';
import { withTheme, List, Avatar, IconButton } from 'react-native-paper';
import { Theme } from 'react-native-paper/lib/typescript/src/types';
import {
	NewTaskMembersScreenNavigationProps,
	NewTaskMembersScreenRouteProps,
} from '../../types/navigationTypes';
import { StateError } from '../../store/ReactTypes/customReactTypes';
import { TaskData } from '../../models/task';
import HttpErrorParser from '../../utils/parseError';
import Header from '../../components/UI/Header';
import NotificationCard from '../../components/UI/NotificationCard';
import CustomButton from '../../components/UI/CustomButton';
import RootState from '../../store/storeTypes';
import { Item } from 'react-native-paper/lib/typescript/src/components/Drawer/Drawer';
import User from '../../models/user';
import Stepper from '../../components/UI/Stepper';

interface Props {
	theme: Theme;
	navigation: NewTaskMembersScreenNavigationProps;
	route: NewTaskMembersScreenRouteProps;
}

const NewTaskMembersScreen: React.FC<Props> = ({ theme, navigation, route }) => {
	const dispatch = useDispatch();

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<StateError>(null);
	const task = useSelector(
		(state: RootState) => state.tasks.tasks.find((x) => x.id === route.params.id)!
	);
	const flatMembers = useSelector(
		(state: RootState) =>
			state.flats.flats.find((x) => x.id === task.flatId)!.members!
	);
	const [addedMembers, setAddedMembers] = useState([
		flatMembers.find((x) => x.id === task.createBy!)!,
	]);

	const isMounted = useRef(true);
	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	const removeMemberHandler = async (id: User['id']) => {
		setAddedMembers((prevState) => prevState.filter((x) => x.id !== id));
	};

	const addMemberHandler = async (id: User['id']) => {
		setAddedMembers((prevState) =>
			prevState.concat(flatMembers.find((x) => x.id === id)!)
		);
	};

	const submitHandler = async () => {
		setError(null);
		let isFormValid = true;
	};

	return (
		<KeyboardAvoidingView
			style={styles.keyboardAvoidingView}
			behavior="height"
			keyboardVerticalOffset={100}
		>
			<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
				<ScrollView
					contentContainerStyle={[
						styles.screen,
						{ backgroundColor: theme.colors.surface },
					]}
				>
					<Stepper steps={3} currentStep={2} />
					<Header style={styles.header}>Set Task - Members</Header>
					<View style={styles.inputContainer}>
						<List.Section title="Flat members">
							{flatMembers.map((member) => (
								<List.Item
									key={member.id}
									title={member.emailAddress}
									description={member.userName}
									left={() =>
										member.avatarUrl ? (
											<Avatar.Image
												size={48}
												style={{
													width: 48,
													height: 48,
													marginHorizontal: 0,
												}}
												source={{ uri: member.avatarUrl }}
											/>
										) : (
											<Avatar.Icon
												color={theme.colors.primary}
												icon="account-outline"
												size={48}
												theme={{
													colors: {
														primary: theme.colors.background,
													},
												}}
												style={{
													width: 48,
													height: 48,
													marginHorizontal: 0,
												}}
											/>
										)
									}
									right={() => (
										<IconButton
											color={theme.colors.placeholder}
											icon="plus"
											disabled={loading}
											onPress={() => {
												addMemberHandler(member.id);
											}}
										/>
									)}
								/>
							))}
						</List.Section>
					</View>
					<View style={styles.inputContainer}>
						{error && (
							<NotificationCard serverity="error">{error}</NotificationCard>
						)}
					</View>
					<View style={styles.actions}>
						<CustomButton
							accent
							onPress={() => navigation.popToTop()}
							disabled={loading}
						>
							{route.params.newTask ? 'LATER' : 'CANCEL'}
						</CustomButton>
						<CustomButton onPress={submitHandler} disabled={loading}>
							{route.params.newTask ? 'COMPLETE' : 'UPDATE'}
						</CustomButton>
					</View>
				</ScrollView>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	keyboardAvoidingView: {
		flex: 1,
	},
	screen: {
		flexDirection: 'column',
		alignItems: 'center',
	},
	header: {
		paddingTop: 16,
		fontSize: 44,
	},
	infoParagraph: {
		fontSize: 20,
		marginVertical: 8,
	},
	inputContainer: {
		width: '90%',
		maxWidth: 400,
		marginVertical: 4,
	},
	input: {
		fontSize: 16,
	},
	actions: {
		flexDirection: 'row',
		alignItems: 'flex-end',
	},
});
export default withTheme(NewTaskMembersScreen);
