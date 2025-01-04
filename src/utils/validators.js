import * as Yup from 'yup'
export const specialCharacterValidator = (val = '') => {
    if (val) {
        //FIXME: change to ASCII Range
        if (!/^[|@₹#$%^&+*!=() ?0-9]*$/.test(val)) {
            return true;
        } else return false;
    } else return true;
};

export const notMoreThan10AnyNonAlphabeticalCharacter = (value = '') => {
    var matches = value.match(/[-!$%^&*()_+|~=`{}[:;<>?,.@#\]]/g) || '';
    return matches.length < 10;
};

export const checkForAlphabets = (value) => {
    if (typeof value === "string" && value !== '') {
        var matches = value.match(/[a-zA-Z]/g) || '';
        return matches.length > 0;
    } else {
        return true;
    }
};

export const longNameValidator = Yup.string()
    .required('This field is required')
    .test(
        'special character test',
        'This field cannot contain only special characters or numbers',
        specialCharacterValidator,
    )
    .test(
        'alphabets character test',
        'This field should contain at least one alphabet',
        checkForAlphabets,
    )
    .test(
        'more special chars',
        'Cannot contain more than 10 special characters',
        notMoreThan10AnyNonAlphabeticalCharacter,
    )
    .max(100, 'Must contain less than 100 characters');
