
const Storage = {
	get: (key) => {
		if (localStorage.hasOwnProperty(key)) {
			const value = localStorage.getItem(key);

			try {
				return JSON.parse(value);
			} catch (e) {
				tg.warn(`Error parsing Key ${key}: ${e.description}`);
				return null;
			}
		}
		return null;
	},

	set: (key, value) => {
		try {
			if (value == null) {
				localStorage.removeItem(key);
			} else {
				localStorage.setItem(key, JSON.stringify(value));
			}
			return true;
		} catch (e) {
			tg.warn(`Error stringifying Key ${key} with value ${value}: ${e.description}`);
			return false;
		}
	}
};

export default Storage;
