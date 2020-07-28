import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Headline, withTheme } from 'react-native-paper';
import { StateError } from '../../store/ReactTypes/customReactTypes';

import NotificationCard from '../../components/UI/NotificationCard';
import { Theme } from 'react-native-paper/lib/typescript/src/types';

interface Props {
	theme: Theme;
}

const AboutScreen: React.FC<Props> = ({ theme }) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<StateError>(null);

	const isMounted = useRef(true);
	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	return (
		<>
			<ScrollView style={styles.screen}>
				{error && (
					<NotificationCard severity="error">
						{error}
					</NotificationCard>
				)}

				<View style={styles.container}>
					<Headline>About FTS 2020</Headline>
				</View>
			</ScrollView>
		</>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
	},
	container: {
		paddingTop: 24,
		justifyContent: 'center',
		alignItems: 'center',
	},
	divider: {
		marginHorizontal: 16,
	},
});

export default withTheme(AboutScreen);
