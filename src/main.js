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

const root = document.querySelector("#app");

const ThemeContext = createContext();

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

	ThemeContext.Provider("dark");
	const theme = useContext(ThemeContext);

	return {
		html: `
		<main>
			<h1>Mini React Hooks</h1>
			<p>Hi, this is a mini React Hooks implementation.</p>
			<br/>
			<section>
				<h2>useState</h2>
					<p>count: ${count}</p>
					<button type="button" id="button1">Increment Count</button>
					<p>step: ${step}</p>
					<button type="button" id="button2">Increment Step</button>
			</section>
			<br/>
			<section>
				<h2>useRef</h2>
					<p>Timer</p>
					<button type="button" id="startButton">Start!</button>
					<button type="button" id="stopButton">Stop!</button>				
					<p>Timer: ${timer}s</p>
			</section>
			<br/>
			<section>
				<h2>useEffect</h2>
					<p>EffectValue</p>
					<button type="button" id="effectButton">Increment effectValue</button>	
					<p>EffectValue: ${effectValue}</p>
			</section>
			<br/>
			<section>
				<h2>useMemo</h2>
					<div style="display: flex; gap: 16px; justify-content: center;">
    					<div>
        					<button type="button" id="memoAButton">Increment memo A</button>
        					<p>memoA: ${memoA}</p>
    					</div>
    					<div>
        					<button type="button" id="memoBButton">Increment memo B(unrelated)</button>
        					<p>memoB: ${memoB}</p>
    					</div>
					</div>
				<p>memoizedValue: ${memoizedValue}</p>
			</section>
			<br/>
			<section>
				<h2>useCallback</h2>
					<div style="display: flex; gap: 16px; justify-content: center;">
    					<div>
        					<button type="button" id="callbackAButton">Increment callback A</button>
        					<p>memoA: ${callbackA}</p>
    					</div>
    					<div>
        					<button type="button" id="callbackBButton">Increment callback B(unrelated)</button>
        					<p>memoB: ${callbackB}</p>
    					</div>
					</div>
			</section>
			<br/>
			<section>
				<h2>useReducer</h2>
					<div style="display: flex; gap: 16px; justify-content: center;">
    					<div>
        					<button type="button" id="reducerIButton">Increment reducer</button>
    					</div>
    					<div>
        					<button type="button" id="reducerDButton">decrement reducer</button>
    					</div>
						<div>
        					<button type="button" id="reducerRButton">Reset reducer</button>
    					</div>
					</div>
					<p>Reducer: ${reducerState}</p>
			</section>
			<br/>
			<section>
				<h2>useContext</h2>
					<p>theme: ${theme}</p>
			</section>
		</main>
    `,
		events: {
			button1: () => {
				setCount((prev) => prev + 1);
				setCount((prev) => prev + 1);
				setCount((prev) => prev + 1);
			},
			button2: () => {
				setStep(step + 1);
			},
			startButton: () => {
				if (timerId.current !== 0) {
					return;
				}
				const id = setInterval(() => {
					console.log("1초씩 tick tock tick tock");
					setTimer((prev) => prev + 1);
				}, 1000);

				timerId.current = id;
			},
			stopButton: () => {
				clearInterval(timerId.current);
				timerId.current = 0;
			},
			effectButton: () => {
				setEffectValue((prev) => prev + 6);
			},
			memoAButton: () => {
				setMemoA((prev) => prev + 1);
			},
			memoBButton: () => {
				setMemoB((prev) => prev + 1);
			},
			callbackAButton: () => {
				setCallbackA((prev) => prev + 10);
			},
			callbackBButton: () => {
				setCallbackB((prev) => prev + 10);
			},
			reducerIButton: () => {
				setReducerState({ type: "INCREMENT" });
			},
			reducerDButton: () => {
				setReducerState({ type: "DECREMENT" });
			},
			reducerRButton: () => {
				setReducerState({ type: "RESET" });
			},
		},
	};
}

function render() {
	resetHookIndex();

	const app = App();

	root.innerHTML = app.html;

	// DOM이 갱신된 후 effects 실행
	runPendingEffects();

	Object.entries(app.events).forEach(([id, handler]) => {
		document.querySelector(`#${id}`)?.addEventListener("click", handler);
	});

	console.log("render");
}
setRerender(render);
render();
