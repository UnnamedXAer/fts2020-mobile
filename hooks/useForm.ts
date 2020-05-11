import { useReducer, Dispatch, Reducer } from 'react';
import { StateError } from '../store/ReactTypes/customReactTypes';

export enum FormActionTypes {
	UpdateValue = 'UPDATE',
	SetError = 'SET_ERROR',
	MarkAsTouched = 'MARK_AS_TOUCHED',
	SetFormError = 'SET_FORM_ERROR'
}

export type FormAction<T = any> = SetValueAction<T> | SetErrorAction<T>;

interface SetValueAction<T = any> {
	type: FormActionTypes.UpdateValue;
	fieldId: string;
	value: T;
}

interface SetErrorAction<T = StateError> {
	type: FormActionTypes.SetError;
	fieldId: string;
	error: T;
}

interface SetFormErrorAction<T = StateError> {
	type: FormActionTypes.SetFormError;
	error: T;
}

interface MarkAsTouchedAction {
	type: FormActionTypes.MarkAsTouched;
	fieldId: string;
}

interface DefaultFormStateValues {
	[fieldId: string]: any;
}

export interface FormState<T = DefaultFormStateValues> {
	formError: StateError;
	values: T;
	errors: {
		[fieldId: string]: StateError;
	};
	touches: {
		[fieldId: string]: boolean;
	}
}

const formReducer = <T = DefaultFormStateValues>(
	state: FormState<T>,
	action: SetValueAction | SetErrorAction | MarkAsTouchedAction | SetFormErrorAction
): FormState<T> => {
	switch (action.type) {
		case FormActionTypes.UpdateValue:
			const updatedValues = {
				...state.values,
				[action.fieldId]: action.value!
			};

			return {
				...state,
				values: updatedValues
			};

		case FormActionTypes.SetError:
			const updatedErrors = {
				...state.errors,
				[action.fieldId]: action.error,
			};

			return {
				...state,
				errors: updatedErrors,
			};
		case FormActionTypes.MarkAsTouched:
			const updatedTouches = {
				...state.touches,
				[action.fieldId]: true
			}
			return {
				...state,
				touches: updatedTouches
			}
		case FormActionTypes.SetFormError:
			return {
				...state,
				formError: action.error
			}
		default:
			return state;
	}
};

const useForm = <U = any>(fields: string[]
): [FormState, Dispatch<FormAction<U>>] => {

	if (!Array.isArray(fields) || fields.length === 0) {
		throw new Error('Parameter "fields" suppose to be not empty array of fields names.');
	}

	const initialState: FormState = { errors: {}, formError: null, touches: {}, values: {} }

	fields.forEach(fieldName => {
		initialState.errors[fieldName] = null;
		initialState.touches[fieldName] = false;
		initialState.values[fieldName] = ''
	});

	const [state, dispatch] = useReducer<Reducer<FormState, FormAction>>(
		formReducer,
		initialState
	);

	return [state, dispatch];
};

export default useForm;
