const nameRegex: RegExp = /^[A-ZА-Я][a-zа-я-]*$/;
const emailRegex: RegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z]+\.[a-zA-Z]+$/;
const phoneRegex: RegExp = /^\+?\d{10,15}$/;

export const validateField = (fieldName: string, value: string): string | null => {
    if (value.trim() === '') {
        return 'This field cannot be empty';
    }

    switch (fieldName) {
        case 'first_name':
        case 'second_name':
            if (!nameRegex.test(value)) {
                if (!/^[A-ZА-Я]/.test(value)) {
                    return 'The name must begin with a capital letter';
                }
                if (!/^[A-ZА-Яa-zа-я-]*$/.test(value)) {
                    return 'A name can only contain letters and a hyphen';
                }
            }
            return null;
        case 'login':
            if (value.length < 3 || value.length > 20) {
                return 'Login should be between 3 and 20 characters';
            }
            if (!/^[a-zA-Z]/.test(value)) {
                return 'The login must begin with a letter';
            }
            if (!/^[a-zA-Z0-9-_]*$/.test(value)) {
                return 'Login can only contain Latin letters, digits, hyphen and underscore';
            }
            if (/^\d+$/.test(value)) {
                return 'Login cannot consist only of numbers';
            }
            return null;
        case 'email':
            if (!emailRegex.test(value)) {
                return 'Incorrect email address';
            }
            return null;
        case 'password':
        case 'newPassword':
        case 'oldPassword':
            if (value.length < 8 || value.length > 40) {
                return 'The password must be between 8 and 40 characters';
            }
            if (!/[A-Z]/.test(value)) {
                return 'The password must contain at least one capital letter';
            }
            if (!/\d/.test(value)) {
                return 'The password must contain at least one digit';
            }
            return null;
        case 'phone':
            if (!phoneRegex.test(value)) {
                return 'The phone number must contain 10 to 15 digits and may begin with a plus sign';
            }
            return null;
        default:
            console.warn(`Unknown field for validation: ${fieldName}`);
            return null;
    }
};