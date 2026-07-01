import { shallowEqual } from "../utils/equality";
import { getNextHookIndex } from "./hookCore";

let callbacks = [];

export function useCallback(fn, deps) {
	const currentIndex = getNextHookIndex();

	const isSameDeps = shallowEqual(callbacks[currentIndex]?.deps, deps);

	if (callbacks[currentIndex] === undefined) {
		callbacks[currentIndex] = { deps, fn };
		return fn;
	} else if (!isSameDeps) {
		callbacks[currentIndex] = { deps, fn };
		return fn;
	} else {
		return callbacks[currentIndex].fn;
	}
}
