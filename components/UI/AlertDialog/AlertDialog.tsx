import React from 'react';
import {
	Dialog,
	Paragraph,
	Portal,
	Button,
	useTheme,
	ActivityIndicator,
} from 'react-native-paper';

type AlertDialogAction = {
	label: string;
	onPress: () => void | Promise<void>;
	color?: 'primary' | 'accent';
};

export type AlertDialogData = {
	open: boolean;
	onDismiss: () => void;
	actions?: AlertDialogAction[];
	content: React.ReactNode | string;
	title: string;
	loading: boolean;
};

interface Props {
	data: AlertDialogData;
}

const AlertDialog: React.FC<Props> = (props) => {
	const { open, onDismiss, actions, content, title, loading } = props.data;
	const theme = useTheme();
	return (
		<Portal>
			<Dialog visible={open} onDismiss={onDismiss}>
				<Dialog.Title>{title}</Dialog.Title>
				<Dialog.Content>
					{typeof content === 'string' ? (
						<Paragraph>{content}</Paragraph>
					) : (
						{ content }
					)}
				</Dialog.Content>
				<Dialog.Actions>
					{loading && <ActivityIndicator size={16} />}
					{actions ? (
						actions.map((action) => (
							<Button
								key={action.label}
								color={theme.colors[action.color || 'primary']}
								onPress={action.onPress}
								disabled={loading}
							>
								{action.label}
							</Button>
						))
					) : (
						<Button
							onPress={onDismiss}
							color={theme.colors['primary']}
							loading={loading}
						>
							Ok
						</Button>
					)}
				</Dialog.Actions>
			</Dialog>
		</Portal>
	);
};

export default AlertDialog;
