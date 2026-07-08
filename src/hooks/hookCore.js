let hookIndex = 0;

// 렌더 전에 hookIndex를 초기화하기 위해 정의
export function resetHookIndex() {
	hookIndex = 0;
}

// useRef와 useState의 hookIndex를 공유하기 위해 hookIndex를 구하는 함수 정의
export function getNextHookIndex() {
	const currentHookIndex = hookIndex;
	hookIndex++;
	return currentHookIndex;
}

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
