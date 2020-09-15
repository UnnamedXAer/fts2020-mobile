import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, RefreshControl } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { withTheme, Headline, Paragraph } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { Theme } from 'react-native-paper/lib/typescript/src/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import RootState from '../../store/storeTypes';
import { StateError } from '../../store/ReactTypes/customReactTypes';
import HttpErrorParser from '../../utils/parseError';
import AlertSnackbar, {
	AlertSnackbarData,
} from '../../components/UI/AlertSnackbar/AlertSnackbar';
import {
	fetchUserInvitation,
	answerUserInvitations,
} from '../../store/actions/invitations';
import { InvitationDetailsScreenRouteProps } from '../../types/invitationsRoutePropTypes';
import { InvitationDetailsScreenNavigationProp } from '../../types/invitationsNavigationTypes';
import NotificationCard from '../../components/UI/NotificationCard';
import CustomButton from '../../components/UI/CustomButton';
import { InvitationAction, InvitationStatus } from '../../constants/invitation';
import InvitationDetailsInfo from '../../components/Invitation/InvitationDetailsInfo';
import InvitationDetailsFlatInfo from '../../components/Invitation/InvitationDetailsFlatInfo';
import User from '../../models/user';

interface Props {
	route: InvitationDetailsScreenRouteProps;
	navigation: InvitationDetailsScreenNavigationProp;
	theme: Theme;
}

function validateInvitationStatus(status: InvitationStatus | undefined) {
	let warning: string | null = null;
	if (status) {
		if ([InvitationStatus.ACCEPTED, InvitationStatus.REJECTED].includes(status)) {
			warning = 'Invitation already ' + status.toLocaleLowerCase() + '.';
		} else if (status === InvitationStatus.EXPIRED) {
			warning = 'Invitation expired.';
		} else if (status === InvitationStatus.CANCELED) {
			warning = 'Invitation was cancelled.';
		}
	}
	return warning;
}

