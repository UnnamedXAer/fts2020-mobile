import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Title, FAB } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import RootState from '../store/storeTypes';
import { StateError } from '../store/ReactTypes/customReactTypes';
import {
	TaskDetailsScreenRouteProps,
	TaskDetailsScreenNavigationProps,
} from '../types/navigationTypes';
import { fetchTaskOwner, fetchTaskMembers } from '../store/actions/tasks';
import PeriodsTable from '../components/Task/PeriodsTable';
import HttpErrorParser from '../utils/parseError';
import { fetchTaskPeriods } from '../store/actions/periods';
import DetailsScreenInfo from '../components/DetailsScreeenInfo/DetailsScreenInfo';
import { FABAction } from '../types/types';

interface Props {
	route: TaskDetailsScreenRouteProps;
	navigation: TaskDetailsScreenNavigationProps;
}

const TaskDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
	const dispatch = useDispatch();
	const id = route.params.id;
	const task = useSelector(
		(state: RootState) => state.tasks.tasks.find((x) => x.id === route.params.id)!
	);
	const flat = useSelector((state: RootState) =>
		state.flats.flats.find((x) => x.id === task.flatId!)
	);
	const loggedUser = useSelector((state: RootState) => state.auth.user!);
	const [fabOpen, setFabOpen] = useState(false);
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

	const ownerPressHandler = (id: number) => {
		// navigate
	};

	const memberSelectHandler = (id: number) => {
		// open modal with options
	};

	const FABActions: FABAction[] = [];
	const isFlatOwner = loggedUser.id === flat?.ownerId;
	const isTaskOwner = loggedUser.id === task.createBy;

	if (!isTaskOwner) {
		FABActions.push({
			icon: 'exit-to-app',
			onPress: () => {
				console.log('Leaving task.');
			},
			label: 'Leave Task',
		});
	}

	if (task.active) {
		FABActions.push({
			icon: 'ballot-recount-outline',
			onPress: () => {
				console.log('Resetting periods.');
			},
			label: 'Reset Periods',
		});

		if (isTaskOwner || isFlatOwner) {
			FABActions.push(
				{
					icon: 'account-multiple-plus',
					onPress: () =>
						navigation.navigate('NewTaskMembers', {
							newTask: false,
							id: id,
						}),
					label: 'Update members',
				},
				{
					icon: 'close-box-outline',
					onPress: () => {
						console.log('Closing task.');
					},
					label: 'Close Task',
				}
			);
		}
	}

	return (
		<>
			<ScrollView style={styles.screen}>
				<DetailsScreenInfo
					name={task.name!}
					description={task.description!}
					iconName="all-inclusive"
					active={task.active!}
					createAt={task.createAt!}
					owner={task.owner}
					members={task.members}
					onOwnerPress={ownerPressHandler}
					onMemberSelect={memberSelectHandler}
				/>

				<View style={styles.section}>
					<Title>Periods</Title>
					<PeriodsTable periods={periods} />
				</View>
			</ScrollView>
			<FAB.Group
				visible={Boolean(task.members && task.owner)}
				open={fabOpen}
				color="white"
				icon={fabOpen ? 'close' : 'plus'}
				actions={FABActions}
				onStateChange={({ open }) => {
					setFabOpen(open);
				}}
			/>
		</>
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
	divider: {
		marginHorizontal: 16,
	},
});

export default TaskDetailsScreen;
