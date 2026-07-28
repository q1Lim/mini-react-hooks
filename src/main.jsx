import "./style.css";
import { useState } from "./hooks/useState";
import { resetHookIndex, setRerender } from "./hooks/hookCore";
import { useRef } from "./hooks/useRef";
import { runPendingEffects, useEffect } from "./hooks/useEffect";
import { useMemo } from "./hooks/useMemo";
import { useCallback } from "./hooks/useCallback";
import { useReducer } from "./hooks/useReducer";
import { createContext } from "./hooks/createContext";
import { useContext } from "./hooks/useContext";
import { createDOMNode, reconcile } from "./core/render";

let prevVDom = null;

const root = document.querySelector("#app");

const ThemeContext = createContext();

ThemeContext.Provider("dark");

function counterReducer(reducerState, action) {
	switch (action.type) {
		case "INCREMENT":
			return reducerState + 1;
		case "DECREMENT":
			return reducerState - 1;
		case "RESET":
			reducerState = 0;
			return reducerState;
	}
}

function App() {
	const [count, setCount] = useState(() => {
		return 0;
	});
	const [step, setStep] = useState(100);

	const timerId = useRef(0);
	const [timer, setTimer] = useState(0);

	const [effectValue, setEffectValue] = useState(0);

	useEffect(() => {
		console.log("useEffect 실행됨! effectValue:", effectValue);
		return () => console.log("cleanup 실행됨! 이전 effectValue:", effectValue);
	}, [effectValue]);

	const [memoA, setMemoA] = useState(0);
	const [memoB, setMemoB] = useState(0);

	const memoizedValue = useMemo(() => {
		console.log("useMemo: 재계산!");
		return memoA * 2;
	}, [memoA]);

	const [callbackA, setCallbackA] = useState(0);
	const [callbackB, setCallbackB] = useState(0);

	const prevFnRef = useRef(null);

	const cachedFn = useCallback(() => {
		console.log("callbackDep:", callbackA);
	}, [callbackA]);

	console.log("same reference?", prevFnRef.current === cachedFn);
	prevFnRef.current = cachedFn;

	const [reducerState, setReducerState] = useReducer(counterReducer, 0);

	const theme = useContext(ThemeContext);

	return (
		<main>
			<h1>Mini React Hooks</h1>
			<p>Hi, this is a mini React Hooks implementation.</p>
			<br />
			<section>
				<h2>useState</h2>
				<p>count: {count}</p>
				<button
					type="button"
					onClick={() => {
						setCount((prev) => prev + 1);
						setCount((prev) => prev + 1);
						setCount((prev) => prev + 1);
					}}
				>
					Increment Count
				</button>
				<p>step: {step}</p>
				<button type="button" onClick={() => setStep(step + 1)}>
					Increment Step
				</button>
			</section>
			<br />
			<section>
				<h2>useRef</h2>
				<p>Timer</p>
				<button
					type="button"
					onClick={() => {
						if (timerId.current !== 0) return;
						const id = setInterval(() => {
							console.log("1초씩 tick tock tick tock");
							setTimer((prev) => prev + 1);
						}, 1000);
						timerId.current = id;
					}}
				>
					Start!
				</button>
				<button
					type="button"
					onClick={() => {
						clearInterval(timerId.current);
						timerId.current = 0;
					}}
				>
					Stop!
				</button>
				<p>Timer: {timer}s</p>
			</section>
			<br />
			<section>
				<h2>useEffect</h2>
				<p>EffectValue</p>
				<button type="button" onClick={() => setEffectValue((prev) => prev + 6)}>
					Increment effectValue
				</button>
				<p>EffectValue: {effectValue}</p>
			</section>
			<br />
			<section>
				<h2>useMemo</h2>
				<div style="display: flex; gap: 16px; justify-content: center;">
					<div>
						<button type="button" onClick={() => setMemoA((prev) => prev + 1)}>
							Increment memo A
						</button>
						<p>memoA: {memoA}</p>
					</div>
					<div>
						<button type="button" onClick={() => setMemoB((prev) => prev + 1)}>
							Increment memo B(unrelated)
						</button>
						<p>memoB: {memoB}</p>
					</div>
				</div>
				<p>memoizedValue: {memoizedValue}</p>
			</section>
			<br />
			<section>
				<h2>useCallback</h2>
				<div style="display: flex; gap: 16px; justify-content: center;">
					<div>
						<button type="button" onClick={() => setCallbackA((prev) => prev + 10)}>
							Increment callback A
						</button>
						<p>callbackA: {callbackA}</p>
					</div>
					<div>
						<button type="button" onClick={() => setCallbackB((prev) => prev + 10)}>
							Increment callback B(unrelated)
						</button>
						<p>callbackB: {callbackB}</p>
					</div>
				</div>
			</section>
			<br />
			<section>
				<h2>useReducer</h2>
				<div style="display: flex; gap: 16px; justify-content: center;">
					<div>
						<button type="button" onClick={() => setReducerState({ type: "INCREMENT" })}>
							Increment reducer
						</button>
					</div>
					<div>
						<button type="button" onClick={() => setReducerState({ type: "DECREMENT" })}>
							Decrement reducer
						</button>
					</div>
					<div>
						<button type="button" onClick={() => setReducerState({ type: "RESET" })}>
							Reset reducer
						</button>
					</div>
				</div>
				<p>Reducer: {reducerState}</p>
			</section>
			<br />
			<section>
				<h2>useContext</h2>
				<p>theme: {theme}</p>
				<button
					type="button"
					onClick={() => {
						const next = ThemeContext._value === "dark" ? "light" : "dark";
						ThemeContext.Provider(next);
					}}
				>
					Toggle Theme
				</button>
			</section>
		</main>
	);
}

function render() {
	resetHookIndex();

	const vDom = App();

	if (prevVDom === null) {
		root.appendChild(createDOMNode(vDom));
	} else {
		reconcile(prevVDom, vDom, root.firstChild);
	}

	prevVDom = vDom;

	// DOM이 갱신된 후 effects 실행
	runPendingEffects();

	console.log("render");
}
setRerender(render);
render();
