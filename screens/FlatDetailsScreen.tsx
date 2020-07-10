import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Title, FAB, Divider } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import RootState from '../store/storeTypes';
import { StateError } from '../store/ReactTypes/customReactTypes';
import { fetchFlatOwner, fetchFlatMembers } from '../store/actions/flats';
import FlatTasksList from '../components/Flat/FlatTasksList';
import {
	FlatDetailsScreenRouteProps,
	FlatDetailsScreenNavigationProps,
} from '../types/navigationTypes';
import { FABAction } from '../types/types';
import DetailsScreenInfo from '../components/DetailsScreeenInfo/DetailsScreenInfo';

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
	)!;
	const [loadingElements, setLoadingElements] = useState({
		owner: !!flat.owner,
		members: !!flat.members,
	});

	const [elementsErrors, setElementsErrors] = useState<{
		owner: StateError;
		members: StateError;
	}>({
		owner: null,
		members: null,
	});

	useEffect(() => {
		if (!flat.owner && !loadingElements.owner && !elementsErrors.owner) {
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

		if (!flat.members && !loadingElements.members && !elementsErrors.members) {
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

	const FABActions: FABAction[] = [];
	if (loggedUser && flat) {
		if (flat.active) {
			FABActions.push({
				icon: 'table-plus',
				onPress: () =>
					navigation.navigate('NewTaskName', {
						flatId: id,
					}),
				label: 'Add Task',
			});
			if (flat.ownerId === loggedUser.id) {
				FABActions.push(
					{
						icon: 'close-box-outline',
						onPress: () => {
							console.log('Closing flat.');
						},
						label: 'Close Flat',
					},
					{
						icon: 'account-multiple-plus',
						onPress: () =>
							navigation.navigate('InviteMembers', {
								flatId: id,
								isNewFlat: false,
							}),
						label: 'Invite a new member',
					}
				);
			} else {
				FABActions.push({
					icon: 'exit-to-app',
					onPress: () => {
						console.log('Leaving Flat.');
					},
					label: 'Leave Flat',
				});
			}
		} else {
			if (flat.ownerId !== loggedUser.id) {
				FABActions.push({
					icon: 'exit-to-app',
					onPress: () => {
						console.log('Leaving Flat.');
					},
					label: 'Leave Flat',
				});
			} else {
				FABActions.push({
					icon: 'information-variant',
					onPress: () => {
						console.log('no actions available');
					},
					label: 'No actions available',
				});
			}
		}
	}

	return (
		<>
			<ScrollView style={styles.screen}>
				<DetailsScreenInfo
					name={flat.name}
					description={flat.description}
					iconName="home-city-outline"
					active={flat.active!}
					createAt={flat.createAt!}
					owner={flat.owner}
					members={flat.members}
					onOwnerPress={ownerPressHandler}
					onMemberSelect={memberSelectHandler}
				/>
				<View style={styles.section}>
					<Title>Invitations</Title>
				</View>
				<Divider style={styles.divider} />
				<View style={styles.section}>
					<Title>Tasks</Title>
					<FlatTasksList flatId={id!} navigation={navigation} />
				</View>
			</ScrollView>
			<FAB.Group
				visible={Boolean(flat.members && flat.owner)}
				open={fabOpen}
				color="white"
				icon={fabOpen ? 'close' : 'plus'}
				actions={FABActions}
				onStateChange={({ open }) => {
					setFabOpen(open);
				}}
			/>
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
