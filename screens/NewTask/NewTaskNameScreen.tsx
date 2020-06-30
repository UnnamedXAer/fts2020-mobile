import React, { useRef, MutableRefObject, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
	StyleSheet,
	View,
	ScrollView,
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
	Keyboard,
	TextInput,
} from 'react-native';
import { withTheme } from 'react-native-paper';
import { Theme } from 'react-native-paper/lib/typescript/src/types';
import Header from '../../components/UI/Header';
import useForm, { createInitialState, FormActionTypes } from '../../hooks/useForm';
import { StateError } from '../../store/ReactTypes/customReactTypes';
import { validateTaskFields } from '../../utils/validation';
import Input from '../../components/UI/Input';
import NotificationCard from '../../components/UI/NotificationCard';
import CustomButton from '../../components/UI/CustomButton';
import Stepper from '../../components/UI/Stepper';
import {
	NewTaskNameScreenNavigationProps,
	NewTaskNameScreenRouteProps,
} from '../../types/navigationTypes';

interface Props {
	theme: Theme;
	navigation: NewTaskNameScreenNavigationProps;
	route: NewTaskNameScreenRouteProps;
}

const newTaskFormFields = ['name', 'description'] as const;
export type NewTaskFormFields = typeof newTaskFormFields[number];

const initialState: any = createInitialState<NewTaskFormFields>({
	name: '',
	description: '',
});

const NewTaskNameScreen: React.FC<Props> = ({ theme, route, navigation }) => {
	const dispatch = useDispatch();
	const descriptionInpRef: MutableRefObject<TextInput | null> = useRef(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<StateError>(null);
	const [formState, dispatchForm] = useForm<NewTaskFormFields>(initialState);
	const isMounted = useRef(true);
	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	const fieldTextChangeHandler = (fieldName: NewTaskFormFields, txt: string) => {
		dispatchForm({
			fieldId: fieldName,
			value: txt,
			type: FormActionTypes.UpdateValue,
		});
	};

	const inputBlurHandler = (name: NewTaskFormFields) => {
		dispatchForm({
			fieldId: name,
			type: FormActionTypes.MarkAsTouched,
		});
		const fieldError = validateTaskFields(name, formState.values);
		dispatchForm({
			type: FormActionTypes.SetError,
			error: fieldError,
			fieldId: name,
		});
	};

	const submitHandler = async () => {
		setError(null);
		let isFormValid = true;
		newTaskFormFields.forEach((fieldName) => {
			const fieldError = validateTaskFields(fieldName, formState.values);
			isFormValid = isFormValid && fieldError === null;

			dispatchForm({
				type: FormActionTypes.SetError,
				error: fieldError,
				fieldId: fieldName,
			});
		});

		dispatchForm({
			type: FormActionTypes.SetAllTouched,
		});

		if (!isFormValid) {
			setError('Please correct the form.');
			return;
		}
		navigation.push('NewTaskTime', {
			flatId: route.params.flatId,
			...formState.values,
		});
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
					<Stepper steps={3} currentStep={1} />
					<Header style={styles.header}>Add Task</Header>
					<View style={styles.inputContainer}>
						<Input
							style={styles.input}
							name="name"
							label="Name"
							keyboardType="default"
							returnKeyType="next"
							returnKeyLabel="next"
							onSubmitEditing={() => descriptionInpRef!.current!.focus()}
							disabled={loading}
							formState={formState}
							textChanged={fieldTextChangeHandler}
							blur={inputBlurHandler}
						/>
					</View>
					<View style={styles.inputContainer}>
						<Input
							style={[styles.input, { maxHeight: 87.3 }]}
							name="description"
							label="Description"
							keyboardType="default"
							returnKeyType="done"
							returnKeyLabel="submit"
							multiline
							numberOfLines={3}
							ref={descriptionInpRef}
							onSubmitEditing={submitHandler}
							disabled={loading}
							formState={formState}
							textChanged={fieldTextChangeHandler}
							blur={inputBlurHandler}
						/>
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
export default withTheme(NewTaskNameScreen);
