import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { withTheme, Theme, Divider, Paragraph } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { Placeholder } from 'rn-placeholder';
import RootState from '../../store/storeTypes';
import HttpErrorParser from '../../utils/parseError';
import NotificationCard from '../../components/UI/NotificationCard';
import { StateError } from '../../store/ReactTypes/customReactTypes';
import { PlaceholderLine, Shine } from '../../components/UI/Placeholder/Placeholder';
import {
	fetchUserInvitations,
	answerUserInvitations,
} from '../../store/actions/invitations';
import { InvitationsScreenNavigationProp } from '../../types/invitationsNavigationTypes';
import { InvitationRenderItem } from '../../components/Invitation/InvitationRenderItem';
import AlertDialog, {
	AlertDialogData,
} from '../../components/UI/AlertDialog/AlertDialog';
import AlertSnackbar, {
	AlertSnackbarData,
} from '../../components/UI/AlertSnackbar/AlertSnackbar';
import { invitationInactiveStatuses, InvitationAction } from '../../constants/invitation';

interface Props {
	theme: Theme;
	navigation: InvitationsScreenNavigationProp;
}

const InvitationsScreen: React.FC<Props> = ({ theme, navigation }) => {
	const dispatch = useDispatch();
	const invitations = useSelector((state: RootState) =>
		state.invitations.userInvitations?.filter(
			(x) => !invitationInactiveStatuses.includes(x.status)
		)
	);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<StateError>(null);
	const [refreshing, setRefreshing] = useState(false);
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
		if (!loading && error === null && !invitations) {
			setLoading(true);
			loadInvitations().finally(() => {
				isMounted.current && setLoading(false);
			});
		}
	}, [loadInvitations]);

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

	const refreshHandler = async () => {
		setRefreshing(true);
		await loadInvitations();
		isMounted.current && setRefreshing(false);
	};

	const answerInvitation = async (
		id: number,
		answer: InvitationAction.ACCEPT | InvitationAction.REJECT
	) => {
		setDialogData((prevState) => ({ ...prevState, loading: true }));
		try {
			await dispatch(answerUserInvitations(id, answer));
			isMounted.current &&
				setSnackbarData({
					open: true,
					action: {
						label: 'OK',
						onPress: closeSnackbarAlertHandler,
					},
					severity: 'success',
					timeout: 3000,
					content: 'Invitation ' + answer.toLocaleLowerCase() + 'ed.',
					onClose: closeSnackbarAlertHandler,
				});
		} catch (err) {
			if (isMounted.current) {
				const error = new HttpErrorParser(err);
				const msg = error.getMessage();
				setSnackbarData({
					open: true,
					action: {
						label: 'OK',
						onPress: closeSnackbarAlertHandler,
					},
					severity: 'error',
					timeout: 4000,
					content: 'Could save you answer due to following error:\n' + msg,
					onClose: closeSnackbarAlertHandler,
				});
			}
		} finally {
			if (isMounted.current) {
				setDialogData((prevState) => ({
					...prevState,
					open: false,
				}));
			}
		}
	};

	const invitationSelectHandler = (id: number) => {
		const invitation = invitations!.find((x) => x.id === id)!;

		setDialogData({
			open: true,
			content: (
				<View>
					<NotificationCard hideIcon fontSize={14}>
						Would you like to accept invitation to flat:{' '}
						<Paragraph
							style={{ color: 'rgb(13, 60, 97)', fontWeight: 'bold' }}
						>
							{invitation.flat.name}
						</Paragraph>{' '}
						sent by{' '}
						<Paragraph
							style={{ color: 'rgb(13, 60, 97)', fontWeight: 'bold' }}
						>
							{invitation.sender.emailAddress} ({invitation.sender.userName}
							)
						</Paragraph>
						?
					</NotificationCard>
				</View>
			),
			title: 'Invitation',
			onDismiss: closeDialogAlertHandler,
			loading: false,
			actions: [
				{
					label: 'Accept',
					onPress: () => answerInvitation(id, InvitationAction.ACCEPT),
					color: 'primary',
				},
				{
					label: 'Reject',
					onPress: () => answerInvitation(id, InvitationAction.REJECT),
					color: 'error',
				},
				{
					color: 'accent',
					label: 'Cancel',
					onPress: closeDialogAlertHandler,
				},
			],
		});
	};

	return (
		<>
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
					renderItem={({ item }) => (
						<InvitationRenderItem
							item={item}
							onSelect={invitationSelectHandler}
							theme={theme}
						/>
					)}
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
										childrens={['There is no invitations.']}
									/>
								)}
							</View>
						) : null
					}
				/>
			</View>

			<AlertDialog data={dialogData} />
			<AlertSnackbar data={snackbarData} />
		</>
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
