import React, { useState } from 'react';
import { AppLoading } from 'expo';
import { Provider as StoreProvider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavitaionContainer from './navigation/Navigation';
import store from './store/store';
import { paperTheme } from './config/theme';

export default function App() {
	const [loading, setLoading] = useState(true);

	if (loading) {
		return (
			<AppLoading startAsync={async () => {}} onFinish={() => setLoading(false)} />
		);
	}

	return (
		<StoreProvider store={store}>
			<PaperProvider theme={paperTheme}>
				<AppNavitaionContainer />
			</PaperProvider>
		</StoreProvider>
	);
}
