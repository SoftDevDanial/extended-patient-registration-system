export const timeout = (ms) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};
export const setLocalStorage = (key, val) => {
	window.localStorage.setItem(key, JSON.stringify(val));
};

export const getLocalStorage = (key) => {
	return JSON.parse(window.localStorage.getItem(key));
};

export const gridBreakpoints = (xl = 0, lg = xl, md = lg, sm = md, xs = sm) => {
	const grid = {
		xl: xl,
		lg: lg,
		md: md,
		sm: sm,
		xs: xs,
	};
	return grid;
};

export const isObject = (val) => {
	return val ? Object.getPrototypeOf(val) == Object.prototype : false;
};