const InvitationDetailsScreen: React.FC<Props> = ({ route, navigation, theme }) => {
	const dispatch = useDispatch();
	const token = route.params.token;
	const invitation = useSelector((state: RootState) =>
		state.invitations.userInvitations?.find((x) => x.token === token)
	);
	const [invitationLoadTime, setInvitationLoadTime] = useState(
		invitation ? Date.now() : 0
	);

	const loggedUser = useSelector((state: RootState) => state.auth.user!);
	const [error, setError] = useState<StateError>(null);
	const [loadingAnswer, setAnswerLoading] = useState(false);
	const [refreshing, setRefreshing] = useState(false);

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

	const refreshHandler = async () => {
		setRefreshing(true);
		try {
			await dispatch(fetchUserInvitation(token));
		} catch (err) {
			if (isMounted.current) {
				const error = new HttpErrorParser(err);
				const msg = error.getMessage();
				setSnackbarData({
					open: true,
					content: msg,
					onClose: closeSnackbarAlertHandler,
					severity: 'error',
					timeout: 3000,
					action: {
						label: 'X',
						onPress: closeSnackbarAlertHandler,
					},
				});
			}
		}
		if (isMounted.current) {
			setRefreshing(false);
		}
	};

	useEffect(() => {
		if (!invitation && invitationLoadTime === 0) {
			const loadInvitation = async () => {
				setError(null);
				setInvitationLoadTime(Date.now());
				try {
					await dispatch(fetchUserInvitation(token));
				} catch (err) {
					if (isMounted.current) {
						const error = new HttpErrorParser(err);
						const msg = error.getMessage();
						setError(msg);
					}
				}
			};
			loadInvitation();
		}
	}, [dispatch, invitation, invitationLoadTime, token]);

	const closeSnackbarAlertHandler = () =>
		setSnackbarData((prevState) => ({
			...prevState,
			open: false,
		}));

	const actionHandler = async (
		action: InvitationAction.ACCEPT | InvitationAction.REJECT
	) => {
		setAnswerLoading(true);
		try {
			await dispatch(answerUserInvitations(invitation!.id, action));
			if (isMounted.current) {
				navigation.goBack();
				if (action === InvitationAction.ACCEPT) {
					navigation.navigate('RootStack', {
						screen: 'FlatDetails',
						params: { id: invitation!.flat.id! },
					});
				}
			}
		} catch (err) {
			if (isMounted.current) {
				const httpError = new HttpErrorParser(err);
				const msg = httpError.getMessage();
				setSnackbarData({
					open: true,
					content: msg,
					timeout: 3000,
					onClose: closeSnackbarAlertHandler,
					severity: 'error',
					action: {
						label: 'X',
						onPress: closeSnackbarAlertHandler,
					},
				});
				setAnswerLoading(false);
			}
		}
	};

	const invitationStatusWarning = validateInvitationStatus(invitation?.status);

	return (
		<>
			<ScrollView
				style={styles.screen}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={refreshHandler}
						title={'Loading...'}
						colors={[theme.colors.accent, theme.colors.primary]}
					/>
				}
			>
				<View style={[styles.container, styles.headerContainer]}>
					<Headline
						style={{
							textAlign: 'center',
							color: theme.colors.primary,
						}}
					>
						Flat Invitation
					</Headline>
				</View>
				{error ||
				(invitation &&
					(invitation.invitedPerson as User).id !== loggedUser.id) ? (
					<NotificationCard severity="error">
						{invitation &&
						invitation.invitedPerson !== loggedUser.emailAddress
							? 'You do not have permissions to view or answer to this invitation.'
							: 'Could Not load invitation due to following error:\n' +
							  error}
					</NotificationCard>
				) : (
					<>
						<View style={styles.infoContainer}>
							<View style={styles.avatarContainer}>
								<View style={[styles.avatar]}>
									<MaterialCommunityIcons
										name="contact-mail-outline"
										size={40}
										color={theme.colors.primary}
									/>
								</View>
							</View>
							<InvitationDetailsInfo
								theme={theme}
								invitation={invitation}
							/>
						</View>
						<View style={styles.infoContainer}>
							<View style={styles.avatarContainer}>
								<View style={[styles.avatar]}>
									<MaterialCommunityIcons
										name="home-city-outline"
										size={40}
										color={theme.colors.primary}
									/>
								</View>
							</View>
							<InvitationDetailsFlatInfo
								flat={invitation?.flat}
								theme={theme}
							/>
						</View>
						{invitation ? (
							invitationStatusWarning ? (
								<View style={styles.section}>
									<NotificationCard severity="warning">
										{invitationStatusWarning}
									</NotificationCard>
								</View>
							) : (
								<>
									<View style={styles.section}>
										<Paragraph
											style={{ textAlign: 'center', fontSize: 16 }}
										>
											Would you like to accept invitation?
										</Paragraph>
									</View>
									<View style={[styles.section, styles.actions]}>
										<CustomButton
											onPress={() =>
												actionHandler(InvitationAction.REJECT)
											}
											disabled={loadingAnswer}
											color="error"
										>
											REJECT
										</CustomButton>
										<CustomButton
											onPress={() =>
												actionHandler(InvitationAction.ACCEPT)
											}
											loading={loadingAnswer}
										>
											ACCEPT
										</CustomButton>
									</View>
								</>
							)
						) : null}
					</>
				)}
			</ScrollView>
			<AlertSnackbar data={snackbarData} />
		</>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
	},
	container: {
		flexDirection: 'row',
		paddingTop: 24,
		justifyContent: 'center',
	},
	headerContainer: {
		marginHorizontal: 8,
		marginBottom: 8,
	},
	infoContainer: {
		padding: 8,
		justifyContent: 'flex-start',
		flexDirection: 'row',
		borderColor: '#ccc',
		borderRadius: 4,
		borderWidth: 1,
		marginHorizontal: 16,
		marginVertical: 16,
	},
	avatarContainer: {
		marginVertical: 8,
		height: 64,
		width: 64,
		borderRadius: 32,
		overflow: 'hidden',
	},
	avatar: {
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	section: {
		paddingHorizontal: 8,
		paddingBottom: 8,
	},
	divider: {
		marginHorizontal: 16,
	},
	actions: {
		flexDirection: 'row',
		justifyContent: 'center',
	},
});

export default withTheme(InvitationDetailsScreen);
