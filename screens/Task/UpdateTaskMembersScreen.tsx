import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	StyleSheet,
	View,
	ScrollView,
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
	Keyboard,
	BackHandler,
} from 'react-native';
import {
	withTheme,
	Avatar,
	Chip,
	Text,
	IconButton,
	Colors,
	ActivityIndicator,
} from 'react-native-paper';
import Toast from 'react-native-simple-toast';
import { useFocusEffect } from '@react-navigation/native';
import { Theme } from 'react-native-paper/lib/typescript/src/types';
import { StateError } from '../../store/ReactTypes/customReactTypes';
import HttpErrorParser from '../../utils/parseError';
import Header from '../../components/UI/Header';
import NotificationCard from '../../components/UI/NotificationCard';
import CustomButton from '../../components/UI/CustomButton';
import RootState from '../../store/storeTypes';
import User from '../../models/user';
import Stepper from '../../components/UI/Stepper';
import { updatedTaskMembers } from '../../store/actions/tasks';
import { clearTaskPeriods } from '../../store/actions/periods';
import { UpdateTaskMembersScreenNavigationProp } from '../../types/rootNavigationTypes';
import { NewTaskMembersScreenRouteProps } from '../../types/rootRoutePropTypes';
import { fetchFlat, fetchFlatMembers } from '../../store/actions/flats';

interface Props {
	theme: Theme;
	navigation: UpdateTaskMembersScreenNavigationProp;
	route: NewTaskMembersScreenRouteProps;
}

