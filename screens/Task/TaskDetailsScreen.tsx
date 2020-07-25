import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Title, FAB, Paragraph } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { Placeholder } from 'rn-placeholder';
import { Shine, PlaceholderLine } from '../../components/UI/Placeholder/Placeholder';
import moment from 'moment';
import RootState from '../../store/storeTypes';
import { StateError } from '../../store/ReactTypes/customReactTypes';
import {
	TaskDetailsScreenRouteProps,
	TaskDetailsScreenNavigationProps,
} from '../../types/navigationTypes';
import {
	fetchTaskOwner,
	fetchTaskMembers,
	updateTask,
	fetchTask,
} from '../../store/actions/tasks';
import PeriodsTable from '../../components/Task/PeriodsTable';
import HttpErrorParser from '../../utils/parseError';
import {
	fetchTaskPeriods,
	resetTaskPeriods,
	completePeriod,
} from '../../store/actions/periods';
import DetailsScreenInfo from '../../components/DetailsScreeenInfo/DetailsScreenInfo';
import { FABAction } from '../../types/types';
import AlertDialog, {
	AlertDialogData,
} from '../../components/UI/AlertDialog/AlertDialog';
import Task from '../../models/task';
import AlertSnackbar, {
	AlertSnackbarData,
} from '../../components/UI/AlertSnackbar/AlertSnackbar';
import PeriodCompleteText from '../../components/Task/PeriodCompleteText';
import Link from '../../components/UI/Link';

type FABActionsKeys = 'resetPeriods' | 'updateMembers' | 'closeTask';

interface Props {
	route: TaskDetailsScreenRouteProps;
	navigation: TaskDetailsScreenNavigationProps;
}

const TaskDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
	const dispatch = useDispatch();
	const id = route.params.id;
	const task = useSelector((state: RootState) =>
		state.tasks.tasks.find((x) => x.id === route.params.id)
	);
	const flatName = useSelector<RootState, string>((state) => {
		let flatName: string;
		const flat = task ? state.flats.flats.find((x) => x.id === task.flatId) : void 0;
		if (flat) {
			flatName = flat.name;
		} else {
			const userTask = state.tasks.userTasks.find((x) => x.id === id);
			flatName = userTask?.flatName!;
		}
		return flatName;
	});
	const loggedUser = useSelector((state: RootState) => state.auth.user!);
	const [error, setError] = useState<StateError>(null);
	const [fabOpen, setFabOpen] = useState(false);
	const periods = useSelector((state: RootState) => state.periods.taskPeriods[id]);
	const [loadingElements, setLoadingElements] = useState({
		owner: !!task?.owner,
		members: !!task?.members,
		schedule: !!periods,
	});
	const [periodsLoading, setPeriodsLoading] = useState<{
		[id: number]: boolean;
	}>({});

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

	useEffect(() => {
		if (!task) {
			const loadTask = async (id: number) => {
				setError(null);
				try {
					await dispatch(fetchTask(id));
				} catch (err) {
					if (isMounted.current) {
						const error = new HttpErrorParser(err);
						const msg = error.getMessage();
						setError(msg);
					}
				}
			};
			loadTask(id);
		}
	}, [dispatch, id, task]);

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
		if (task && !task.owner && !loadingElements.owner && !elementsErrors.owner) {
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

		if (
			task &&
			!task.members &&
			!loadingElements.members &&
			!elementsErrors.members
		) {
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

	const completePeriodHandler = useCallback(
		async (id: number) => {
			setPeriodsLoading((prevState) => ({ ...prevState, [id]: true }));
			setDialogData((prevState) => ({ ...prevState, loading: true }));
			try {
				await dispatch(completePeriod(id, task!.id!));
				isMounted.current &&
					setSnackbarData({
						open: true,
						action: {
							label: 'OK',
							onPress: closeSnackbarAlertHandler,
						},
						severity: 'success',
						timeout: 3000,
						content: 'Period completed.',
						onClose: closeSnackbarAlertHandler,
					});
			} catch (err) {
				if (isMounted.current) {
					const error = new HttpErrorParser(err);
					const msg = error.getMessage();
					setSnackbarData({
						open: true,
						action: { label: 'OK', onPress: closeSnackbarAlertHandler },
						severity: 'error',
						timeout: 4000,
						content: 'Could not complete the period.',
						onClose: closeSnackbarAlertHandler,
					});
				}
			} finally {
				if (isMounted.current) {
					setPeriodsLoading((prevState) => ({
						...prevState,
						[id]: false,
					}));
					setDialogData((prevState) => ({
						...prevState,
						open: false,
					}));
				}
			}
		},
		[dispatch, task]
	);

	const completePeriodPressHandler = useCallback(
		(id: number) => {
			const period = periods!.find((x) => x.id === id)!;

			setDialogData({
				open: true,
				// 'Are you sure?',
				content: (
					<PeriodCompleteText
						loggedUserEmailAddress={loggedUser.emailAddress}
						period={period}
					/>
				),
				title: 'Complete Period?',
				onDismiss: closeDialogAlertHandler,
				loading: false,
				actions: [
					{
						label: 'Complete',
						onPress: () => completePeriodHandler(id),
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
		[completePeriodHandler, loggedUser.emailAddress, periods]
	);

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
	};

	const actions: FABAction[] = [];
	if (task?.active && loggedUser.id === task.createBy) {
		actions.push(
			taskFABActions.closeTask,
			taskFABActions.updateMembers,
			taskFABActions.resetPeriods
		);
	}

	return (
		<>
			<ScrollView style={styles.screen}>
				<DetailsScreenInfo
					error={error}
					name={task?.name!}
					description={task?.description!}
					iconName="all-inclusive"
					active={task?.active!}
					createAt={task?.createAt!}
					owner={task?.owner}
					members={task?.members}
					onOwnerPress={ownerPressHandler}
					onMemberSelect={memberSelectHandler}
					additionalInfo={
						task ? (
							<>
								<Title>Task info</Title>
								<View style={{ flexDirection: 'row' }}>
									<View style={{ marginRight: 16 }}>
										<Paragraph style={styles.taskInfoLabel}>
											Flat:
										</Paragraph>
										<Paragraph style={styles.taskInfoLabel}>
											Task period:
										</Paragraph>
										<Paragraph style={styles.taskInfoLabel}>
											Start date:
										</Paragraph>
										<Paragraph style={styles.taskInfoLabel}>
											End date:
										</Paragraph>
									</View>
									<View>
										{task ? (
											<Link
												onPress={() =>
													navigation.navigate('FlatDetails', {
														id: task!.flatId!,
													})
												}
											>
												{flatName}
											</Link>
										) : (
											<Paragraph> </Paragraph>
										)}
										<Paragraph>
											{task.timePeriodValue}{' '}
											{task.timePeriodUnit?.toLocaleLowerCase()}
											{task.timePeriodValue! > 1 ? 's' : ''}
										</Paragraph>
										<Paragraph>
											{moment(task.startDate).format('LL')}
										</Paragraph>
										<Paragraph>
											{moment(task.startDate).format('LL')}
										</Paragraph>
									</View>
								</View>
							</>
						) : (
							<>
								<Title>Task info</Title>
								<Placeholder Animation={Shine}>
									<PlaceholderLine
										style={styles.taskInfoPlaceholderLine}
									/>
									<PlaceholderLine
										style={styles.taskInfoPlaceholderLine}
									/>
									<PlaceholderLine
										style={styles.taskInfoPlaceholderLine}
									/>
									<PlaceholderLine
										style={styles.taskInfoPlaceholderLine}
									/>
								</Placeholder>
							</>
						)
					}
				/>

				<View style={styles.section}>
					<Title>Periods</Title>
					<PeriodsTable
						periods={periods}
						loading={loadingElements.schedule}
						error={elementsErrors.schedule}
						disabled={!task?.active}
						periodsLoading={periodsLoading}
						loggedUserEmailAddress={loggedUser.emailAddress}
						onCompletePeriod={completePeriodPressHandler}
					/>
				</View>
			</ScrollView>
			<FAB.Group
				visible={actions.length > 0}
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
	taskInfoPlaceholderLine: { width: '90%', height: 16 },
	taskInfoLabel: { fontWeight: 'bold' },
});

export default TaskDetailsScreen;
