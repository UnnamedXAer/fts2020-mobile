import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../store/actions/auth';
import RootState from '../store/storeTypes';
import { StateError } from '../store/ReactTypes/customReactTypes';
import { fetchFlats } from '../store/actions/flats';
import HttpErrorParser from '../utils/parseError';

const FlatsScreen = () => {
	const dispatch = useDispatch();
	const flats = useSelector((state: RootState) => state.flats.flats);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<StateError>(null);

	useEffect(() => {
		if (!flats) {
			setLoading(true);
			setError(null);
			const loadFlats = async () => {
				try {
					await dispatch(fetchFlats());
				} catch (err) {
					const error = new HttpErrorParser(err);
					const msg = error.getMessage();
					setError(msg);
				}
				setLoading(false);
			};
			loadFlats();
		}
	}, [dispatch]);

	return (
		<View style={styles.container}>
			<Text>Flats screen</Text>
			<Button onPress={() => dispatch(logOut())}>Log Out</Button>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export default FlatsScreen;
