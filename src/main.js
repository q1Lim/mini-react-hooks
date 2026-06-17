import "./style.css";
import { useState, setRerender } from "./hooks/useState";
import { resetHookIndex } from "./hooks/hookCore";
import { useRef } from "./hooks/useRef";

const root = document.querySelector("#app");

function App() {
	const [count, setCount] = useState(() => {
		return 0;
	});
	const [step, setStep] = useState(100);

	const timerId = useRef(0);
	const [timer, setTimer] = useState(0);

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
		},
	};
}

function render() {
	resetHookIndex();

	const app = App();

	root.innerHTML = app.html;

	const button1 = document.querySelector("#button1");
	const button2 = document.querySelector("#button2");

	const startButton = document.querySelector("#startButton");
	const stopButton = document.querySelector("#stopButton");

	button1.addEventListener("click", app.events.clickCountButton);
	button2.addEventListener("click", app.events.clickStepButton);

	startButton.addEventListener("click", app.events.clickStartButton);
	stopButton.addEventListener("click", app.events.clickStopButton);

	console.log("render");
}
setRerender(render);
render();
