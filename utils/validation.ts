import { StateError } from "../store/ReactTypes/customReactTypes";
import { NewFlatFormFields } from "../screens/Flat/NewFlat/NewFlatScreen";

export const checkEmailAddress = (emial: string) => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    .test(emial);

export const checkUserName = (userName: string) => {
    if (userName.trim().length < 2 || userName.trim().length > 50) {
        return false
    }
    return true;
}

export default function validateAuthFormField(
    fieldId: string,
    formValues: { [key: string]: string },
): StateError {
    const isSignIn = !formValues.hasOwnProperty('confirmPassword');
    let error = null;
    switch (fieldId) {
        case 'userName':
            const notAllowedUserNameValues = [
                'admin',
                'administrator',
                'moderator',
                'null',
                'undefined',
                'mod',
            ];
            if (!isSignIn && formValues[fieldId].length < 2) {
                error = 'The Name must be minimum 2 characters long.';
            }
            else if (!isSignIn && formValues[fieldId].length > 50) {
                error = 'The Name must be max 50 characters long.';
            }
            else if (
                !isSignIn &&
                notAllowedUserNameValues.includes(fieldId)
            ) {
                error = 'This value is not allowed as Name.';
            }
            break;
        case 'emailAddress':
            // eslint-disable-next-line no-useless-escape
            if (!formValues[fieldId]) {
                error = 'Please enter Email Address.';
            } else if (!checkEmailAddress(formValues[fieldId])) {
                error = 'Email Address is invalid.';
            }
            break;
        case 'password':
            if (!formValues[fieldId]) {
                error = 'Please enter Password.';
            } else if (
                !isSignIn &&
                !new RegExp(/^(?=\S*[a-z])(?=\S*\d)\S{6,}$/).test(
                    formValues[fieldId]
                )
            ) {
                error =
                    'The Password must be minimum 6 chars long, contains at least one letter and number.';
            }
            break;
        case 'confirmPassword':
            if (!isSignIn && !formValues[fieldId]) {
                error = 'Please enter Password Confirmation.';
            } else if (
                !isSignIn &&
                formValues[fieldId] !== formValues['password']
            ) {
                error = 'Passwords do not match.';
            }
            break;
        case 'avatarUrl':
            //   if (
            // 		!formValues[fieldId] ||
            // 		formValues[fieldId].length >= 2083 ||
            // 		/[\s<>]/.test(formValues[fieldId]) ||
            // 		formValues[fieldId].indexOf('mailto:') === 0
            // 	) {
            // 		error = 'Please enter correct avatar url.';
            // 	}
            // if (!isSignIn && formValues[fieldId] !== '') {
            //     try {
            //         await testImage(formValues[fieldId]);
            //     }
            //     catch (err) {
            //         error = 'That is not correct image url.'
            //     }
            // }
            break;
        default:
            break;
    }

    return error;
}

export function validateFlatFields(
    fieldId: NewFlatFormFields,
    formValues: { [key in NewFlatFormFields]: string },
): StateError {
    let error = null;
    switch (fieldId) {
        case 'name':
            const notAllowedUserNameValues = [
                'admin',
                'administrator',
                'moderator',
                'null',
                'undefined',
                'mod'
            ];
            if (formValues[fieldId].length < 2) {
                error = 'The Name must be minimum 2 characters long.';
            }
            else if (formValues[fieldId].length > 50) {
                error = 'The Name must be max 50 characters long.';
            }
            else if (
                notAllowedUserNameValues.includes(fieldId)
            ) {
                error = 'This value is not allowed as Name.';
            }
            break;
        case 'description':
            if (formValues[fieldId].length > 500) {
                error = 'The Description can be max 500 characters long.';
            }
            break;
        default:
            break;
    }
    return error;
}

export function validateTaskFields(
    fieldId: NewFlatFormFields,
    formValues: { [key in NewFlatFormFields]: string },
): StateError {
    let error = null;
    switch (fieldId) {
        case 'name':
            const notAllowedUserNameValues = [
                'admin',
                'administrator',
                'moderator',
                'null',
                'undefined',
                'mod'
            ];
            if (formValues[fieldId].length < 2) {
                error = 'The Name must be minimum 2 characters long.';
            }
            else if (formValues[fieldId].length > 50) {
                error = 'The Name must be max 50 characters long.';
            }
            else if (
                notAllowedUserNameValues.includes(fieldId)
            ) {
                error = 'This value is not allowed as Name.';
            }
            break;
        case 'description':
            if (formValues[fieldId].length > 500) {
                error = 'The Description can be max 500 characters long.';
            }
            break;
        default:
            break;
    }
    return error;
}

function testImage(URL: string) {
    return new Promise((resolve, reject) => {
        reject();
        // var tester = new Image();
        // tester.onload = resolve;
        // tester.onerror = reject;
        // tester.src = URL;
    });
}
