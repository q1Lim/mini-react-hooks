import { getNextHookIndex } from "./hookCore";

let states = [];
let rerender;
let isRenderScheduled = false;

// setState가 호출되면 rerender를 호출하기 위해 정의
export function setRerender(callback) {
	console.log("render callback 등록");
	rerender = callback;
}

// batching을 위한 스케쥴 함수 구현
export function scheduleRerender() {
	if (isRenderScheduled) {
		return;
	}

	isRenderScheduled = true;

	// render를 지금 당장 실행하지 않고, 현재 코드가 끝난 직후 실행하도록 예약하기
	queueMicrotask(() => {
		isRenderScheduled = false;
		rerender();
	});
}

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
