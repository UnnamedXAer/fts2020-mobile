import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { StyleSheet, View, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
	Paragraph,
	Title,
	Headline,
	useTheme,
	Divider,
	Text,
	List,
	Avatar,
} from 'react-native-paper';
import { Placeholder, PlaceholderLine, Shine } from 'rn-placeholder';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import RootState from '../store/storeTypes';
import { StateError } from '../store/ReactTypes/customReactTypes';
import { fetchFlatOwner, fetchFlatMembers } from '../store/actions/flats';
import Link from '../components/UI/Link';
import FlatTasksList from '../components/Flat/FlatTasksList';
import {
	TaskDetailsScreenRouteProps,
	TaskDetailsScreenNavigationProp,
} from '../types/types';
import { fetchTaskOwner, fetchTaskMembers } from '../store/actions/tasks';
import PeriodsTable from '../components/Task/PeriodsTable';
import HttpErrorParser from '../utils/parseError';
import { fetchTaskPeriods } from '../store/actions/periods';

interface Props {
	route: TaskDetailsScreenRouteProps;
	navigation: TaskDetailsScreenNavigationProp;
}

const dimensions = Dimensions.get('screen');

const TaskDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
	const theme = useTheme();
	const dispatch = useDispatch();
	const id = route.params.id;
	const task = useSelector(
		(state: RootState) => state.tasks.tasks.find((x) => x.id === route.params.id)!
	);
	const flat = useSelector((state: RootState) =>
		state.flats.flats.find((x) => x.id === task.flatId!)
	);
	const periods = useSelector((state: RootState) => state.periods.taskPeriods[id]);
	const [loadingElements, setLoadingElements] = useState({
		owner: !!task.owner,
		members: !!task.members,
		schedule: !!periods,
	});

	const [elementsErrors, setElementsErrors] = useState<{
		owner: StateError;
		members: StateError;
		schedule: StateError;
	}>({
		owner: null,
		members: null,
		schedule: null,
	});

	useEffect(() => {
		if (!task.owner && !loadingElements.owner && !elementsErrors.owner) {
			const loadOwner = async () => {
				setLoadingElements((prevState) => ({
					...prevState,
					owner: true,
				}));
				setTimeout(async () => {
					try {
						await dispatch(fetchTaskOwner(task.createBy!, task.id!));
					} catch (err) {
						setElementsErrors((prevState) => ({
							...prevState,
							owner: err.message,
						}));
					}
					setLoadingElements((prevState) => ({
						...prevState,
						owner: false,
					}));
				}, 1010);
			};

			loadOwner();
		}

		if (!task.members && !loadingElements.members && !elementsErrors.members) {
			const loadMembers = async () => {
				setLoadingElements((prevState) => ({
					...prevState,
					members: true,
				}));
				try {
					await dispatch(fetchTaskMembers(task.id!));
				} catch (err) {
					setElementsErrors((prevState) => ({
						...prevState,
						members: err.message,
					}));
				}
				setLoadingElements((prevState) => ({
					...prevState,
					members: false,
				}));
			};

			loadMembers();
		}
	}, [task, dispatch, loadingElements, elementsErrors]);

	useEffect(() => {
		if (task && !periods && !loadingElements.schedule && !elementsErrors.schedule) {
			const loadSchedule = async (id: number) => {
				setLoadingElements((prevState) => ({
					...prevState,
					schedule: true,
				}));
				try {
					await dispatch(fetchTaskPeriods(id));
				} catch (err) {
					const error = new HttpErrorParser(err);
					const msg = error.getMessage();
					setElementsErrors((prevState) => ({
						...prevState,
						schedule: msg,
					}));
				}
				setLoadingElements((prevState) => ({
					...prevState,
					schedule: false,
				}));
			};
			loadSchedule(task.id!);
		}
	}, [dispatch, elementsErrors.schedule, loadingElements.schedule, periods, task]);

	const peronTouchChanger = (id: number) => {
		// navigate
	};

	const memberSelectHandler = (id: number) => {
		// open modal with options
	};

	return (
		<ScrollView style={styles.screen}>
			<Headline style={{ alignSelf: 'center', paddingTop: 24 }}>
				{task.name}
			</Headline>

			<View style={[styles.section, styles.infoContainer]}>
				<View style={styles.avatarContainer}>
					<View
						style={[
							{ backgroundColor: theme.colors.disabled },
							styles.avatar,
						]}
					>
						<MaterialCommunityIcons
							name="all-inclusive"
							size={40}
							color={theme.colors.background}
						/>
					</View>
				</View>
				<View
					style={{
						minWidth: (() => {
							const x = dimensions.width - 32 - 16 - 64;
							return x;
						})(),

						marginStart: 8,
						justifyContent: 'center',
					}}
				>
					{task.owner ? (
						<>
							<View
								style={{
									flexDirection: 'row',
									flexWrap: 'wrap',
									justifyContent: 'flex-start',
								}}
							>
								<Text>Created by </Text>
								<Link onPress={() => peronTouchChanger(task.owner!.id)}>
									{task.owner.emailAddress}
								</Link>
							</View>
							<Text>Created at {moment(task.createAt).format('ll')}</Text>
						</>
					) : (
						<Placeholder Animation={Shine}>
							<PlaceholderLine height={16} />
							<PlaceholderLine height={16} />
						</Placeholder>
					)}
				</View>
			</View>
			<Divider style={styles.divider} />
			<View style={styles.section}>
				<Title>Description</Title>
				<Paragraph>{task.description}</Paragraph>
			</View>
			<Divider style={styles.divider} />
			<View style={styles.section}>
				<Title>Members</Title>
				{task.members ? (
					task.members.map((member) => {
						return (
							<List.Item
								key={member.id}
								title={member.emailAddress}
								description={member.userName}
								left={(props) =>
									member.avatarUrl ? (
										<Avatar.Image
											source={{
												uri: member.avatarUrl,
											}}
											size={48}
										/>
									) : (
										<Avatar.Icon
											icon="account-outline"
											size={48}
											theme={{
												colors: {
													primary: theme.colors.disabled,
												},
											}}
										/>
									)
								}
								rippleColor={theme.colors.primary}
								onPress={() => memberSelectHandler(member.id)}
							/>
						);
					})
				) : (
					<Placeholder Animation={Shine}>
						<PlaceholderLine height={40} />
						<PlaceholderLine height={40} />
					</Placeholder>
				)}
			</View>
			<Divider style={styles.divider} />
			<View style={styles.section}>
				<Title>Periods</Title>
				<PeriodsTable periods={periods} />
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
	},
	section: {
		paddingHorizontal: 8,
		paddingBottom: 8,
	},
	infoContainer: {
		paddingVertical: 8,
		justifyContent: 'center',
		flexWrap: 'wrap',
		flexDirection: 'row',
	},
	avatarContainer: {
		marginVertical: 8,
		height: 64,
		width: 64,
		borderRadius: 32,
		backgroundColor: 'white',
		overflow: 'hidden',
	},
	avatar: {
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	divider: {
		marginHorizontal: 16,
	},
});

export default TaskDetailsScreen;
