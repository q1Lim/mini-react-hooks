export function createElement(type, props, ...children) {
	return {
		type: type,
		props: props,
		children: children,
	};
}
