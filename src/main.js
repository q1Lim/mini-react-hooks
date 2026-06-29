import "./style.css";
import { useState, setRerender } from "./hooks/useState";
import { resetHookIndex } from "./hooks/hookCore";
import { useRef } from "./hooks/useRef";
import { runPendingEffects, useEffect } from "./hooks/useEffect";
import { useMemo } from "./hooks/useMemo";

const root = document.querySelector("#app");

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
        					<button type="button" id="memoAButton">Increment memoA</button>
        					<p>memoA: ${memoA}</p>
    					</div>
    					<div>
        					<button type="button" id="memoBButton">Increment memoB(unrelated)</button>
        					<p>memoB: ${memoB}</p>
    					</div>
					</div>
				<p>memoizedValue: ${memoizedValue}</p>
			</section>
		</main>
    `,
		events: {
			clickCountButton: () => {
				setCount((prev) => prev + 1);
				setCount((prev) => prev + 1);
				setCount((prev) => prev + 1);
			},
			clickStepButton: () => {
				setStep(step + 1);
			},
			clickStartButton: () => {
				if (timerId.current !== 0) {
					return;
				}
				const id = setInterval(() => {
					console.log("1초씩 tick tock tick tock");
					setTimer((prev) => prev + 1);
				}, 1000);

				timerId.current = id;
			},
			clickStopButton: () => {
				clearInterval(timerId.current);
				timerId.current = 0;
			},
			clickEffectButton: () => {
				setEffectValue((prev) => prev + 6);
			},
			clickMemoAButton: () => {
				setMemoA((prev) => prev + 1);
			},
			clickMemoBButton: () => {
				setMemoB((prev) => prev + 1);
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

	const button1 = document.querySelector("#button1");
	const button2 = document.querySelector("#button2");

	const startButton = document.querySelector("#startButton");
	const stopButton = document.querySelector("#stopButton");

	const effectButton = document.querySelector("#effectButton");

	const memoAButton = document.querySelector("#memoAButton");
	const memoBButton = document.querySelector("#memoBButton");

	button1.addEventListener("click", app.events.clickCountButton);
	button2.addEventListener("click", app.events.clickStepButton);

	startButton.addEventListener("click", app.events.clickStartButton);
	stopButton.addEventListener("click", app.events.clickStopButton);

	effectButton.addEventListener("click", app.events.clickEffectButton);

	memoAButton.addEventListener("click", app.events.clickMemoAButton);
	memoBButton.addEventListener("click", app.events.clickMemoBButton);

	console.log("render");
}
setRerender(render);
render();
