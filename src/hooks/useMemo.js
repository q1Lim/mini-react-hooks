import { getNextHookIndex } from "./hookCore";
import { shallowEqual } from "../utils/equality";

// memos[]: 렌더 간 deps/memoizedValue 유지를 위한 저장소
let memos = [];

export function useMemo(callback, deps) {
	const currentIndex = getNextHookIndex();

	// 얕은 비교를 통해 deps가 같은 것인지 확인
	const isSameDeps = shallowEqual(memos[currentIndex]?.deps, deps);

	// 비교할 이전 deps가 없는 경우 무조건 실행
	if (memos[currentIndex] === undefined) {
		const memoizedValue = callback();
		memos[currentIndex] = { deps, memoizedValue };
		return memoizedValue;

		// deps가 달라졌다면 callback을 재실행해 새 값을 저장
	} else if (!isSameDeps) {
		const memoizedValue = callback();
		memos[currentIndex] = { deps, memoizedValue };

		return memoizedValue;

		//  deps가 같다면 이전에 계산한 값을 그대로 반환
	} else {
		return memos[currentIndex].memoizedValue;
	}
}
