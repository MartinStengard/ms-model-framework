
const LocalDate = (value) => {
	if (!value) {
		return '';
	}
	return new Date(value).toLocaleDateString();
};

const LocalTime = (value) => {
	if (!value) {
		return '';
	}
	return new Date(value).toLocaleTimeString();
};

const LocalDateTime = (value) => {
	if (!value) {
		return '';
	}
	return new Date(value).toLocaleString();
};

export {
	LocalDate,
	LocalTime,
	LocalDateTime
};
