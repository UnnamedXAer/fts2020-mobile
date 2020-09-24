import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { AuthProvider, ProviderDisplayName } from '../../../types/types';

interface Props {
	providerPressHandler: (provider: ProviderDisplayName) => Promise<void>;
	loadingProvider: AuthProvider;
}

const ExternalProviders: React.FC<Props> = ({
	providerPressHandler,
	loadingProvider,
}) => {
	return (
		<View
			style={{
				flexDirection: 'row',
				justifyContent: 'space-evenly',
				alignItems: 'flex-start',
				flexWrap: 'wrap',
			}}
		>
			<Button
				style={{
					margin: 8,
				}}
				labelStyle={{
					fontSize: 16,
				}}
				onPress={() => providerPressHandler('GitHub')}
				loading={loadingProvider === 'GitHub'}
				icon="github-circle"
				mode="outlined"
				color="rgb(85, 85, 85)"
			>
				GitHub
			</Button>
			<Button
				style={{
					margin: 8,
				}}
				labelStyle={{
					fontSize: 16,
				}}
				onPress={() => providerPressHandler('Google')}
				loading={loadingProvider === 'Google'}
				icon="google"
				mode="outlined"
				color="rgb(203, 63, 34)"
			>
				Google
			</Button>
		</View>
	);
};
export default ExternalProviders;
