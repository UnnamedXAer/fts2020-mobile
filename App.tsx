import React, { useEffect, useState } from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigationContainer from './navigation/Navigation';
// import * as SplashScreen from 'expo-splash-screen';
import store from './store/store';
import { paperTheme } from './config/theme';
import AppLoading from 'expo-app-loading';
// console.log('0000 ', SplashScreen);
export default function App() {
	const [loading, setLoading] = useState(true);

	const init = () => {
		setLoading(true);
	};

	useEffect(() => {
		init();
	}, []);

	if (loading) {
		return <AppLoading autoHideSplash />;
	}

	// if (loading) {
	// 	return (
	// 		<AppLoading startAsync={async () => {}} onFinish={() => setLoading(false)} />
	// 	);
	// }

	// const init = async () => {
	// 	try {
	// 		// Keep on showing the SlashScreen
	// 		await SplashScreen.preventAutoHideAsync();
	// 	} catch (err) {
	// 		console.log('splashScreen error:', err);
	// 	} finally {
	// 		setLoading(true);
	// 		// Hiding the SplashScreen
	// 		await SplashScreen.hideAsync();
	// 	}
	// };

	if (loading) {
		return null;
	}

	return (
		<StoreProvider store={store}>
			<PaperProvider theme={paperTheme}>
				<AppNavigationContainer />
			</PaperProvider>
		</StoreProvider>
	);
}
