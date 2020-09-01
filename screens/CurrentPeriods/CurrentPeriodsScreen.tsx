import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
	View,
	StyleSheet,
	FlatList,
	ListRenderItem,
	RefreshControl,
	TouchableHighlight,
} from 'react-native';
import {
	Avatar,
	withTheme,
	Theme,
	Paragraph,
	Headline,
	Divider,
	Checkbox,
	Text,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { Placeholder } from 'rn-placeholder';
import RootState from '../../store/storeTypes';
import HttpErrorParser from '../../utils/parseError';
import NotificationCard from '../../components/UI/NotificationCard';
import { StateError } from '../../store/ReactTypes/customReactTypes';
import { PlaceholderLine, Shine } from '../../components/UI/Placeholder/Placeholder';
import { CurrentPeriodsScreenNavigationProp } from '../../types/currentPeriodsNavigationTypes';
import { CurrentPeriod, Period } from '../../models/period';
import { fetchCurrentPeriods, completePeriod } from '../../store/actions/periods';
import moment from 'moment';
import AlertDialog, {
	AlertDialogData,
} from '../../components/UI/AlertDialog/AlertDialog';
import AlertSnackbar, {
	AlertSnackbarData,
} from '../../components/UI/AlertSnackbar/AlertSnackbar';
import PeriodCompleteText from '../../components/Task/PeriodCompleteText';

interface Props {
	theme: Theme;
	navigation: CurrentPeriodsScreenNavigationProp;
}

const CurrentPeriodsScreen: React.FC<Props> = ({ theme, navigation }) => {
	const dispatch = useDispatch();
	const currentPeriods = useSelector(
		(state: RootState) => state.periods.currentPeriods
	);
	const loggedUser = useSelector((state: RootState) => state.auth.user!);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<StateError>(null);
	const [refreshing, setRefreshing] = useState(false);

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
		if (!loading && error === null && currentPeriods === null) {
			const loadCurrentPeriods = async () => {
				setLoading(true);
				try {
					await dispatch(fetchCurrentPeriods());
					throw new Error('Networking not working :(');
				} catch (err) {
					if (isMounted.current) {
						const httpError = new HttpErrorParser(err);
						const msg = httpError.getMessage();
						setError(msg);
					}
				}
				if (isMounted.current) {
					setLoading(false);
				}
			};
			loadCurrentPeriods();
		}
	}, [dispatch, loading, error, currentPeriods]);

	const refreshHandler = async () => {
		setRefreshing(true);
		try {
			await dispatch(fetchCurrentPeriods());
			if (isMounted.current) {
				setError(null);
			}
		} catch (err) {
			if (isMounted.current) {
				const httpError = new HttpErrorParser(err);
				const msg = httpError.getMessage();
				setSnackbarData({
					open: true,
					action: {
						label: 'OK',
						onPress: closeSnackbarAlertHandler,
					},
					severity: 'error',
					timeout: 4000,
					content:
						'Could not refresh the periods due to following reason:\n' + msg,
					onClose: closeSnackbarAlertHandler,
				});
			}
		}
		isMounted.current && setRefreshing(false);
	};

	const closeDialogAlertHandler = () =>
		setDialogData((prevState) => ({
			...prevState,
			open: prevState.loading,
		}));

	const closeSnackbarAlertHandler = () =>
		setSnackbarData((prevState) => ({
			...prevState,
			open: false,
		}));

	const completePeriodHandler = useCallback(
		async (id: number) => {
			const taskId = currentPeriods!.find((x) => x.id === id)!.taskId;
			setDialogData((prevState) => ({ ...prevState, loading: true }));
			try {
				await dispatch(completePeriod(id, taskId));
				isMounted.current &&
					setSnackbarData({
						open: true,
						action: {
							label: 'OK',
							onPress: closeSnackbarAlertHandler,
						},
						severity: 'success',
						timeout: 3000,
						content: 'Period completed.',
						onClose: closeSnackbarAlertHandler,
					});
			} catch (err) {
				if (isMounted.current) {
					const error = new HttpErrorParser(err);
					const msg = error.getMessage();
					setSnackbarData({
						open: true,
						action: {
							label: 'OK',
							onPress: closeSnackbarAlertHandler,
						},
						severity: 'error',
						timeout: 4000,
						content:
							'Could not complete the period due to following reason:\n' +
							msg,
						onClose: closeSnackbarAlertHandler,
					});
				}
			} finally {
				if (isMounted.current) {
					setDialogData((prevState) => ({
						...prevState,
						open: false,
					}));
				}
			}
		},
		[dispatch, currentPeriods]
	);

	const periodSelectHandler = useCallback(
		(id: number) => {
			const period = currentPeriods!.find((x) => x.id === id)!;

			setDialogData({
				open: true,
				content: (
					<PeriodCompleteText
						loggedUserEmailAddress={loggedUser.emailAddress}
						period={
							new Period({
								id: period.id,
								startDate: period.startDate,
								endDate: period.endDate,
								assignedTo: {
									emailAddress: loggedUser.emailAddress,
									userName: loggedUser.userName,
								},
								completedAt: null,
								completedBy: null,
							})
						}
					/>
				),
				title: 'Complete Period?',
				onDismiss: closeDialogAlertHandler,
				loading: false,
				actions: [
					{
						label: 'Complete',
						onPress: () => completePeriodHandler(id),
						color: 'primary',
					},
					{
						color: 'accent',
						label: 'Cancel',
						onPress: closeDialogAlertHandler,
					},
				],
			});
		},
		[completePeriodHandler, loggedUser.emailAddress, currentPeriods]
	);

	const renderItem: ListRenderItem<CurrentPeriod> = ({ item }) => {
		return (
			<TouchableHighlight
				underlayColor={theme.colors.primary}
				onPress={() => periodSelectHandler(item.id!)}
			>
				<View style={styles.itemContainer}>
					<View style={{ marginRight: 4 }}>
						<Avatar.Icon
							color={theme.colors.accent}
							style={{ backgroundColor: theme.colors.background }}
							icon="calendar-clock"
						/>
					</View>
					<View style={{ flex: 1 }}>
						<Headline>{item.taskName}</Headline>
						<View style={{ flexDirection: 'column' }}>
							<Paragraph style={{ color: theme.colors.placeholder }}>
								Start:{' '}
								{moment(item.startDate).format('dddd, Do MMM YYYY')}
							</Paragraph>
							<Paragraph style={{ color: theme.colors.placeholder }}>
								End: {moment(item.endDate).format('dddd, Do MMM YYYY')}
							</Paragraph>
						</View>
					</View>
				</View>
			</TouchableHighlight>
		);
	};

	return (
		<View style={styles.container}>
			{error && (
				<NotificationCard
					severity="error"
					onPress={() => {
						setError(null);
					}}
				>
					Sorry, could not load current periods. Please try again later.
				</NotificationCard>
			)}
			<FlatList
				ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
				refreshControl={
					<RefreshControl
						refreshing={refreshing}
						onRefresh={refreshHandler}
						title={'Loading Current Periods...'}
						colors={[theme.colors.accent, theme.colors.primary]}
					/>
				}
				keyExtractor={(item) => item.id!.toString()}
				data={currentPeriods}
				renderItem={renderItem}
				ListEmptyComponent={
					!error ? (
						<View style={{ marginTop: '5%', marginHorizontal: 8 }}>
							{loading ? (
								<Placeholder Animation={Shine}>
									<PlaceholderLine
										height={64}
										noMargin
										style={{
											borderRadius: theme.roundness,
										}}
									/>
									<Divider style={{ marginVertical: 16 }} />
									<PlaceholderLine height={64} noMargin />
									<Divider style={{ marginVertical: 16 }} />
									<PlaceholderLine height={64} />
								</Placeholder>
							) : (
								<NotificationCard
									childrens={['Currently You have nothing to do 😎.']}
								/>
							)}
						</View>
					) : null
				}
			/>
			<AlertDialog data={dialogData} />
			<AlertSnackbar data={snackbarData} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'relative',
		flex: 1,
	},
	showInactiveContainer: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	itemContainer: {
		paddingVertical: 8,
		paddingEnd: 8,
		paddingStart: 4,
		flexDirection: 'row',
	},
	itemSeparator: {
		marginHorizontal: 8,
		borderColor: 'lightblue',
		borderBottomWidth: 1,
	},
});

export default withTheme(CurrentPeriodsScreen);
