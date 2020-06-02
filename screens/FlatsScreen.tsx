import React, { useEffect, useState } from 'react';
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
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import RootState from '../store/storeTypes';
import { fetchFlats } from '../store/actions/flats';
import HttpErrorParser from '../utils/parseError';
import Flat from '../models/flat';
import NotificationCard from '../components/UI/NotificationCard';
import FloatingCard from '../components/FloatingCard';
import { StackNavigationProp } from '@react-navigation/stack';
import { StateError } from '../store/ReactTypes/customReactTypes';
import { RootStackParamList } from '../types/types';
import { Placeholder } from 'rn-placeholder';
import { PlaceholderLine, Shine } from '../components/UI/Placeholder/Placeholder';

type FaltDetailsScreenNavigationProps = StackNavigationProp<
	RootStackParamList,
	'FlatDetails'
>;

interface Props {
	theme: Theme;
	navigation: FaltDetailsScreenNavigationProps;
}

const FlatsScreen: React.FC<Props> = ({ theme, navigation }) => {
	const dispatch = useDispatch();
	const flats = useSelector((state: RootState) => state.flats.flats);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<StateError>(null);
	const [refreshing, setRefreshing] = useState(false);

	const loadFlats = React.useMemo(
		() => async () => {
			setError(null);
			try {
				await dispatch(fetchFlats());
			} catch (err) {
				const error = new HttpErrorParser(err);
				const msg = error.getMessage();
				setError(msg);
			}
		},
		[dispatch]
	);
	useEffect(() => {
		setLoading(true);
		loadFlats().then(() => {
			setLoading(false);
		});
	}, []);

	const refreshHandler = async () => {
		setRefreshing(true);
		await loadFlats();
		setRefreshing(false);
	};

	const flatSelectHandler = (id: number) => {
		navigation.navigate('FlatDetails', { id: id });
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
							color={theme.colors.primary}
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
								<NotificationCard>
									Your are not a member of any flat yet.{'\n'}Add new
									flat or find existing.
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
					<NotificationCard serverity="error">{error}</NotificationCard>
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
});

export default withTheme(FlatsScreen);
