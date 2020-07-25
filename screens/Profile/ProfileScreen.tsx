import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, View, Dimensions, Platform } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {
	Title,
	Paragraph,
	Headline,
	Avatar,
	withTheme,
	Divider,
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
import { fetchUser } from '../../store/actions/users';

type EditableFields = 'emailAddress' | 'userName' | 'avatarUrl';

interface Props {
	route: ProfileScreenRouteProps;
	navigation: ProfileScreenNavigationProps;
	theme: Theme;
}

const { width, height } = Dimensions.get('window');
const avatarWidth = width / (width < height ? 2.6 : 4);

const ProfileScreen: React.FC<Props> = ({ route, navigation, theme }) => {
	const dispatch = useDispatch();
	const id = route.params.id;
	const isLoggedUser = useSelector((state: RootState) => state.auth.user!.id === id);
	const user = useSelector((state: RootState) =>
		state.users.users.find((x) => x.id === id)
	);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<StateError>(null);
	const [editValue, setEditValue] = useState('');
	const [editLoading, setEditLoading] = useState(false);
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

	return (
		<>
			<ScrollView style={styles.screen}>
				{error && <NotificationCard severity="error">{error}</NotificationCard>}

				<View style={styles.container}>
					<View
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
					</View>
				</View>
				<View>
					{user ? (
						<View style={styles.userNamesContainer}>
							<Headline>{user!.emailAddress}</Headline>
							<Title>{user.userName}</Title>
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
});

export default withTheme(ProfileScreen);
