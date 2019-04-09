
const ValidatorNumber = (value, min, max) => {
	const _value = (value || '').toString().trim();
	const _min = parseInt(min) || 0;
	const _max = parseInt(max) || 0;

	if (_min && _min > 0 && _max && _max > 0) {
		if (_min === _max && _value.length !== _min) {
			return `måste vara ${_min} siffror`;
		}
	}
	if (_min && _min > 0 && _value.length == 0) {
		return 'måste fyllas i';
	}
	if ((/^[\d]+$/.test(_value)) === false) {
		return 'endast siffror';
	}
	if (_min && _min > 0 && _value.length < _min) {
		return `minst ${_min} siffror`;
	}
	if (_max && _max > 0 && _value.length > _max) {
		return `max ${_max} siffror`;
	}

	return true;
};

export default ValidatorNumber;
