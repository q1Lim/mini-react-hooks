export function createContext() {
	const Provider = (value) => {
		if (context._value !== value) {
			context._value = value;
			context._subscribers.forEach((sub) => {
				sub();
			});
		}
	};
	const context = {
		_value: undefined,
		Provider: Provider,
		_subscribers: new Set(),
	};

	return context;
}
