import ValidatorString from './ValidatorString';

const ValidatorEmail = (value, required) => {
	if(required) {
		const validString =	ValidatorString(value, 6, 150);

		if(validString !== true) {
			return validString;
		}
	}

	const _value = (value || '').toString().trim();
	var test = (/^[\w.!#$%&/=?{}|~+-]+@\w+([\w.!#$%&/=?{}|~+-]+)*(\.\w{2,16})+$/.test(_value));
	if (test === false) {
		return 'Ej godkänt format för e-postadress';
	}

	return true;
};

export default ValidatorEmail;
