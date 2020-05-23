import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { StyleSheet, View, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Paragraph, Title, Headline, useTheme, Divider, Text } from 'react-native-paper';
import { Placeholder, PlaceholderLine, Shine } from 'rn-placeholder';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/Navigation';
import { RouteProp } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import RootState from '../store/storeTypes';
import { StateError } from '../store/ReactTypes/customReactTypes';
import { fetchFlatOwner, fetchFlatMembers } from '../store/actions/flats';
import Link from '../components/UI/Link';

type FlatDetailsScreenRouteProps = RouteProp<RootStackParamList, 'FlatDetails'>;

interface Props {
	route: FlatDetailsScreenRouteProps;
}

const dimensions = Dimensions.get('screen');
console.log(dimensions);

const FlatDetailsScreen: React.FC<Props> = ({ route }) => {
	const theme = useTheme();
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

	const personClickHandler = (id: number) => {
		// navigate
	};

	return (
		<ScrollView style={styles.screen}>
			<Headline style={{ alignSelf: 'center', paddingTop: 24 }}>
				{flat.name}
			</Headline>

			<View style={[styles.section, styles.infoContainer]}>
				<View style={styles.avatarContainer}>
					<View
						style={[
							{ backgroundColor: theme.colors.disabled },
							styles.avatar,
						]}
					>
						<MaterialCommunityIcons
							name="home-city-outline"
							size={40}
							color={theme.colors.background}
						/>
					</View>
				</View>
				<View
					style={{
						minWidth: (() => {
							const x = dimensions.width - 32 - 16 - 64;
							console.log(x);
							return x;
						})(),

						marginStart: 8,
						justifyContent: 'center',
					}}
				>
					{flat.owner ? (
						<>
							<View
								style={{
									flexDirection: 'row',
									flexWrap: 'wrap',
									justifyContent: 'flex-start',
								}}
							>
								<Text>Created by </Text>
								<Link onPress={() => personClickHandler(flat.owner!.id)}>
									tereszkiewiczkamil@gmail.com
								</Link>
							</View>
							<Text>Created at {moment(flat.createAt).format('ll')}</Text>
						</>
					) : (
						<Placeholder Animation={Shine}>
							<PlaceholderLine height={16} />
							<PlaceholderLine height={16} />
						</Placeholder>
					)}
				</View>
			</View>
			<Divider style={styles.divider} />
			<View style={styles.section}>
				<Title>Description</Title>
				<Paragraph>{flat.description}</Paragraph>
			</View>
			<Divider style={styles.divider} />
			<View style={styles.section}>
				<Title>Members</Title>
			</View>
			<Divider style={styles.divider} />
			<View style={styles.section}>
				<Title>Tasks</Title>
			</View>
		</ScrollView>
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
	infoContainer: {
		paddingVertical: 8,
		justifyContent: 'center',
		flexWrap: 'wrap',
		flexDirection: 'row',
	},
	avatarContainer: {
		marginVertical: 8,
		height: 64,
		width: 64,
		borderRadius: 32,
		backgroundColor: 'white',
		overflow: 'hidden',
	},
	avatar: {
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
	},
	divider: {
		marginHorizontal: 16,
	},
});

export default FlatDetailsScreen;
