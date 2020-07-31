import React from 'react';
import {
	StyleSheet,
	View,
	ScrollView,
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
	Keyboard,
	StatusBar,
} from 'react-native';
import { withTheme, Paragraph, Divider, Title } from 'react-native-paper';
import { Theme } from 'react-native-paper/lib/typescript/src/types';
import Header from '../../../components/UI/Header';
import CustomButton from '../../../components/UI/CustomButton';
import {
	NewFlatInfoScreenNavigationProp,
	NewFlatInfoScreenRouteProps,
} from '../../../types/navigationTypes';

interface Props {
	theme: Theme;
	navigation: NewFlatInfoScreenNavigationProp;
	route: NewFlatInfoScreenRouteProps;
}

const NewFlatInfoScreen: React.FC<Props> = ({ theme, navigation }) => {
	return (
		<ScrollView
			contentContainerStyle={[
				styles.screen,
				{ backgroundColor: theme.colors.surface },
			]}
		>
			<Header style={styles.header}>New Flat Info</Header>
			<View style={styles.inputContainer}>
				<Title style={{ textAlign: 'center', marginTop: 16 }}>
					What is the "Flat"?
				</Title>
				<Paragraph style={styles.infoParagraph}>
					Every "Flat" represent a group of people most likely living
					together in apartment. That flats could be used to track
					repetitive tasks such as weekly cleaning or taking out the
					trash where those tasks are executed in queue by members.
				</Paragraph>
				<Divider />
				<Paragraph style={styles.infoParagraphHelper}>
					Members for the flat could be invited on one of next screens
					or later from flat details options.
				</Paragraph>
				<Divider />
				<Paragraph style={styles.infoParagraphHelper}>
					Flat name or description do not required real informations
					they are just for you and your flatmates to easily corelate
					place with flat in application.
				</Paragraph>
			</View>
			<View style={styles.actions}>
				<CustomButton accent onPress={() => navigation.goBack()}>
					CANCEL
				</CustomButton>
				<CustomButton onPress={() => navigation.navigate('NewFlat')}>
					NEXT
				</CustomButton>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	screen: {
		flexDirection: 'column',
		alignItems: 'center',
	},
	header: {
		paddingTop: 16,
		fontSize: 44,
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
export default withTheme(NewFlatInfoScreen);
