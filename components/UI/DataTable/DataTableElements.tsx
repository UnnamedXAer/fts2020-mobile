import React from 'react';
import { Theme } from 'react-native-paper/lib/typescript/src/types';
import { Paragraph, withTheme } from 'react-native-paper';
import { Placeholder } from 'rn-placeholder';
import { Shine, PlaceholderLine } from '../Placeholder/Placeholder';

export const DataTableHeaderCellText = ({
	theme,
	children,
}: {
	theme: Theme;
	children: React.ReactNode;
}) => {
	return (
		<Paragraph style={{ color: theme.colors.placeholder, fontSize: 12 }}>
			{children}
		</Paragraph>
	);
};

export const DataTablePlaceholderCellVal = () => (
	<Placeholder Animation={Shine} style={{ height: '80%', width: '100%' }}>
		<PlaceholderLine style={{ width: '100%', height: '100%' }} />
	</Placeholder>
);

export default withTheme(DataTableHeaderCellText);
