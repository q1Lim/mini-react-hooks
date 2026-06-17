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