import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Title, FAB, Divider } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import RootState from '../../store/storeTypes';
import { StateError } from '../../store/ReactTypes/customReactTypes';
import {
	fetchFlatOwner,
	fetchFlatMembers,
	updateFlat,
	leaveFlat,
} from '../../store/actions/flats';
import FlatTasksList from '../../components/Flat/FlatTasksList';
import {
	FlatDetailsScreenRouteProps,
	FlatDetailsScreenNavigationProps,
} from '../../types/navigationTypes';
import { FABAction } from '../../types/types';
import DetailsScreenInfo from '../../components/DetailsScreeenInfo/DetailsScreenInfo';
import AlertDialog, { AlertDialogData } from '../../components/UI/AlertDialog/AlertDialog';
import AlertSnackbar, {
	AlertSnackbarData,
} from '../../components/UI/AlertSnackbar/AlertSnackbar';
import HttpErrorParser from '../../utils/parseError';
import { FlatData } from '../../models/flat';

type FABActionsKeys =
	| 'addTask'
	| 'leaveFlat'
	| 'inviteMembers'
	| 'closeFlat'
	| 'noActions';

interface Props {
	route: FlatDetailsScreenRouteProps;
	navigation: FlatDetailsScreenNavigationProps;
}

const FlatDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
	const dispatch = useDispatch();
	const [fabOpen, setFabOpen] = useState(false);
	const id = route.params.id;
	const loggedUser = useSelector((state: RootState) => state.auth.user)!;
	const flat = useSelector((state: RootState) =>
		state.flats.flats.find((x) => x.id === id)
	);
	const [loadingElements, setLoadingElements] = useState({
		owner: !!flat?.owner,
		members: !!flat?.members,
	});

	const [elementsErrors, setElementsErrors] = useState<{
		owner: StateError;
		members: StateError;
	}>({
		owner: null,
		members: null,
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
		if (flat && !flat.owner && !loadingElements.owner && !elementsErrors.owner) {
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

	const ownerPressHandler = (id: number) => {
		// navigate
	};

	const memberSelectHandler = (id: number) => {
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
			onPress: () =>
				navigation.navigate('NewTaskName', {
					flatId: id,
				}),
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
				navigation.navigate('InviteMembers', {
					flatId: id,
					isNewFlat: false,
				}),
			label: 'Invite a new member',
		},
		noActions: {
			icon: 'information-variant',
			onPress: () => {},
			label: 'No actions available',
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
				actions.unshift(flatFABActions.closeFlat, flatFABActions.inviteMembers);
			}
			actions.push(flatFABActions.addTask);
		}

		if (actions.length === 0) {
			actions.push(flatFABActions.noActions);
		}
	}

	return (
		<>
			<ScrollView style={styles.screen}>
				<DetailsScreenInfo
					name={flat?.name}
					description={flat?.description}
					iconName="home-city-outline"
					active={flat?.active!}
					createAt={flat?.createAt!}
					owner={flat?.owner}
					members={flat?.members}
					onOwnerPress={ownerPressHandler}
					onMemberSelect={memberSelectHandler}
				/>
				<View style={styles.section}>
					<Title>Invitations</Title>
				</View>
				<Divider style={styles.divider} />
				<View style={styles.section}>
					<Title>Tasks</Title>
					<FlatTasksList flatId={flat?.id} navigation={navigation} />
				</View>
			</ScrollView>
			<FAB.Group
				visible={Boolean(flat?.members && flat.owner)}
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

export default FlatDetailsScreen;
