import { getNextHookIndex } from "./hookCore";
import { shallowEqual } from "../utils/equality";

// effects[]: 렌더 간 deps/cleanup 유지를 위한 저장소
let effects = [];
// pendingEffects[]: 이번 렌더에서 새로 실행할 effect들을 모아두는 peding queue
let pendingEffects = [];

// DOM 갱신 이후에 호출되어 pending되어있던 effects들을 실행시키는 함수
export function runPendingEffects() {
	for (const effect of pendingEffects) {
		// 새 callback 실행 전에 이전 cleanup을 먼저 호출해 정리
		if (effect.cleanup) {
			effect.cleanup();
		}
		effects[effect.index].cleanup = effect.callback();
	}
	pendingEffects.length = 0;
}

export function useEffect(callback, deps) {
	const currentIndex = getNextHookIndex();

	// deps에 값을 채우지 않은 경우
	if (deps === undefined) {
		const currentEffect = effects[currentIndex];
		pendingEffects.push({
			index: currentIndex,
			callback: callback,
			cleanup: currentEffect?.cleanup,
		});
		effects[currentIndex] = { deps };
		return;
	}

	// 얕은 비교를 통해 deps가 같은 것인지 확인
	const isSameDeps = shallowEqual(effects[currentIndex]?.deps, deps);

	console.log(
		"currentIndex:",
		currentIndex,
		"effects[currentIndex].deps:",
		effects[currentIndex]?.deps,
		"deps:",
		deps,
		"isSameDeps:",
		isSameDeps
	);

	// 처음이라 비교할 이전 deps가 없는 경우 무조건 실행한다.
	if (effects[currentIndex] === undefined) {
		effects[currentIndex] = { deps };
		pendingEffects.push({
			index: currentIndex,
			callback: callback,
			cleanup: undefined,
		});
	} else if (!isSameDeps) {
		// deps가 달라졌다면 실행 필요, 직전 cleanup도 같이 넘겨서 나중에 처리
		const currentEffect = effects[currentIndex];
		pendingEffects.push({
			index: currentIndex,
			callback: callback,
			cleanup: currentEffect.cleanup,
		});
		effects[currentIndex] = { deps };
	}
}
