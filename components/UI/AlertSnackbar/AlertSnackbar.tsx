import React from 'react';
import { Snackbar, useTheme } from 'react-native-paper';
import { assertUnreachable } from '../../../utils/assertUnreachable';
import { Severity } from '../../../store/ReactTypes/customReactTypes';

type AlertDialogAction = {
	label: string;
	onPress: () => void;
};

export type AlertSnackbarData = {
	open: boolean;
	onClose: () => void;
	content: string;
	action?: AlertDialogAction;
	severity?: Severity;
	timeout?: number;
};

interface Props {
	data: AlertSnackbarData;
}

const AlertSnackbar: React.FC<Props> = (props) => {
	const { severity = 'info', open, onClose, content, action, timeout } = props.data;
	const theme = useTheme();

	let backgroundColor: string;
	let color: string;

	switch (severity) {
		case 'error':
			backgroundColor = 'rgb(253, 236, 234)';
			color = 'rgb(97, 26, 21)';
			break;
		case 'info':
			backgroundColor = 'rgb(232, 244, 253)';
			color = 'rgb(13, 60, 97)';
			break;
		case 'success':
			backgroundColor = 'rgb(237, 247, 237)';
			color = 'rgb(30, 70, 32)';
			break;
		case 'warning':
			backgroundColor = 'rgb(255, 244, 229)';
			color = 'rgb(102, 60, 0)';
			break;
		default:
			assertUnreachable(severity);
	}

	return (
		<Snackbar
			theme={{
				...theme,
				colors: {
					...theme.colors,
					accent: color,
					onSurface: backgroundColor,
					surface: color,
				},
			}}
			visible={open}
			onDismiss={onClose}
			action={action}
			duration={timeout}
			style={{ borderColor: color, borderWidth: 1 }}
		>
			{content}
		</Snackbar>
	);
};

export default AlertSnackbar;
