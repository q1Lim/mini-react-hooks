import { getNextHookIndex } from "./hookCore";

let refs = [];

export function useRef(initialRef) {
	const currentHookIndex = getNextHookIndex();

	if (refs[currentHookIndex] === undefined) {
		// 객체로 반환하기 위해 객체 생성
		const refObj = { current: initialRef };
		refs[currentHookIndex] = refObj;
	}
	return refs[currentHookIndex];
}