const UpdateTaskMembersScreen: React.FC<Props> = ({
	theme,
	navigation,
	route,
}) => {
	const { newTask: isNewTask, id } = route.params;
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<StateError>(null);
	const task = useSelector(
		(state: RootState) =>
			state.tasks.tasks.find((x) => x.id === route.params.id)!
	);
	const flatId = task.flatId!;
	const flat = useSelector((state: RootState) =>
		state.flats.flats.find((x) => x.id === task.flatId)
	);
	const flatMembers = flat?.members;
	const [loadingFlatMembers, setLoadingFlatMembers] = useState(false);
	const [errorFlatMembers, setErrorFlatMembers] = useState<StateError>(null);
	const [addedMembers, setAddedMembers] = useState(
		isNewTask ? [...flatMembers!] : [...task.members!]
	);
	const [selectedFlatMembers, setSelectedFlatMembers] = useState<User[]>([]);
	const [selectedAddedMembers, setSelectedAddedMembers] = useState<User[]>(
		[]
	);

	const isMounted = useRef(true);
	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	useFocusEffect(
		useCallback(() => {
			const onBackPress = () => {
				if (isNewTask) {
					navigation.replace('TaskDetails', {
						id,
					});
					return true;
				}
				return false;
			};

			BackHandler.addEventListener('hardwareBackPress', onBackPress);

			return () => {
				BackHandler.removeEventListener(
					'hardwareBackPress',
					onBackPress
				);
			};
		}, [isNewTask, id])
	);

	useEffect(() => {
		if (!loadingFlatMembers && !errorFlatMembers && !flatMembers) {
			const loadFlatMembers = async () => {
				setLoadingFlatMembers(true);
				try {
					if (!flat) {
						await dispatch(fetchFlat(flatId));
					}
					await dispatch(fetchFlatMembers(flatId));
				} catch (err) {
					if (isMounted.current) {
						const httpError = new HttpErrorParser(err);
						const msg = httpError.getMessage();
						setErrorFlatMembers(
							`Couldn't get members of the flat due to following error:\n${msg}\
							\n\nPlease try later.`
						);
					}
				}
				if (isMounted.current) {
					setLoadingFlatMembers(false);
				}
			};
			loadFlatMembers();
		}
	}, [loadingFlatMembers, errorFlatMembers, flatMembers, flat, flatId]);

	const addMembersHandler = () => {
		if (selectedFlatMembers.length === 0) {
			Toast.show('Select flat members to assign.');
		} else {
			setAddedMembers((prevState) =>
				prevState.concat(selectedFlatMembers)
			);
			setSelectedFlatMembers([]);
		}
	};

	const removeMembersHandler = () => {
		if (selectedAddedMembers.length === 0) {
			Toast.show('Select members to remove');
		} else {
			setAddedMembers((prevState) =>
				prevState.filter((x) => !selectedAddedMembers.includes(x))
			);
			setSelectedAddedMembers([]);
		}
	};

	const selectAddedMemberHandler = (member: User) => {
		if (member.id !== task.createBy) {
			setSelectedAddedMembers((prevState) => {
				if (prevState.includes(member)) {
					return prevState.filter((x) => x.id !== member.id);
				} else {
					return prevState.concat(member);
				}
			});
		} else {
			Toast.show('You are too important to not include you!');
		}
	};

	const selectFlatMemberHandler = (member: User) => {
		setSelectedFlatMembers((prevState) => {
			if (prevState.includes(member)) {
				return prevState.filter((x) => x.id !== member.id);
			} else {
				return prevState.concat(member);
			}
		});
	};

	const submitHandler = async () => {
		const taskId = task.id!;

		setLoading(true);
		setError(null);
		const updatedMembers = addedMembers!.map((x) => x.id);

		try {
			await dispatch(updatedTaskMembers(taskId, updatedMembers));
			dispatch(clearTaskPeriods(taskId));
			if (isMounted.current) {
				if (isNewTask) {
					navigation.replace('TaskDetails', { id: taskId });
				} else {
					navigation.goBack();
				}
			}
		} catch (err) {
			if (isMounted.current) {
				const httpError = new HttpErrorParser(err);
				const errCode = httpError.getCode();
				let msg: string;
				if (errCode === 422) {
					msg =
						'Sorry, something went wrong. Please try again later.';
				} else {
					msg = httpError.getMessage();
				}
				setError(msg);
				setLoading(false);
			}
		}
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
					{isNewTask && <Stepper steps={3} currentStep={3} />}

					<Header style={styles.header}>
						{isNewTask ? 'Set' : 'Update'} Task - Members
					</Header>
					<View style={styles.inputContainer}>
						<Text>Unassigned flat members</Text>
					</View>
					<View
						style={[styles.inputContainer, styles.membersContainer]}
					>
						{errorFlatMembers ? (
							<NotificationCard severity="error">
								{errorFlatMembers}
							</NotificationCard>
						) : loadingFlatMembers ? (
							<View
								style={{
									width: '100%',
									justifyContent: 'center',
								}}
							>
								<ActivityIndicator />
							</View>
						) : flatMembers &&
						  flatMembers.length !== addedMembers.length ? (
							flatMembers
								.filter(
									(x) =>
										addedMembers.findIndex(
											(addedMember) =>
												addedMember.id === x.id
										) === -1
								)
								.map((member) => (
									<Chip
										key={member.id}
										style={styles.chip}
										textStyle={
											member.id === task.createBy
												? {
														color:
															theme.colors
																.placeholder,
												  }
												: void 0
										}
										avatar={
											member.avatarUrl ? (
												<Avatar.Image
													source={{
														uri: member.avatarUrl,
													}}
													size={24}
												/>
											) : (
												<Avatar.Icon
													icon="account-outline"
													size={24}
												/>
											)
										}
										mode="flat"
										selected={selectedFlatMembers.includes(
											member
										)}
										onPress={() =>
											selectFlatMemberHandler(member)
										}
									>
										{member.id === task.createBy &&
											'[You] '}
										{member.emailAddress}
									</Chip>
								))
						) : (
							<NotificationCard severity="success">
								All flat members are assigned to task.
							</NotificationCard>
						)}
					</View>
					<View
						style={[styles.inputContainer, styles.membersActions]}
					>
						<IconButton
							icon="arrow-up-bold-outline"
							color={
								selectedAddedMembers.length === 0
									? Colors.orange200
									: theme.colors.accent
							}
							onPress={removeMembersHandler}
							disabled={!!errorFlatMembers}
						></IconButton>
						<IconButton
							icon="arrow-down-bold-outline"
							color={
								selectedFlatMembers.length === 0
									? Colors.teal200
									: theme.colors.primary
							}
							onPress={addMembersHandler}
							disabled={!!errorFlatMembers}
						></IconButton>
					</View>
					<View
						style={[
							styles.inputContainer,
							styles.assignedTitleInfoContainer,
						]}
					>
						<Text>Assigned people</Text>
						<Text style={styles.assignedTitleInfo}>
							(
							{addedMembers.length === 1
								? 'Only you'
								: `You and ${addedMembers.length - 1} more`}
							)
						</Text>
					</View>
					<View
						style={[styles.inputContainer, styles.membersContainer]}
					>
						{addedMembers.map((member) => (
							<Chip
								key={member.id}
								style={styles.chip}
								textStyle={
									member.id === task.createBy
										? { color: theme.colors.placeholder }
										: void 0
								}
								avatar={
									member.avatarUrl ? (
										<Avatar.Image
											source={{ uri: member.avatarUrl }}
											size={24}
										/>
									) : (
										<Avatar.Icon icon="account" size={24} />
									)
								}
								mode="flat"
								selected={selectedAddedMembers.includes(member)}
								onPress={() => selectAddedMemberHandler(member)}
							>
								{member.id === task.createBy && '[You] '}
								{member.emailAddress}
							</Chip>
						))}
					</View>
					<View style={styles.inputContainer}>
						{error && (
							<NotificationCard severity="error">
								{error}
							</NotificationCard>
						)}
					</View>
					<View style={styles.actions}>
						<CustomButton
							accent
							onPress={() => {
								if (isNewTask) {
									navigation.replace('TaskDetails', {
										id: task.id!,
									});
								} else {
									navigation.goBack();
								}
							}}
							disabled={loading}
						>
							{isNewTask ? 'LATER' : 'CANCEL'}
						</CustomButton>
						<CustomButton
							onPress={submitHandler}
							loading={loading}
							disabled={!!errorFlatMembers}
						>
							{isNewTask ? 'COMPLETE' : 'UPDATE'}
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
	membersActions: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-evenly',
	},
	assignedTitleInfoContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	assignedTitleInfo: {
		marginStart: 8,
		color: '#64b5f6',
		fontSize: 12,
	},
	membersContainer: {
		flexWrap: 'wrap',
		flexDirection: 'row',
	},
	chip: {
		marginRight: 8,
		marginBottom: 4,
		flexWrap: 'nowrap',
	},
	actions: {
		flexDirection: 'row',
		alignItems: 'flex-end',
	},
});
export default withTheme(UpdateTaskMembersScreen);
