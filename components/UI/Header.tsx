import React from 'react';
import { withTheme, Theme, Text } from 'react-native-paper';
import { StyleProp, TextStyle } from 'react-native';

interface Props {
	theme: Theme;
	children: React.ReactNode;
	style?: TextStyle;
}

const Header: React.FC<Props> = (props) => {
	const { theme } = props;

	return (
		<Text
			style={{
                color: theme.colors.primary,
                fontWeight: '600',
                fontSize: 36,
                fontVariant: ['small-caps'],
                textTransform: 'uppercase',
                textAlign: 'center',
                textAlignVertical: 'center',
				...props.style,
			}}
		>
			{props.children}
		</Text>
	);
};

export default withTheme(Header);
