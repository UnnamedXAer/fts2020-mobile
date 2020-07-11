import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import RootState from '../../store/storeTypes';
import { List, withTheme, Theme, Divider } from 'react-native-paper';
import { Placeholder, Shine, PlaceholderLine } from 'rn-placeholder';
import { fetchFlatTasks, fetchTaskMembers } from '../../store/actions/tasks';
import HttpErrorParser from '../../utils/parseError';
import Task from '../../models/task';
import NotificationCard from '../UI/NotificationCard';
import { FlatDetailsScreenNavigationProps } from '../../types/navigationTypes';

interface Props {
	flatId: number;
	theme: Theme;
	navigation: FlatDetailsScreenNavigationProps;
}

const FlatTasksList: React.FC<Props> = ({ flatId, theme, navigation }) => {
	const dispatch = useDispatch();
	const [openTime] = useState(Date.now() - 1000 * 60 * 10);
	const tasksLoadTime = useSelector((state: RootState) => {
		const time = state.tasks.tasksLoadTimes[flatId];
		return time !== void 0 ? time : 0;
	});
	const [tasksLoading, setTasksLoading] = useState(tasksLoadTime < openTime);
	const [error, setError] = useState<string | null>(null);
	const tasks = useSelector<RootState, Task[]>((state) => {
		return state.tasks.tasks.filter((x) => x.flatId === flatId);
	});

	const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
	const [membersLoading, setMembersLoading] = useState<{
		[taskId: number]: boolean;
	}>({});
	const [membersError, setMembersError] = useState<{
		[taskId: number]: string | null;
	}>({});

	useEffect(() => {
		if (tasksLoadTime < openTime) {
			setTasksLoading(true);
			setError(null);
			const loadTasks = async () => {
				try {
					await dispatch(fetchFlatTasks(flatId));
				} catch (err) {
					const message = new HttpErrorParser(err).getMessage();
					setError(message);
				}
				setTasksLoading(false);
			};
			setTimeout(async () => {
				loadTasks();
			}, 1100);
		}
	}, [flatId, tasksLoadTime, openTime, dispatch]);

	useEffect(() => {
		if (
			selectedTaskId &&
			!membersLoading[selectedTaskId] &&
			!membersError[selectedTaskId]
		) {
			const task = tasks.find((x) => x.id === selectedTaskId)!;
			if (!task.members) {
				const loadMembers = async (taskId: number) => {
					setMembersError((prevState) => ({
						...prevState,
						[taskId]: null,
					}));
					setMembersLoading((prevState) => ({
						...prevState,
						[taskId]: true,
					}));
					try {
						await dispatch(fetchTaskMembers(taskId));
					} catch (err) {
						setMembersError((prevState) => ({
							...prevState,
							[taskId]: err.message,
						}));
					}
					setMembersLoading((prevState) => ({
						...prevState,
						[taskId]: false,
					}));
				};

				loadMembers(selectedTaskId);
			}
		}
	}, [dispatch, flatId, membersError, membersLoading, selectedTaskId, tasks]);

	const taskSelectHandler = (id: number) => {
		navigation.navigate('TaskDetails', { id: id });
	};

	let content: JSX.Element;

	if (error) {
		content = <NotificationCard severity="error">{error}</NotificationCard>;
	} else if (tasksLoading) {
		content = (
			<Placeholder Animation={Shine}>
				<PlaceholderLine height={40} />
				<Divider />
				<PlaceholderLine height={40} />
			</Placeholder>
		);
	} else if (tasks.length === 0) {
		content = (
			<NotificationCard>There is no pending tasks for this flat.</NotificationCard>
		);
	} else {
		content = (
			<>
				{tasks.map((task, i) => {
					return (
						<React.Fragment key={task.id}>
							<List.Item
								title={task.name}
								description={task.description}
								rippleColor={theme.colors.primary}
								onPress={() => taskSelectHandler(task.id!)}
							/>
							{tasks.length > i + 1 && (
								<Divider style={{ marginHorizontal: '10%' }} />
							)}
						</React.Fragment>
					);
				})}
			</>
		);
	}

	return <View style={{ flex: 1 }}>{content}</View>;
};

export default withTheme(FlatTasksList);
