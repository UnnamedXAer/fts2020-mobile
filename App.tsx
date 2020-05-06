import React, { useState } from 'react';
import { AppLoading } from 'expo';
import { Provider as StoreProvider, useDispatch, useSelector } from 'react-redux';
import { Provider as PaperProvider, Colors, DefaultTheme } from 'react-native-paper';
import AppNavitaionContainer from './navigation/Navigation';
import store from './store/store';
import { tryAuthorize } from './store/actions/auth';

export default function App() {
	const [loading, setLoading] = useState(true);

	if (loading) {
		return (
			<AppLoading
				startAsync={async () => {}}
				onFinish={() => setLoading(false)}
			/>
		);
	}

	return (
		<StoreProvider store={store}>
			<PaperProvider
				theme={{
					...DefaultTheme,
					colors: {
						...DefaultTheme.colors,
						primary: Colors.teal500,
						accent: Colors.orange500,
					},
				}}
			>
				<AppNavitaionContainer />
			</PaperProvider>
		</StoreProvider>
	);
}
