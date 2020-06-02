import React from 'react';
import {
	PlaceholderLine as PlaceholderLineNative,
	Shine as ShineNative,
} from 'rn-placeholder';
import { ILine } from 'rn-placeholder/lib/PlaceholderLine';
import { IShine } from 'rn-placeholder/lib/animations/Shine';
import { useTheme } from 'react-native-paper';

export const PlaceholderLine: React.FC<ILine> = (props) => {
	const theme = useTheme();
	return <PlaceholderLineNative style={{ borderRadius: theme.roundness }} {...props} />;
};

export const Shine: React.FC<IShine> = (props) => (
	<ShineNative {...props} duration={1500} />
);
