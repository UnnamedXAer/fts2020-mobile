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
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { Placeholder } from 'rn-placeholder';
import moment from 'moment';
import RootState from '../../store/storeTypes';
import HttpErrorParser from '../../utils/parseError';
import NotificationCard from '../../components/UI/NotificationCard';
import { StateError } from '../../store/ReactTypes/customReactTypes';
import { PlaceholderLine, Shine } from '../../components/UI/Placeholder/Placeholder';
import { fetchUserInvitations } from '../../store/actions/invitations';
import { InvitationPresentation } from '../../models/invitation';
import { invitationInactiveStatuses } from '../../constants/invitation';
import { InvitationsScreenNavigationProp } from '../../types/invitationsNavigationTypes';

interface Props {
	theme: Theme;
	navigation: InvitationsScreenNavigationProp;
}

const InvitationsScreen: React.FC<Props> = ({ theme, navigation }) => {
	const dispatch = useDispatch();
	const invitations = useSelector(
		(state: RootState) => state.invitations.userInvitations
	);
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

	const loadInvitations = useCallback(async () => {
		setError(null);
		try {
			await dispatch(fetchUserInvitations());
		} catch (err) {
			if (isMounted.current) {
				const error = new HttpErrorParser(err);
				const msg = error.getMessage();
				setError(msg);
			}
		}
	}, [dispatch]);

	useEffect(() => {
		if (!loading && error !== null && !invitations) {
			setLoading(true);
			loadInvitations().finally(() => {
				isMounted.current && setLoading(false);
			});
		}
	}, [loadInvitations]);

	const refreshHandler = async () => {
		setRefreshing(true);
		await loadInvitations();
		isMounted.current && setRefreshing(false);
	};

	const invitationSelectHandler = (id: number) => {
		const invitation = invitations!.find((x) => x.id === id)!;
		navigation.navigate('RootStack', {
			screen: 'FlatDetails',
			params: { id: invitation.flat.id! },
		});
	};

	const renderItem: ListRenderItem<InvitationPresentation> = ({ item }) => {
		return (
			<TouchableHighlight
				underlayColor={theme.colors.primary}
				onPress={() => invitationSelectHandler(item.id!)}
			>
				<View style={styles.itemContainer}>
					<View style={{ marginRight: 4 }}>
						<Avatar.Icon
							color={
								invitationInactiveStatuses.includes(item.status)
									? theme.colors.placeholder
									: theme.colors.primary
							}
							style={{ backgroundColor: theme.colors.background }}
							icon="all-inclusive"
						/>
					</View>
					<View style={{ flex: 1 }}>
						<Headline>{item.flat.name}</Headline>
						<View style={{ flexDirection: 'row' }}>
							<Paragraph style={{ color: theme.colors.placeholder }}>
								{item.sender.emailAddress} ({item.sender.userName})
							</Paragraph>
							<Paragraph>
								{moment(item.sendDate).format('dddd, Do MMM YYYY')}
							</Paragraph>
						</View>
					</View>
				</View>
			</TouchableHighlight>
		);
	};
	console.log('invitations', invitations?.length);
	return (
		<View style={styles.container}>
			{error && (
				<NotificationCard
					severity="error"
					onPress={() => {
						setError(null);
					}}
				>
					Sorry, could not load invitations. Please try again later.
				</NotificationCard>
			)}
			<FlatList
				ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={refreshHandler}
						title={'Loading invitations...'}
						colors={[theme.colors.accent, theme.colors.primary]}
					/>
				}
				keyExtractor={(item) => item.id!.toString()}
				data={invitations}
				renderItem={renderItem}
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
										'There is no invitations.',
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

export default withTheme(InvitationsScreen);
