import React from 'react';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Paragraph, Title } from 'react-native-paper';
import { RootStackParamList } from '../navigation/Navigation';
import { RouteProp } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import RootState from '../store/storeTypes';

type FlatDetailsScreenRouteProps = RouteProp<RootStackParamList, 'FlatDetails'>;

interface Props {
	route: FlatDetailsScreenRouteProps;
}

const FlatDetailsScreen: React.FC<Props> = ({ route }) => {
	const id = route.params.id;
	const flat = useSelector((state: RootState) =>
		state.flats.flats.find((x) => x.id === id)
	)!;

	return (
		<ScrollView style={styles.screen}>
			<Title>{flat.name}</Title>
			<Paragraph>{flat.description}</Paragraph>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
	},
});

export default FlatDetailsScreen;
