import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Paragraph, Title, Headline, ActivityIndicator } from 'react-native-paper';
import { RootStackParamList } from '../navigation/Navigation';
import { RouteProp } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import RootState from '../store/storeTypes';
import { StateError } from '../store/ReactTypes/customReactTypes';
import { fetchFlatOwner, fetchFlatMembers } from '../store/actions/flats';


type FlatDetailsScreenRouteProps = RouteProp<RootStackParamList, 'FlatDetails'>;

interface Props {
	route: FlatDetailsScreenRouteProps;
}

const FlatDetailsScreen: React.FC<Props> = ({ route }) => {
	const dispatch = useDispatch();
	const id = route.params.id;
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

	return (
		<ScrollView style={styles.screen}>
			<Headline>{flat.name}</Headline>
			<View style={[styles.flatCard, styles.infoContainer]}>
				{flat.owner ? (
					<Paragraph>{flat.owner.emailAddress}</Paragraph>
				) : (<ActivityIndicator />
				)}
				<Paragraph>{moment(flat.createAt).format('ll')}</Paragraph>
			</View>

			<View style={styles.flatCard}>
				<Title>Description</Title>
				<Paragraph>{flat.description}</Paragraph>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		padding: 8,
	},
	flatCard: {
		borderWidth: 1,
		borderColor: '#ccc',
		paddingHorizontal: 8,
		paddingBottom: 8,
		marginVertical: 8,
	},
	infoContainer: {},
});

export default FlatDetailsScreen;
