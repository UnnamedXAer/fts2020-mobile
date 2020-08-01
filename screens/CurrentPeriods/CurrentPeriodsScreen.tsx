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
import { StateError } from '../../store/ReactTypes/customReactTypes';
import {
	PlaceholderLine,
	Shine,
} from '../../components/UI/Placeholder/Placeholder';
import { CurrentPeriodsScreenNavigationProp } from '../../types/currentPeriodsNavigationTypes';

interface Props {
	theme: Theme;
	navigation: CurrentPeriodsScreenNavigationProp;
}

const CurrentPeriodsScreen: React.FC<Props> = ({ theme, navigation }) => {
	const dispatch = useDispatch();

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<StateError>(null);
	const [refreshing, setRefreshing] = useState(false);

	const isMounted = useRef(true);
	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	const refreshHandler = async () => {
		setRefreshing(true);
		isMounted.current && setRefreshing(false);
	};

	const periodSelectHandler = (id: number) => {
		// navigation.navigate('TaskDetails', { id: period.taskId });
	};

	// const renderItem: ListRenderItem<UserTask> = ({ item }) => {
	// 	return (
	// 		<TouchableHighlight
	// 			underlayColor={theme.colors.primary}
	// 			onPress={() => periodSelectHandler(item.id!)}
	// 		>
	// 			<View style={styles.itemContainer}>
	// 				<View style={{ marginRight: 4 }}>
	// 					<Avatar.Icon
	// 						color={
	// 							item.active
	// 								? theme.colors.primary
	// 								: theme.colors.placeholder
	// 						}
	// 						style={{ backgroundColor: theme.colors.background }}
	// 						icon="all-inclusive"
	// 					/>
	// 				</View>
	// 				<View style={{ flex: 1 }}>
	// 					<Headline>{item.name}</Headline>
	// 					<View style={{ flexDirection: 'row' }}>
	// 						<Paragraph>Flat: </Paragraph>
	// 						<Paragraph
	// 							style={{ color: theme.colors.placeholder }}
	// 						>
	// 							{item.flatName}
	// 						</Paragraph>
	// 					</View>
	// 				</View>
	// 			</View>
	// 		</TouchableHighlight>
	// 	);
	// };

	return (
		<View style={styles.container}>
			{error && (
				<NotificationCard
					severity="error"
					onPress={() => {
						setError(null);
					}}
				>
					Sorry, could not load current periods. Please try again
					later.
				</NotificationCard>
			)}
			<FlatList
				ItemSeparatorComponent={() => (
					<View style={styles.itemSeparator} />
				)}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={refreshHandler}
						title={'Loading tasks...'}
						colors={[theme.colors.accent, theme.colors.primary]}
					/>
				}
				// keyExtractor={(item) => item.id!.toString()}
				data={[]}
				renderItem={null /*renderItem*/}
				ListEmptyComponent={
					!error ? (
						<View style={{ marginTop: '5%', marginHorizontal: 8 }}>
							{loading ? (
								<Placeholder Animation={Shine}>
									<PlaceholderLine
										height={64}
										noMargin
										style={{
											borderRadius: theme.roundness,
										}}
									/>
									<Divider style={{ marginVertical: 16 }} />
									<PlaceholderLine height={64} noMargin />
									<Divider style={{ marginVertical: 16 }} />
									<PlaceholderLine height={64} />
								</Placeholder>
							) : (
								<NotificationCard
									childrens={[
										'Currently You have nothing to do 😎.',
										// {
										// 	text: 'Tasks',
										// 	onPress: () => null,
										// 	// navigation.navigate('UserTasks'),
										// },
									]}
								/>
							)}
						</View>
					) : null
				}
			/>
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

export default withTheme(CurrentPeriodsScreen);
