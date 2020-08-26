import React, { useState, useEffect, useRef, useCallback } from 'react';
import { StyleSheet, View, RefreshControl } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Title, FAB, Divider, withTheme } from 'react-native-paper';
import { Theme } from 'react-native-paper/lib/typescript/src/types';
import { useSelector, useDispatch } from 'react-redux';
import RootState from '../../store/storeTypes';
import { StateError } from '../../store/ReactTypes/customReactTypes';
import {
	fetchFlatOwner,
	fetchFlatMembers,
	updateFlat,
	leaveFlat,
	fetchFlatInvitations,
	deleteFlatMember,
	clearFlat,
	fetchFlats,
	fetchFlat,
} from '../../store/actions/flats';
import FlatTasksList from '../../components/Flat/FlatTasksList';
import { FABAction } from '../../types/types';
import DetailsScreenInfo from '../../components/DetailsScreeenInfo/DetailsScreenInfo';
import AlertDialog, {
	AlertDialogData,
} from '../../components/UI/AlertDialog/AlertDialog';
import AlertSnackbar, {
	AlertSnackbarData,
} from '../../components/UI/AlertSnackbar/AlertSnackbar';
import HttpErrorParser from '../../utils/parseError';
import { FlatData } from '../../models/flat';
import FlatInvitationsList from '../../components/Flat/FlatInvitationsList/FlatInvitationsList';
import { FlatDetailsScreenRouteProps } from '../../types/rootRoutePropTypes';
import { FlatDetailsScreenNavigationProp } from '../../types/rootNavigationTypes';

type FABActionsKeys = 'addTask' | 'leaveFlat' | 'inviteMembers' | 'closeFlat';

interface Props {
	route: FlatDetailsScreenRouteProps;
	navigation: FlatDetailsScreenNavigationProp;
	theme: Theme;
}

