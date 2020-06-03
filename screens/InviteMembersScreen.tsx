import React, { MutableRefObject, useRef, useState } from 'react';
import {
	StyleSheet,
	View,
	ScrollView,
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
	Keyboard,
	TextInput as TextInputType,
} from 'react-native';
import { withTheme, Paragraph, Divider, Title, TextInput } from 'react-native-paper';
import { Theme } from 'react-native-paper/lib/typescript/src/types';
import Header from '../components/UI/Header';
import CustomButton from '../components/UI/CustomButton';
import { InviteMembersScreenNavigationProps } from '../types/types';
import { StateError } from '../store/ReactTypes/customReactTypes';

interface Props {
	theme: Theme;
	navigation: InviteMembersScreenNavigationProps;
}

const InviteMembersScreen: React.FC<Props> = ({ theme, navigation }) => {
	const emailInpRef: MutableRefObject<TextInputType | undefined> = useRef();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<StateError>(null);

	return (
		<KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior="height">
			<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
				<ScrollView
					contentContainerStyle={[
						styles.screen,
						{ backgroundColor: theme.colors.surface },
					]}
				>
					<View style={styles.inputContainer}>
						<Title style={{ textAlign: 'center', marginTop: 16 }}>
							Members invitations
						</Title>
						<Paragraph style={styles.infoParagraph}>
							Add users by entering their email address. These users will
							receive an email asking them to accept the invitation.
							Invitation will be sent also to people not registered in
							FTS2020.
						</Paragraph>
						<Divider />
						<Paragraph style={styles.infoParagraphHelper}>
							New members can be invited later.
						</Paragraph>
						<Divider />
					</View>
					<View style={styles.inputContainer}>
						<TextInput
							mode="flat"
							keyboardType="email-address"
							error={!!error}
							ref={emailInpRef as MutableRefObject<TextInputType>}
						/>
					</View>
					<View style={styles.actions}>
						<CustomButton
							accent
							onPress={() => navigation.navigate('FlatDetails')}
						>
							LATER
						</CustomButton>
						<CustomButton onPress={() => navigation.navigate('FlatDetails')}>
							SEND
						</CustomButton>
					</View>
				</ScrollView>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	keyboardAvoidingView: {
		flex: 1,
	},
	screen: {
		flexDirection: 'column',
		alignItems: 'center',
	},
	infoParagraph: {
		fontSize: 20,
		marginVertical: 8,
	},
	infoParagraphHelper: {
		fontSize: 14,
		color: '#666',
		marginVertical: 8,
	},
	inputContainer: {
		width: '90%',
		maxWidth: 400,
		marginVertical: 4,
	},
	actions: {
		flexDirection: 'row',
		alignItems: 'flex-end',
	},
});
export default withTheme(InviteMembersScreen);
