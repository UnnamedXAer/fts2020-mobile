import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import RootState from '../../store/storeTypes';
import { List, Avatar, withTheme, Theme } from 'react-native-paper';
import { Placeholder, Shine, PlaceholderLine } from 'rn-placeholder';
import { fetchFlatTasks, fetchTaskMembers } from '../../store/actions/tasks';
import HttpErrorParser from '../../utils/parseError';
import Task from '../../models/task';

interface Props {
	flatId: number;
	theme: Theme;
}

const FlatTasksList: React.FC<Props> = ({ flatId, theme }) => {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const tasks = useSelector<RootState, Task[]>((state) => {
		return state.tasks.tasks.filter((x) => x.flatId === flatId);
	});
	const tasksLoadTime = useSelector((state: RootState) => {
		const time = state.tasks.tasksLoadTimes[flatId];
		return time !== void 0 ? time : 0;
	});
	const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
	const [showTaskModal, setShowTaskModal] = useState(false);
	const [membersLoading, setMembersLoading] = useState<{
		[taskId: number]: boolean;
	}>({});
	const [membersError, setMembersError] = useState<{
		[taskId: number]: string | null;
	}>({});
	const [openTime] = useState(Date.now() - 1000 * 60 * 10);

	useEffect(() => {
		if (tasksLoadTime < openTime) {
			setLoading(true);
			setError(null);
			const loadTasks = async () => {
				try {
					await dispatch(fetchFlatTasks(flatId));
				} catch (err) {
					const message = new HttpErrorParser(err).getMessage();
					setError(message);
				}
				setLoading(false);
			};
			setTimeout(async () => {
				loadTasks();
			}, 1100);
		}
	}, [flatId, tasksLoadTime, openTime, dispatch]);

	// useEffect(() => {
	// 	if (
	// 		selectedTaskId &&
	// 		!membersLoading[selectedTaskId] &&
	// 		!membersError[selectedTaskId]
	// 	) {
	// 		const task = tasks.find((x) => x.id === selectedTaskId)!;
	// 		if (!task.members) {
	// 			const loadMembers = async (taskId: number) => {
	// 				setMembersError((prevState) => ({
	// 					...prevState,
	// 					[taskId]: null,
	// 				}));
	// 				setMembersLoading((prevState) => ({
	// 					...prevState,
	// 					[taskId]: true,
	// 				}));
	// 				try {
	// 					await dispatch(fetchTaskMembers(taskId));
	// 				} catch (err) {
	// 					setMembersError((prevState) => ({
	// 						...prevState,
	// 						[taskId]: err.message,
	// 					}));
	// 				}
	// 				setMembersLoading((prevState) => ({
	// 					...prevState,
	// 					[taskId]: false,
	// 				}));
	// 			};

	// 			loadMembers(selectedTaskId);
	// 		}
	// 	}
	// }, [dispatch, flatId, membersError, membersLoading, selectedTaskId, tasks]);

	const taskSelectHandler = (id: number) => {
		setSelectedTaskId(id);
		setShowTaskModal(true);
	};

	return (
		<View style={{ flex: 1 }}>
			{!loading ? (
				tasks.map((task) => {
					return (
						<List.Item
							key={task.id}
							title={task.name}
							description={task.description}
							right={(props) => (
								<Avatar.Icon
									icon="check"
									size={24}
									theme={{
										colors: {
											primary: theme.colors.disabled,
										},
									}}
								/>
							)}
							rippleColor={theme.colors.primary}
							onPress={() => taskSelectHandler(task.id!)}
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
	);
};

export default withTheme(FlatTasksList);
