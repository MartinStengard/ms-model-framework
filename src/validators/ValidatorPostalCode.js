
const ValidatorPostalCode = (value, required) => {
	const _value = (value || '').toString().trim();

	if (required && _value.length == 0) {
		return 'måste fyllas i';
	}
	if (_value.length > 0 && /^[\s\d]+$/.test(_value) == false) {
		return 'endast siffror';
	}
	if (_value.replace(/\s/g, '').length != 5) {
		return 'måste vara 5 siffror';
	}

	return true;
};

export default ValidatorPostalCode;
