import { getNextHookIndex, scheduleRerender } from "./hookCore";

let states = [];

export function useReducer(reducer, initialArg, init) {
	const currentIndex = getNextHookIndex();

	if (states[currentIndex] === undefined) {
		// initialState가 함수인 경우 함수 실행한 값 넣기
		const initialValue = init ? init(initialArg) : initialArg;
		states[currentIndex] = initialValue;
	}

	// action을 받아 reducer로 새 state 계산 후 저장하고 리렌더 트리거하기
	const dispatch = (action) => {
		const newState = reducer(states[currentIndex], action);
		states[currentIndex] = newState;

		scheduleRerender();
	};

	return [states[currentIndex], dispatch];
}
