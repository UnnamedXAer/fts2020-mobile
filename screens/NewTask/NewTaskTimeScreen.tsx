import React, { useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
	StyleSheet,
	View,
	ScrollView,
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
	Keyboard,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { withTheme, HelperText, TextInput } from 'react-native-paper';
import { Theme } from 'react-native-paper/lib/typescript/src/types';
import { NewTaskTimeScreenNavigationProps } from '../../types/navigationTypes';
import { StateError } from '../../store/ReactTypes/customReactTypes';
import { validateFlatFields } from '../../utils/validation';
import { TaskData, TaskPeriodUnit } from '../../models/task';
import HttpErrorParser from '../../utils/parseError';
import Header from '../../components/UI/Header';
import NotificationCard from '../../components/UI/NotificationCard';
import CustomButton from '../../components/UI/CustomButton';
import Stepper from '../../components/UI/Stepper';
import Picker from '../../components/UI/Picker';
import moment from 'moment';

interface Props {
	theme: Theme;
	navigation: NewTaskTimeScreenNavigationProps;
}

const defaultStartDay = moment().startOf('day').toDate();
const defaultEndDay = moment(defaultStartDay).add('months', 6).toDate();

const NewTaskTimeScreen: React.FC<Props> = ({ theme, navigation }) => {
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<StateError>(null);
	const [periodUnit, setPeriodUnit] = useState(TaskPeriodUnit.WEEK);
	const [periodValue, setPeriodValue] = useState('1');
	const [periodValueError, setPeriodValueError] = useState<StateError>(null);
	const [periodValueTouched, setPeriodValueTouched] = useState(false);
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [startDate, setStartDate] = useState(defaultStartDay);
	const [endDate, setEndDate] = useState(defaultEndDay);
	const [datesError, setDatesError] = useState<StateError>(null);

	const isMounted = useRef(true);
	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

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

	const dateChangeHandler = (date: Date, fieldName: 'startDate' | 'endDate') => {
		let datesOk = true;
		if (fieldName === 'startDate') {
			setStartDate(date);
			datesOk = date < endDate;
		} else {
			setEndDate(date);
			datesOk = date > startDate;
		}
		if (datesOk) {
			setDatesError('"End Date" must be greater than "Start Date"');
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

		// const newTask = new TaskData({
		// 	description: formState.values.description,
		// 	name: formState.values.name,
		// });

		// try {
		// 	await dispatch(createTask(newTask, tmpTaskId));
		// 	if (isMounted.current) {
		// 		navigation.pop();
		// 	}
		// } catch (err) {
		// 	if (isMounted.current) {
		// 		const errorData = new HttpErrorParser(err);
		// 		const fieldsErrors = errorData.getFieldsErrors();
		// 		fieldsErrors.forEach((x) =>
		// 			dispatchForm({
		// 				type: FormActionTypes.SetError,
		// 				fieldId: x.param,
		// 				error: x.msg,
		// 			})
		// 		);

		// 		setError(errorData.getMessage());
		// 		setLoading(false);
		// 	}
		// }
	};

	return (
		<KeyboardAvoidingView
			style={styles.keyboardAvoidingView}
			behavior="height"
			keyboardVerticalOffset={100}
		>
			{/* <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}> */}
			<ScrollView
				contentContainerStyle={[
					styles.screen,
					{ backgroundColor: theme.colors.surface },
				]}
			>
				<Header style={styles.header}>Add Task - Time</Header>
				<Stepper steps={3} currentStep={2} />
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
					<TextInput
						label="Start date"
						mode="outlined"
						value={moment(startDate).format('LL')}
						error={Boolean(datesError)}
					/>
					<TextInput
						label="End date"
						mode="outlined"
						value={moment(endDate).format('LL')}
						error={Boolean(datesError)}
					/>
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
					<CustomButton onPress={submitHandler} disabled={loading}>
						NEXT
					</CustomButton>
				</View>
				{showDatePicker && (
					<DateTimePicker
						value={new Date()}
						minimumDate={new Date()}
						mode="date"
					/>
				)}
			</ScrollView>
			{/* </TouchableWithoutFeedback> */}
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
