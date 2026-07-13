export function createContext() {
	const Provider = (value) => {
		context._value = value;
	};
	const context = {
		_value: undefined,
		Provider: Provider,
	};

	return context;
}
