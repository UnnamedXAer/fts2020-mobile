import React, { useRef, MutableRefObject, useState, useEffect } from 'react';
import {
	StyleSheet,
	View,
	ScrollView,
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
	Keyboard,
	StatusBar,
	TextInput,
} from 'react-native';
import { withTheme } from 'react-native-paper';
import { Theme } from 'react-native-paper/lib/typescript/src/types';
import Header from '../components/UI/Header';
import CustomButton from '../components/UI/CustomButton';
import { NewFlatScreenNavigationProps } from '../types/navigationTypes';
import Input from '../components/UI/Input';
import useForm, { createInitialState, FormActionTypes } from '../hooks/useForm';
import { StateError } from '../store/ReactTypes/customReactTypes';
import { validateFlatFields } from '../utils/validation';
import NotificationCard from '../components/UI/NotificationCard';
import { createFlat } from '../store/actions/flats';
import { useDispatch, useSelector } from 'react-redux';
import HttpErrorParser from '../utils/parseError';
import { getRandomInt } from '../utils/random';
import { FlatData } from '../models/flat';
import RootState from '../store/storeTypes';

interface Props {
	theme: Theme;
	navigation: NewFlatScreenNavigationProps;
}

const newFlatFormFields = ['name', 'description'] as const;
export type NewFlatFormFields = typeof newFlatFormFields[number];

const initialState = createInitialState<NewFlatFormFields>({ name: '', description: '' });

const NewFlatScreen: React.FC<Props> = ({ theme, navigation }) => {
	const [tmpFlatId] = useState(String.fromCharCode(getRandomInt(97, 123)) + Date.now());
	const flatId = useSelector(
		(state: RootState) => state.flats.createdFlatsTmpIds[tmpFlatId]
	);
	const dispatch = useDispatch();
	const descriptionInpRef: MutableRefObject<TextInput | null> = useRef(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<StateError>(null);
	const [formState, dispatchForm] = useForm<NewFlatFormFields>(initialState);
	const isMounted = useRef(true);
	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	useEffect(() => {
		if (flatId) {
			if (isMounted.current) {
				navigation.popToTop();
				navigation.navigate('InviteMembers', {
					flatId,
					isNewFlat: true,
				});
			}
		}
	}, [flatId, isMounted, navigation]);

	const fieldTextChangeHandler = (fieldName: NewFlatFormFields, txt: string) => {
		dispatchForm({
			fieldId: fieldName,
			value: txt,
			type: FormActionTypes.UpdateValue,
		});
	};

	const inputBlurHandler = (name: NewFlatFormFields) => {
		dispatchForm({
			fieldId: name,
			type: FormActionTypes.MarkAsTouched,
		});
		const fieldError = validateFlatFields(name, formState.values);
		dispatchForm({
			type: FormActionTypes.SetError,
			error: fieldError,
			fieldId: name,
		});
	};

	const submitHandler = async () => {
		setError(null);
		let isFormValid = true;
		newFlatFormFields.forEach((fieldName) => {
			const fieldError = validateFlatFields(fieldName, formState.values);
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
		setLoading(true);

		const newFlat = new FlatData({
			description: formState.values.description,
			name: formState.values.name,
		});

		try {
			await dispatch(createFlat(newFlat, tmpFlatId));
		} catch (err) {
			if (isMounted.current) {
				const errorData = new HttpErrorParser(err);
				const fieldsErrors = errorData.getFieldsErrors();
				fieldsErrors.forEach((x) =>
					dispatchForm({
						type: FormActionTypes.SetError,
						fieldId: x.param,
						error: x.msg,
					})
				);

				setError(errorData.getMessage());
				setLoading(false);
			}
		}
	};

	return (
		<KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior="height">
			<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
				<ScrollView
					contentContainerStyle={[
						styles.screen,
						{ backgroundColor: theme.colors.surface },
					]}
				>
					<Header style={styles.header}>Add Flat</Header>
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
							name="Desciption"
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
						<CustomButton accent onPress={() => navigation.popToTop()}>
							CANCEL
						</CustomButton>
						<CustomButton onPress={submitHandler}>NEXT</CustomButton>
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
export default withTheme(NewFlatScreen);
