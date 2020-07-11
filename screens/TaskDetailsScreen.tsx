import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import { fetchTaskOwner, fetchTaskMembers, updateTask } from '../store/actions/tasks';
import PeriodsTable from '../components/Task/PeriodsTable';
import HttpErrorParser from '../utils/parseError';
import { fetchTaskPeriods, resetTaskPeriods } from '../store/actions/periods';
import DetailsScreenInfo from '../components/DetailsScreeenInfo/DetailsScreenInfo';
import { FABAction } from '../types/types';
import AlertDialog, { AlertDialogData } from '../components/UI/AlertDialog/AlertDialog';
import Task from '../models/task';
import AlertSnackbar, {
	AlertSnackbarData,
} from '../components/UI/AlertSnackbar/AlertSnackbar';

type FABActionsKeys = 'resetPeriods' | 'updateMembers' | 'closeTask' | 'noActions';

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

	const [dialogData, setDialogData] = useState<AlertDialogData>({
		content: '',
		onDismiss: () => {},
		title: '',
		loading: false,
		open: false,
	});

	const [snackbarData, setSnackbarData] = useState<AlertSnackbarData>({
		content: '',
		onClose: () => {},
		open: false,
	});

	const isMounted = useRef(true);
	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	const closeDialogAlertHandler = () =>
		setDialogData((prevState) => ({
			...prevState,
			open: prevState.loading,
		}));

	const closeSnackbarAlertHandler = () =>
		setSnackbarData((prevState) => ({
			...prevState,
			open: false,
		}));

	const resetPeriodsHandler = useCallback(async () => {
		setDialogData((prevState) => ({ ...prevState, loading: true }));

		try {
			await dispatch(resetTaskPeriods(id));
			isMounted.current &&
				isMounted.current &&
				setSnackbarData({
					open: true,
					action: {
						label: 'OK',
						onPress: closeSnackbarAlertHandler,
					},
					severity: 'success',
					timeout: 3000,
					content: 'Periods reset successfully.',
					onClose: closeSnackbarAlertHandler,
				});
		} catch (err) {
			if (isMounted.current) {
				const httpError = new HttpErrorParser(err);
				const msg = httpError.getMessage();
				setSnackbarData({
					open: true,
					action: {
						label: 'OK',
						onPress: closeSnackbarAlertHandler,
					},
					severity: 'error',
					timeout: 4000,
					content: msg,
					onClose: closeSnackbarAlertHandler,
				});
			}
		}
		isMounted.current &&
			setDialogData((prevState) => ({ ...prevState, open: false }));
	}, [dispatch, id]);

	const taskCloseHandler = useCallback(async () => {
		const _task: Partial<Task> = new Task({
			id: task!.id,
			active: false,
		});
		setDialogData((prevState) => ({ ...prevState, loading: true }));
		setTimeout(async () => {
			try {
				await dispatch(updateTask(_task));
				isMounted.current &&
					setSnackbarData({
						open: true,
						action: {
							label: 'ok',
							onPress: closeSnackbarAlertHandler,
						},
						severity: 'success',
						timeout: 3000,
						content: 'Task closed.',
						onClose: closeSnackbarAlertHandler,
					});
			} catch (err) {
				if (isMounted.current) {
					const httpError = new HttpErrorParser(err);
					const msg = httpError.getMessage();
					setSnackbarData({
						open: true,
						action: {
							label: 'ok',
							onPress: closeSnackbarAlertHandler,
						},
						severity: 'error',
						timeout: 4000,
						content: msg,
						onClose: closeSnackbarAlertHandler,
					});
				}
			}
			isMounted.current &&
				setDialogData((prevState) => ({ ...prevState, open: false }));
		}, 3000);
	}, [dispatch, task]);

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

	const taskFABActions: {
		[key in FABActionsKeys]: FABAction;
	} = {
		resetPeriods: {
			icon: 'ballot-recount-outline',
			onPress: () => {
				setDialogData({
					open: true,
					title: 'Reset Periods',
					content: 'Do you want reset future periods?',
					onDismiss: closeDialogAlertHandler,
					loading: false,
					actions: [
						{
							label: 'Yes',
							onPress: resetPeriodsHandler,
							color: 'primary',
						},
						{
							color: 'accent',
							label: 'Cancel',
							onPress: closeDialogAlertHandler,
						},
					],
				});
			},
			label: 'Reset Periods',
		},
		updateMembers: {
			icon: 'account-multiple-plus',
			onPress: () =>
				navigation.navigate('NewTaskMembers', {
					newTask: false,
					id: id,
				}),
			label: 'Update Members',
		},
		closeTask: {
			icon: 'close-box-outline',
			onPress: () => {
				setDialogData({
					open: true,
					title: 'Close Task',
					content: 'Do you want to close this task?',
					onDismiss: closeDialogAlertHandler,
					loading: false,
					actions: [
						{
							label: 'Yes',
							onPress: taskCloseHandler,
							color: 'primary',
						},
						{
							color: 'accent',
							label: 'Cancel',
							onPress: closeDialogAlertHandler,
						},
					],
				});
			},
			label: 'Close Task',
		},
		noActions: {
			icon: 'information-variant',
			onPress: () => {},
			label: 'No actions available',
		},
	};

	const actions: FABAction[] = [];
	if (
		task.active &&
		(loggedUser.id === flat?.ownerId || loggedUser.id === task.createBy)
	) {
		actions.push(
			taskFABActions.closeTask,
			taskFABActions.updateMembers,
			taskFABActions.resetPeriods
		);
	} else {
		actions.push(taskFABActions.noActions);
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
				actions={actions}
				onStateChange={({ open }) => {
					setFabOpen(open);
				}}
			/>
			<AlertDialog data={dialogData} />
			<AlertSnackbar data={snackbarData} />
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
