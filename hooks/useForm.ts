import { useReducer, Dispatch, Reducer } from 'react';
import { StateError } from '../store/ReactTypes/customReactTypes';
import validateAuthFormField from '../utils/validation';

export enum FormActionTypes {
	UpdateValue = 'UPDATE',
	SetError = 'SET_ERROR',
	MarkAsTouched = 'MARK_AS_TOUCHED',
	SetFormError = 'SET_FORM_ERROR'
}

export type FormAction = SetValueAction | SetErrorAction | MarkAsTouchedAction | SetErrorAction;

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

export interface FormState<T extends string = string> {
	formError: StateError;
	values: { [U in T]: any };
	errors: {
		[U in T]: StateError;
	};
	touches: {
		[U in T]: boolean;
	}
}

const formReducer = (
	state: FormState,
	action: SetValueAction | SetErrorAction | MarkAsTouchedAction | SetFormErrorAction
): FormState => {
	switch (action.type) {
		case FormActionTypes.UpdateValue:
			const updatedValues = {
				...state.values,
				[action.fieldId]: action.value!
			};

			const updatedErrorsOnValueChange = {
				...state.errors,
				[action.fieldId]: validateAuthFormField(action.fieldId, updatedValues),
			};

			return {
				...state,
				values: updatedValues,
				errors: updatedErrorsOnValueChange
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

const useForm = <T extends string>(initialState: FormState<T>): [FormState<T>, Dispatch<FormAction>] => {
	const [state, dispatch] = useReducer<Reducer<FormState<T>, FormAction>>(
		formReducer,
		initialState
	);

	return [state, dispatch];
};

export function createInitialState<T extends string>(
	initialValues: { [U in T]: any }
): FormState<T> {
	const errors = {} as { [U in T]: StateError };
	const touches = {} as { [U in T]: boolean };

	const fields = Object.keys(initialValues) as T[];

	fields.forEach((f) => {
		errors[f] = null;
		touches[f] = false;
	});

	return {
		errors,
		values: initialValues,
		touches,
		formError: null,
	};
}

export default useForm;