const FlatDetailsScreen: React.FC<Props> = ({ route, navigation, theme }) => {
	const dispatch = useDispatch();
	const [fabOpen, setFabOpen] = useState(false);
	const [error, setError] = useState<StateError>(null);
	const id = route.params.id;
	const loggedUser = useSelector((state: RootState) => state.auth.user)!;
	const flatsLoadTime = useSelector(
		(state: RootState) => state.flats.flatsLoadTime
	);
	const flat = useSelector((state: RootState) =>
		state.flats.flats.find((x) => x.id === id)
	);
	const [refreshing, setRefreshing] = useState(false);

	const [loadingElements, setLoadingElements] = useState({
		owner: false, //!!flat?.owner,
		members: false, //!!flat?.members,
		invitations: false, //!!flat?.invitations,
	});

	const [elementsErrors, setElementsErrors] = useState<{
		owner: StateError;
		members: StateError;
		invitations: StateError;
	}>({
		owner: null,
		members: null,
		invitations: null,
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

	const refreshHandler = async () => {
		setRefreshing(true);
		await dispatch(clearFlat(id));
		try {
			await dispatch(fetchFlat(id));
		} catch (err) {
			if (isMounted.current !== null) {
				const httpError = new HttpErrorParser(err);
				const msg = httpError.getMessage();
				setError(msg);
			}
		}
		if (isMounted.current) {
			setRefreshing(false);
		}
	};

	useEffect(() => {
		if (flatsLoadTime === 0) {
			const loadFlat = async () => {
				try {
					await dispatch(fetchFlats());
				} catch (err) {
					if (isMounted.current !== null) {
						const httpError = new HttpErrorParser(err);
						const msg = httpError.getMessage();
						setError(msg);
					}
				}
			};
			loadFlat();
		}
	}, [dispatch, flatsLoadTime]);

	const closeFlatHandler = async () => {
		const _flat: Partial<FlatData> = new FlatData({
			id: flat!.id,
			active: false,
		});
		setDialogData((prevState) => ({ ...prevState, loading: true }));

		try {
			await dispatch(updateFlat(_flat));
			if (isMounted.current) {
				setSnackbarData({
					open: true,
					action: {
						label: 'OK',
						onPress: closeSnackbarAlertHandler,
					},
					severity: 'success',
					timeout: 3000,
					content: 'Flat closed.',
					onClose: closeSnackbarAlertHandler,
				});
			}
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
		} finally {
			isMounted.current &&
				setDialogData((prevState) => ({
					...prevState,
					open: false,
				}));
		}
	};

	const removeMember = async (id: number) => {
		setDialogData((prevState) => ({ ...prevState, loading: true }));

		try {
			await dispatch(deleteFlatMember(flat!.id!, id));
			if (isMounted.current) {
				setSnackbarData({
					open: true,
					action: {
						label: 'OK',
						onPress: closeSnackbarAlertHandler,
					},
					severity: 'success',
					timeout: 3000,
					content: 'Member removed.',
					onClose: closeSnackbarAlertHandler,
				});
			}
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
		} finally {
			isMounted.current &&
				setDialogData((prevState) => ({
					...prevState,
					open: false,
				}));
		}
	};

	const deleteMemberHandler = (id: number) => {
		const member = flat!.members!.find((x) => x.id === id)!;

		setDialogData({
			open: true,
			content: `Do you want to remove this ${member.emailAddress} (${member.userName}) from the flat?`,
			title: 'Remove Member',
			onDismiss: closeDialogAlertHandler,
			loading: false,
			actions: [
				{
					label: 'Yes',
					onPress: () => removeMember(id),
					color: 'primary',
				},
				{
					color: 'accent',
					label: 'Cancel',
					onPress: closeDialogAlertHandler,
				},
			],
		});
	};

	const leaveFlatHandler = async () => {
		setDialogData((prevState) => ({ ...prevState, loading: true }));

		try {
			await dispatch(leaveFlat(flat!.id!));
			if (isMounted.current) {
				setSnackbarData({
					open: true,
					action: {
						label: 'OK',
						onPress: closeSnackbarAlertHandler,
					},
					severity: 'success',
					timeout: 3000,
					content: 'You left the flat.',
					onClose: closeSnackbarAlertHandler,
				});
			}
			navigation.popToTop();
		} catch (err) {
			if (isMounted.current) {
				setDialogData((prevState) => ({
					...prevState,
					open: false,
				}));
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
	};

	const closeDialogAlertHandler = () => {
		isMounted.current &&
			setDialogData((prevState) => ({
				...prevState,
				open: prevState.loading,
			}));
	};

	const closeSnackbarAlertHandler = () => {
		isMounted.current &&
			setSnackbarData((prevState) => ({
				...prevState,
				open: false,
			}));
	};

	useEffect(() => {
		if (
			flat &&
			!flat.invitations &&
			!loadingElements.invitations &&
			!elementsErrors.invitations
		) {
			const loadInvitations = async () => {
				setLoadingElements((prevState) => ({
					...prevState,
					invitations: true,
				}));
				setTimeout(async () => {
					try {
						await dispatch(fetchFlatInvitations(flat.id!));
					} catch (err) {
						setElementsErrors((prevState) => ({
							...prevState,
							invitations: err.message,
						}));
					}
					setLoadingElements((prevState) => ({
						...prevState,
						invitations: false,
					}));
				}, 1010);
			};

			loadInvitations();
		}
	}, [
		dispatch,
		flat,
		elementsErrors.invitations,
		loadingElements.invitations,
	]);

	useEffect(() => {
		if (
			flat &&
			!flat.owner &&
			!loadingElements.owner &&
			!elementsErrors.owner
		) {
			const loadOwner = async () => {
				setLoadingElements((prevState) => ({
					...prevState,
					owner: true,
				}));
				setTimeout(async () => {
					try {
						await dispatch(fetchFlatOwner(flat.ownerId, flat.id!));
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
			flat &&
			!flat.members &&
			!loadingElements.members &&
			!elementsErrors.members
		) {
			const loadMembers = async () => {
				setLoadingElements((prevState) => ({
					...prevState,
					members: true,
				}));
				try {
					await dispatch(fetchFlatMembers(flat.id!));
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
	}, [flat, dispatch, loadingElements, elementsErrors]);

	const invitationSelectHandler = (id: number) => {
		// open modal with options
	};

	const flatFABActions: {
		[key in FABActionsKeys]: FABAction;
	} = {
		closeFlat: {
			icon: 'close-box-outline',
			onPress: () => {
				setDialogData({
					open: true,
					content: 'Do you want to close this flat?',
					title: 'Close Flat',
					onDismiss: closeDialogAlertHandler,
					loading: false,
					actions: [
						{
							label: 'Yes',
							onPress: closeFlatHandler,
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
			label: 'Close Flat',
		},
		addTask: {
			icon: 'table-plus',
			onPress: () => {
				navigation.push('NewTaskName', {
					flatId: id,
				});
			},
			label: 'Add Task',
		},
		leaveFlat: {
			icon: 'exit-to-app',
			onPress: () => {
				setDialogData({
					open: true,
					content: 'Do you want to leave this flat?',
					title: 'Leave Flat',
					onDismiss: closeDialogAlertHandler,
					loading: false,
					actions: [
						{
							label: 'Yes',
							onPress: leaveFlatHandler,
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
			label: 'Leave Flat',
		},
		inviteMembers: {
			icon: 'account-multiple-plus',
			onPress: () =>
				navigation.push('InviteMembers', {
					flatId: id,
					isNewFlat: false,
				}),
			label: 'Invite a new member',
		},
	};

	const actions: FABAction[] = [];
	if (loggedUser && flat) {
		const isOwner = flat.ownerId === loggedUser.id;
		if (!isOwner) {
			actions.push(flatFABActions.leaveFlat);
		}
		if (flat.active) {
			if (isOwner) {
				actions.unshift(
					flatFABActions.closeFlat,
					flatFABActions.inviteMembers
				);
			}
			actions.push(flatFABActions.addTask);
		}
	}

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
				<DetailsScreenInfo
					navigation={navigation}
					error={error}
					name={flat?.name}
					description={flat?.description}
					iconName="home-city-outline"
					active={flat?.active!}
					createAt={flat?.createAt!}
					owner={flat?.owner}
					members={flat?.members}
					loggedUserId={loggedUser.id}
					ownerId={flat?.ownerId}
					onMemberDelete={
						loggedUser.id === flat?.ownerId
							? deleteMemberHandler
							: void 0
					}
				/>
				<View style={styles.section}>
					<FlatInvitationsList
						invitations={flat?.invitations}
						onSelect={invitationSelectHandler}
					/>
				</View>
				<Divider style={styles.divider} />
				<View style={styles.section}>
					<Title>Tasks</Title>
					<FlatTasksList
						flatId={flat?.id}
						navigation={navigation}
						refresh={refreshing}
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
});

export default withTheme(FlatDetailsScreen);
