import React, { useState, useEffect, useRef, MutableRefObject } from 'react';
import {
	StyleSheet,
	View,
	Dimensions,
	TextInput as TextInputType,
	TouchableWithoutFeedback,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
	Title,
	Paragraph,
	Headline,
	Avatar,
	withTheme,
	Divider,
	TextInput,
	HelperText,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { Placeholder } from 'rn-placeholder';
import { Shine, PlaceholderLine } from '../../components/UI/Placeholder/Placeholder';
import moment from 'moment';
import RootState from '../../store/storeTypes';
import { StateError } from '../../store/ReactTypes/customReactTypes';
import {
	ProfileScreenNavigationProps,
	ProfileScreenRouteProps,
} from '../../types/navigationTypes';

import HttpErrorParser from '../../utils/parseError';
import AlertDialog, {
	AlertDialogData,
} from '../../components/UI/AlertDialog/AlertDialog';
import AlertSnackbar, {
	AlertSnackbarData,
} from '../../components/UI/AlertSnackbar/AlertSnackbar';
import Link from '../../components/UI/Link';
import NotificationCard from '../../components/UI/NotificationCard';
import { Theme } from 'react-native-paper/lib/typescript/src/types';
import { fetchUser, updateUser } from '../../store/actions/users';
import validateAuthFormField from '../../utils/validation';
import User from '../../models/user';

const { width, height } = Dimensions.get('window');
const avatarWidth = width / (width < height ? 2.6 : 4);

interface Props {
	route: ProfileScreenRouteProps;
	navigation: ProfileScreenNavigationProps;
	theme: Theme;
}
type EditableFields = 'emailAddress' | 'userName' | 'avatarUrl';

const getEditedPropLabel = (fieldName: EditableFields) =>
	fieldName === 'avatarUrl'
		? 'Avatart Url'
		: fieldName === 'emailAddress'
		? 'Email Address'
		: 'User Name';

const ProfileScreen: React.FC<Props> = ({ route, navigation, theme }) => {
	const dispatch = useDispatch();
	const id = route.params.id;
	const isLoggedUser = useSelector((state: RootState) => state.auth.user!.id === id);
	const user = useSelector((state: RootState) =>
		state.users.users.find((x) => x.id === id)
	);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<StateError>(null);

	const editInpRef: MutableRefObject<TextInputType | null> = useRef(null);
	const [editValue, setEditValue] = useState('');
	const [editError, setEditError] = useState<StateError>(null);
	const [editedFieldName, setEditedFieldName] = useState<EditableFields | null>(null);

	const [dialogData, setDialogData] = useState<AlertDialogData>({
		content: '',
		onDismiss: () => {},
		title: '',
		loading: false,
		open: false,
	});
	const [snackbarData, setSnackbarData] = useState<AlertSnackbarData>({
		content: '',
		onClose: () => {},
		open: false,
	});

	const inputTextChangeHandler = (txt: string) => {
		setEditValue(txt);
	};

	const inputBlurHandler = async () => {
		const value = editValue.trim();

		const error = await validateAuthFormField(editedFieldName!, {
			[editedFieldName!]: value,
		});

		setEditError(error);
	};

	const isMounted = useRef(true);
	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	useEffect(() => {
		if (!user && !loading && error === null) {
			const loadUser = async (id: number) => {
				setLoading(true);
				setError(null);
				try {
					await dispatch(fetchUser(id));
				} catch (err) {
					if (isMounted.current) {
						const error = new HttpErrorParser(err);
						const msg = error.getMessage();
						setError(msg);
					}
				}
				isMounted.current && setLoading(false);
			};
			loadUser(id);
		}
	}, [dispatch, error, loading, user, id]);

	const closeDialogAlertHandler = () => {
		if (!dialogData.loading) {
			setEditedFieldName(null);
			setEditError(null);
			setEditValue('');
		}
	};

	const closeSnackbarAlertHandler = () =>
		setSnackbarData((prevState) => ({
			...prevState,
			open: false,
		}));

	useEffect(() => {
		setDialogData((prevState) => ({
			title: 'Edit ' + getEditedPropLabel(editedFieldName!),
			open: editedFieldName !== null,
			loading: dialogData.loading,
			content: (
				<View style={styles.inputContainer}>
					<TextInput
						ref={editInpRef}
						onChangeText={inputTextChangeHandler}
						onBlur={inputBlurHandler}
						value={editValue}
						error={editError !== null}
						disabled={dialogData.loading}
						style={[
							{
								backgroundColor: theme.colors.surface,
							},
						]}
					/>
					<HelperText type="error" visible={editError !== null}>
						{editError}
					</HelperText>
				</View>
			),
			onDismiss: closeDialogAlertHandler,
			actions: [
				{
					label: 'Save',
					onPress: submitHandler,
					color: 'primary',
				},
				{
					color: 'accent',
					label: 'Cancel',
					onPress: closeDialogAlertHandler,
				},
			],
		}));
	}, [editedFieldName, editError, editValue, dialogData.loading]);

	const onFieldEdit = (fieldName: EditableFields) => {
		setEditError(null);
		setEditedFieldName(fieldName);
		setEditValue(user![fieldName!]!);

		setDialogData({
			open: true,
			title: 'Edit ' + getEditedPropLabel(editedFieldName!),
			content: null,
			onDismiss: closeDialogAlertHandler,
			loading: false,
			actions: [
				{
					label: 'Save',
					onPress: submitHandler,
					color: 'primary',
				},
				{
					color: 'accent',
					label: 'Cancel',
					onPress: closeDialogAlertHandler,
				},
			],
		});
	};

	const submitHandler = async () => {
		let value = editValue.trim();
		if (editedFieldName === 'emailAddress') {
			value = value.toLocaleLowerCase();
		}
		if (user![editedFieldName!] !== undefined && user![editedFieldName!] === value) {
			return closeDialogAlertHandler();
		}

		const error = await validateAuthFormField(editedFieldName!, {
			[editedFieldName!]: value,
		});

		if (error) {
			return setEditError(error);
		}

		setDialogData((prevState) => ({ ...prevState, loading: true }));
		setEditError(null);
		const userData: Partial<User> = {
			[editedFieldName!]: value,
		};

		try {
			await dispatch(updateUser(user!.id, userData));
			if (isMounted.current) {
				closeDialogAlertHandler();

				setSnackbarData({
					open: true,
					action: {
						label: 'OK',
						onPress: closeSnackbarAlertHandler,
					},
					severity: 'success',
					timeout: 3000,
					content: getEditedPropLabel(editedFieldName!) + ' updated.',
					onClose: closeSnackbarAlertHandler,
				});
			}
		} catch (err) {
			if (isMounted.current) {
				const error = new HttpErrorParser(err);
				const msg = error.getMessage();
				setEditError(msg);
				setDialogData((prevState) => ({ ...prevState, loading: false }));
			}
		}
	};

	return (
		<>
			<ScrollView style={styles.screen}>
				{error && <NotificationCard severity="error">{error}</NotificationCard>}

				<View style={styles.container}>
					<TouchableWithoutFeedback
						onPress={() => onFieldEdit('avatarUrl')}
						style={[
							{ backgroundColor: theme.colors.disabled },
							styles.avatarContainer,
						]}
					>
						{user?.avatarUrl ? (
							<Avatar.Image
								style={{ backgroundColor: theme.colors.background }}
								source={{ uri: user?.avatarUrl }}
								size={avatarWidth}
							/>
						) : (
							<MaterialCommunityIcons
								name={'account'}
								size={avatarWidth}
								color={theme.colors.background}
							/>
						)}
					</TouchableWithoutFeedback>
				</View>
				<View>
					{user ? (
						<View style={styles.userNamesContainer}>
							<Headline onPress={() => onFieldEdit('emailAddress')}>
								{user!.emailAddress}
							</Headline>
							<Title onPress={() => onFieldEdit('userName')}>
								{user.userName}
							</Title>
						</View>
					) : (
						<Placeholder Animation={Shine}>
							<PlaceholderLine
								height={40}
								style={{
									width: '80%',
									alignSelf: 'center',
									marginBottom: 8,
									marginTop: 8,
								}}
							/>
							<PlaceholderLine
								height={30}
								style={{
									width: '70%',
									alignSelf: 'center',
									marginBottom: 8,
									marginTop: 8,
								}}
							/>
						</Placeholder>
					)}
				</View>
				<Divider style={styles.divider} />
				<View style={styles.container}>
					<Title>Join date:</Title>
					{user ? (
						<Paragraph style={{ alignSelf: 'center' }}>
							{moment(user.joinDate).format('LLLL')}
						</Paragraph>
					) : (
						<PlaceholderLine
							height={30}
							style={{
								width: '70%',
								alignSelf: 'center',
								marginBottom: 8,
								marginTop: 8,
							}}
						/>
					)}
				</View>
				{isLoggedUser && (
					<>
						<Divider style={styles.divider} />
						<View style={styles.container}>
							<Link
								style={{ padding: 8 }}
								onPress={() => console.log('will change password')}
							>
								Change Password
							</Link>
						</View>
					</>
				)}
			</ScrollView>
			<AlertDialog data={dialogData} />
			<AlertSnackbar data={snackbarData} />
		</>
	);
};

const styles = StyleSheet.create({
	screen: {
		flex: 1,
	},
	container: {
		paddingTop: 24,
		justifyContent: 'center',
		alignItems: 'center',
	},
	avatarContainer: {
		marginVertical: 8,
		height: avatarWidth,
		width: avatarWidth,
		borderRadius: avatarWidth,
		justifyContent: 'center',
		alignItems: 'center',
		overflow: 'hidden',
	},
	userNamesContainer: {
		alignItems: 'center',
	},
	divider: {
		marginHorizontal: 16,
	},
	inputContainer: {
		width: '90%',
		maxWidth: 400,
		marginVertical: 4,
	},
	input: {
		fontSize: 16,
		height: 50,
	},
});

export default withTheme(ProfileScreen);
