import { getNextHookIndex, scheduleRerender } from "./hookCore";

let states = [];

export function useState(initialState) {
	const currentIndex = getNextHookIndex();

	if (states[currentIndex] === undefined) {
		// initialState가 함수인 경우 함수 실행한 값 넣기
		const initialValue = typeof initialState === "function" ? initialState() : initialState;

		states[currentIndex] = initialValue;
	}

	function setState(newState) {
		const currentState = states[currentIndex];

		// newState가 함수일 경우 함수 실행한 값을 nextState에 넣기
		const nextState = typeof newState === "function" ? newState(currentState) : newState;

		// 현재 state와 구한 nextState가 같은 경우 render하지 않고 return 하기
		if (Object.is(currentState, nextState)) {
			return;
		}

		states[currentIndex] = nextState;

		scheduleRerender();
	}
	return [states[currentIndex], setState];
}
