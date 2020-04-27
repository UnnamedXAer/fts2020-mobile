import React from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { Provider as PaperProvider, Colors, DefaultTheme } from 'react-native-paper';
import AppNavitaionContainer from './navigation/Navigation';
import store from './store/store';

export default function App() {
	return (
		<StoreProvider store={store}>
			<PaperProvider
				theme={{
					...DefaultTheme,
					colors: {
						...DefaultTheme.colors,
						primary: Colors.teal500,
						accent: Colors.orange500
					},
					
				}}
			>
				<AppNavitaionContainer />
			</PaperProvider>
		</StoreProvider>
	);
}
