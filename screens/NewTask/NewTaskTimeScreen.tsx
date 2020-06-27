import React, { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	StyleSheet,
	View,
	ScrollView,
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
	Keyboard,
	TouchableOpacity,
	Task,
} from 'react-native';
import { withTheme, HelperText, TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Theme } from 'react-native-paper/lib/typescript/src/types';
import moment from 'moment';
import {
	NewTaskTimeScreenNavigationProps,
	NewTaskTimeScreenRouteProps,
} from '../../types/navigationTypes';
import { StateError } from '../../store/ReactTypes/customReactTypes';
import { TaskData, TaskPeriodUnit } from '../../models/task';
import HttpErrorParser from '../../utils/parseError';
import Header from '../../components/UI/Header';
import NotificationCard from '../../components/UI/NotificationCard';
import CustomButton from '../../components/UI/CustomButton';
import Stepper from '../../components/UI/Stepper';
import Picker from '../../components/UI/Picker';
import { getRandomInt } from '../../utils/random';
import { createTask } from '../../store/actions/tasks';
import RootState from '../../store/storeTypes';

interface Props {
	theme: Theme;
	navigation: NewTaskTimeScreenNavigationProps;
	route: NewTaskTimeScreenRouteProps;
}

const defaultStartDay = moment().startOf('day').toDate();
const defaultEndDay = moment(defaultStartDay).add(6, 'months').toDate();

