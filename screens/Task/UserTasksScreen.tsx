import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
	View,
	StyleSheet,
	FlatList,
	ListRenderItem,
	RefreshControl,
	TouchableHighlight,
} from 'react-native';
import {
	Avatar,
	withTheme,
	Theme,
	Paragraph,
	Headline,
	Divider,
	Checkbox,
	Text,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { Placeholder } from 'rn-placeholder';
import RootState from '../../store/storeTypes';
import HttpErrorParser from '../../utils/parseError';
import NotificationCard from '../../components/UI/NotificationCard';
import FloatingCard from '../../components/FloatingCard';
import { StateError } from '../../store/ReactTypes/customReactTypes';
import { PlaceholderLine, Shine } from '../../components/UI/Placeholder/Placeholder';
import {
	TaskDetailsScreenNavigationProps,
	FlatDetailsScreenNavigationProps,
} from '../../types/navigationTypes';
import { fetchUserTasks, setShowInactiveTasks } from '../../store/actions/tasks';
import { UserTask } from '../../models/task';
import Link from '../../components/UI/Link';

interface Props {
	theme: Theme;
	navigation: TaskDetailsScreenNavigationProps | FlatDetailsScreenNavigationProps;
}

const FlatsScreen: React.FC<Props> = ({ theme, navigation }) => {
	const dispatch = useDispatch();
	const showInactive = useSelector((state: RootState) => state.tasks.showInactive);
	const tasks = useSelector((state: RootState) => {
		if (!showInactive) {
			return state.tasks.userTasks.filter((x) => x.active === true);
		} else {
			return state.tasks.userTasks;
		}
	});
	const tasksLoadTime = useSelector(
		(state: RootState) => state.tasks.userTasksLoadTime
	);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<StateError>(null);
	const [refreshing, setRefreshing] = useState(false);

	const isMounted = useRef(true);
	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	const loadTasks = useCallback(async () => {
		setError(null);
		try {
			await dispatch(fetchUserTasks());
		} catch (err) {
			if (isMounted.current) {
				const error = new HttpErrorParser(err);
				const msg = error.getMessage();
				setError(msg);
			}
		}
	}, [dispatch]);

	useEffect(() => {
		if (tasksLoadTime === 0) {
			setLoading(true);
			loadTasks().then(() => {
				isMounted.current && setLoading(false);
			});
		}
	}, [loadTasks, tasksLoadTime]);

	const refreshHandler = async () => {
		setRefreshing(true);
		await loadTasks();
		isMounted.current && setRefreshing(false);
	};

	const taskSelectHandler = (id: number) => {
		navigation.navigate('TaskDetails', { id: id });
	};

	const showInactiveChangeHandler = async () => {
		dispatch(setShowInactiveTasks(!showInactive));
	};

	const renderItem: ListRenderItem<UserTask> = ({ item }) => {
		return (
			<TouchableHighlight
				underlayColor={theme.colors.primary}
				onPress={() => taskSelectHandler(item.id!)}
			>
				<View style={styles.itemContainer}>
					<View style={{ marginRight: 4 }}>
						<Avatar.Icon
							color={
								item.active
									? theme.colors.primary
									: theme.colors.placeholder
							}
							style={{ backgroundColor: theme.colors.background }}
							icon="all-inclusive"
						/>
					</View>
					<View style={{ flex: 1 }}>
						<Headline>{item.name}</Headline>
						<View style={{ flexDirection: 'row' }}>
							<Paragraph>Flat: </Paragraph>
							<Paragraph style={{ color: theme.colors.placeholder }}>
								{item.flatName}
							</Paragraph>
						</View>
					</View>
				</View>
			</TouchableHighlight>
		);
	};

	return (
		<View style={styles.container}>
			<View style={styles.showInactiveContainer}>
				<Checkbox
					status={showInactive ? 'checked' : 'unchecked'}
					onPress={showInactiveChangeHandler}
					color={theme.colors.primary}
				/>
				<Text>Show Inactive Tasks</Text>
			</View>
			<FlatList
				ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={refreshHandler}
						title={'Loading tasks...'}
						colors={[theme.colors.accent, theme.colors.primary]}
					/>
				}
				keyExtractor={(item) => item.id!.toString()}
				data={tasks}
				renderItem={renderItem}
				ListEmptyComponent={
					!error ? (
						<View style={{ marginTop: '5%', marginHorizontal: 8 }}>
							{loading ? (
								<Placeholder Animation={Shine}>
									<PlaceholderLine
										height={64}
										noMargin
										style={{ borderRadius: theme.roundness }}
									/>
									<Divider style={{ marginVertical: 16 }} />
									<PlaceholderLine height={64} noMargin />
									<Divider style={{ marginVertical: 16 }} />
									<PlaceholderLine height={64} />
								</Placeholder>
							) : (
								<NotificationCard>
									You are not a member of any task. You can go to{' '}
									<Link onPress={() => navigation.navigate('Flats')}>
										Your Flats
									</Link>{' '}
									section and create task for a flat.
								</NotificationCard>
							)}
						</View>
					) : null
				}
			/>

			{error && (
				<FloatingCard
					onPress={() => {
						setError(null);
					}}
				>
					<NotificationCard severity="error">
						Could not load tasks due to following reason: {'\n'}
						{error}
					</NotificationCard>
				</FloatingCard>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'relative',
		flex: 1,
	},
	showInactiveContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	itemContainer: {
		paddingVertical: 8,
		paddingEnd: 8,
		paddingStart: 4,
		flexDirection: 'row',
	},
	itemSeparator: {
		marginHorizontal: 8,
		borderColor: 'lightblue',
		borderBottomWidth: 1,
	},
});

export default withTheme(FlatsScreen);
