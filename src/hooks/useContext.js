import { scheduleRerender } from "./hookCore";

export function useContext(context) {
	context._subscribers.add(scheduleRerender);
	return context._value;
}