const NewTaskTimeScreen: React.FC<Props> = ({ theme, navigation, route }) => {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<StateError>(null);
	const [periodUnit, setPeriodUnit] = useState(TaskPeriodUnit.WEEK);
	const [periodValue, setPeriodValue] = useState('1');
	const [periodValueError, setPeriodValueError] = useState<StateError>(null);
	const [periodValueTouched, setPeriodValueTouched] = useState(false);
	const [datePickerField, setDatePickerField] = useState<
		'startDate' | 'endDate' | null
	>(null);
	const [startDate, setStartDate] = useState(defaultStartDay);
	const [endDate, setEndDate] = useState(defaultEndDay);
	const [datesError, setDatesError] = useState<StateError>(null);
	const [tmpId] = useState(String.fromCharCode(getRandomInt(97, 123)) + Date.now());
	const newCreatedTaskId = useSelector(
		(state: RootState) => state.tasks.createdTasksTmpIds[tmpId]
	);

	const isMounted = useRef(true);
	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	useEffect(() => {
		if (newCreatedTaskId) {
			navigation.pop();
			navigation.replace('NewTaskMembers', { id: newCreatedTaskId, newTask: true });
		}
	}, [newCreatedTaskId, navigation]);

	const periodValueTextChangeHandler = (text: string) => {
		const sanitizedVal = text.replace(/[^0-9]/g, '');
		if (periodValueTouched)
			if (sanitizedVal !== '0' && +sanitizedVal < 1) {
				setPeriodValueError('Value must be greater than 0.');
			} else setPeriodValueError(null);
		setPeriodValue(sanitizedVal);
	};

	const periodValueBlurHandler = () => {
		setPeriodValueTouched(true);
		if (+periodValue < 1) {
			setPeriodValueError('Value must be greater than 0.');
		} else setPeriodValueError(null);
	};

	const dateChangeHandler = (
		date: Date | undefined,
		fieldName: 'startDate' | 'endDate'
	) => {
		setDatePickerField(null);
		let datesOk = true;
		if (date) {
			if (fieldName === 'startDate') {
				setStartDate(date);
				datesOk = date < endDate;
			} else if (fieldName === 'endDate') {
				setEndDate(date);
				datesOk = date > startDate;
			} else {
				datesOk = startDate < endDate;
			}
			setDatesError(
				datesOk ? null : '"End Date" must be greater than "Start Date"'
			);
		}
	};

	const submitHandler = async () => {
		setError(null);
		let isFormValid = true;

		if (!isFormValid) {
			setError('Please correct the form.');
			return;
		}
		setLoading(true);

		const taskData = {
			flatId: route.params.flatId,
			description: route.params.description,
			name: route.params.name,
			timePeriodUnit: periodUnit,
			timePeriodValue: +periodValue,
			startDate,
			endDate,
		} as TaskData;

		try {
			await dispatch(createTask(taskData, tmpId));
		} catch (err) {
			if (isMounted.current) {
				const errorData = new HttpErrorParser(err);
				const fieldsErrors = errorData.getFieldsErrors();
				let msg = errorData.getMessage();

				fieldsErrors.forEach((x) => {
					const field =
						x.param === 'timePeriodValue'
							? 'Period duraion value'
							: x.param === 'timePeriodUnit'
							? 'Period duraion unit'
							: x.param === 'name'
							? 'Name'
							: 'Description';

					msg += `\n${field}: ${x.msg}`;
				});

				setError(msg);
			}
		}
		isMounted.current && setLoading(false);
	};
	return (
		<KeyboardAvoidingView
			style={styles.keyboardAvoidingView}
			behavior="height"
			keyboardVerticalOffset={100}
		>
			<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
				<ScrollView
					contentContainerStyle={[
						styles.screen,
						{ backgroundColor: theme.colors.surface },
					]}
				>
					<Stepper steps={3} currentStep={2} />
					<Header style={styles.header}>Add Task - Time</Header>
					<View style={styles.inputContainer}>
						<Picker
							options={[
								{ label: 'Day', value: TaskPeriodUnit.DAY },
								{ label: 'Week', value: TaskPeriodUnit.WEEK },
								{ label: 'Month', value: TaskPeriodUnit.MONTH },
							]}
							selectedValue={periodUnit}
							onChange={setPeriodUnit}
							disabled={loading}
							label="Period duration unit"
						/>
					</View>
					<View style={styles.inputContainer}>
						<TextInput
							label="Period duration value"
							mode="outlined"
							value={periodValue}
							keyboardType="numeric"
							onChangeText={periodValueTextChangeHandler}
							error={Boolean(periodValueError)}
							onBlur={periodValueBlurHandler}
						/>
						<HelperText type="error" visible={Boolean(periodValueError)}>
							{periodValueError}
						</HelperText>
					</View>
					<View style={styles.inputContainer}>
						<TouchableOpacity
							onPress={() => {
								setDatePickerField('startDate');
							}}
						>
							<TextInput
								label="Start date"
								mode="outlined"
								value={moment(startDate).format('LL')}
								error={Boolean(datesError)}
								editable={false}
							/>
						</TouchableOpacity>
					</View>
					<View style={styles.inputContainer}>
						<TouchableOpacity
							onPress={() => {
								setDatePickerField('endDate');
							}}
						>
							<TextInput
								label="End date"
								mode="outlined"
								value={moment(endDate).format('LL')}
								error={Boolean(datesError)}
								editable={false}
							/>
						</TouchableOpacity>
						<HelperText type="error" visible={Boolean(datesError)}>
							{datesError}
						</HelperText>
					</View>
					<View style={styles.inputContainer}>
						{error && (
							<NotificationCard serverity="error">{error}</NotificationCard>
						)}
					</View>
					<View style={styles.actions}>
						<CustomButton
							accent
							onPress={() => navigation.popToTop()}
							disabled={loading}
						>
							CANCEL
						</CustomButton>
						<CustomButton onPress={submitHandler} loading={loading}>
							CREATE
						</CustomButton>
					</View>
					{datePickerField !== null && (
						<DateTimePicker
							display="default"
							is24Hour
							value={datePickerField === 'startDate' ? startDate : endDate}
							minimumDate={defaultStartDay}
							mode="date"
							onChange={(ev, date) =>
								dateChangeHandler(date, datePickerField)
							}
						/>
					)}
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
	header: {
		paddingTop: 16,
		fontSize: 44,
	},
	infoParagraph: {
		fontSize: 20,
		marginVertical: 8,
	},
	inputContainer: {
		width: '90%',
		maxWidth: 400,
		marginVertical: 4,
	},
	input: {
		fontSize: 16,
	},
	actions: {
		flexDirection: 'row',
		alignItems: 'flex-end',
	},
});
export default withTheme(NewTaskTimeScreen);
