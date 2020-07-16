import React, { useEffect, useState, useCallback } from 'react';
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
	FAB,
	Text,
	Checkbox,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import RootState from '../../store/storeTypes';
import { fetchFlats, setShowInactiveFlats } from '../../store/actions/flats';
import HttpErrorParser from '../../utils/parseError';
import Flat from '../../models/flat';
import NotificationCard from '../../components/UI/NotificationCard';
import { StateError } from '../../store/ReactTypes/customReactTypes';
import { FlatDetailsScreenNavigationProps } from '../../types/navigationTypes';
import { Placeholder } from 'rn-placeholder';
import { PlaceholderLine, Shine } from '../../components/UI/Placeholder/Placeholder';

interface Props {
	theme: Theme;
	navigation: FlatDetailsScreenNavigationProps;
}

const FlatsScreen: React.FC<Props> = ({ theme, navigation }) => {
	const dispatch = useDispatch();
	const showInactive = useSelector((state: RootState) => state.flats.showInactive);
	const flats = useSelector((state: RootState) => {
		if (!showInactive) {
			return state.flats.flats.filter((x) => x.active === true);
		} else {
			return state.flats.flats;
		}
	});
	const flatsLoadTime = useSelector((state: RootState) => state.flats.flatsLoadTime);
	const [loading, setLoading] = useState(flatsLoadTime === 0);
	const [error, setError] = useState<StateError>(null);
	const [refreshing, setRefreshing] = useState(false);

	const loadFlats = useCallback(async () => {
		setError(null);
		try {
			await dispatch(fetchFlats());
		} catch (err) {
			const error = new HttpErrorParser(err);
			const msg = error.getMessage();
			setError(msg);
		}
	}, [dispatch]);

	useEffect(() => {
		if (flatsLoadTime === 0) {
			setLoading(true);
			loadFlats().finally(() => {
				setLoading(false);
			});
		}
	}, [loadFlats, flatsLoadTime]);

	const refreshHandler = async () => {
		setRefreshing(true);
		await loadFlats();
		setRefreshing(false);
	};

	const flatSelectHandler = (id: number) => {
		navigation.navigate('FlatDetails', { id: id });
	};

	const showInactiveChangeHandler = async () => {
		dispatch(setShowInactiveFlats(!showInactive));
	};

	const renderItem: ListRenderItem<Flat> = ({ item }) => {
		return (
			<TouchableHighlight
				underlayColor={theme.colors.primary}
				onPress={() => flatSelectHandler(item.id!)}
			>
				<View
					style={{
						paddingVertical: 8,
						paddingEnd: 8,
						paddingStart: 4,
						flexDirection: 'row',
					}}
				>
					<View style={{ marginRight: 4 }}>
						<Avatar.Icon
							color={
								item.active
									? theme.colors.primary
									: theme.colors.placeholder
							}
							style={{ backgroundColor: theme.colors.background }}
							icon="home-city-outline"
						/>
					</View>
					<View style={{ flex: 1 }}>
						<Headline>{item.name}</Headline>
						<Paragraph>{item.description}</Paragraph>
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
				<Text>Show Inactive Flats</Text>
			</View>
			{error && (
				<NotificationCard
					severity="error"
					onPress={() => {
						setError(null);
					}}
				>
					Sorry, could not load flats. Please try again later.
				</NotificationCard>
			)}
			<FlatList
				ItemSeparatorComponent={() => (
					<View
						style={{
							marginHorizontal: 8,
							borderColor: 'lightblue',
							borderBottomWidth: 1,
						}}
					/>
				)}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={refreshHandler}
						title={'Loading flats...'}
						colors={[theme.colors.accent, theme.colors.primary]}
					/>
				}
				keyExtractor={(item) => item.id!.toString()}
				data={flats}
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
								<NotificationCard
									childrens={[
										'You are not a member of any active flat. ',
										{
											onPress: () =>
												navigation.navigate('NewFlatInfo'),
											text: 'Add ',
										},
										'your first flat or find one.',
									]}
								/>
							)}
						</View>
					) : null
				}
			/>
			<FAB
				style={styles.fab}
				icon="plus"
				color="white"
				onPress={() => navigation.navigate('NewFlatInfo')}
			></FAB>
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
	fab: {
		position: 'absolute',
		margin: 16,
		right: 0,
		bottom: 0,
	},
});

export default withTheme(FlatsScreen);
