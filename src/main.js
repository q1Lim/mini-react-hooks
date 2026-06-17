import "./style.css";
import { useState, setRerender } from "./hooks/useState";
import { resetHookIndex } from "./hooks/hookCore";

const root = document.querySelector("#app");

function App() {
	const [count, setCount] = useState(() => {
		return 0;
	});
	const [step, setStep] = useState(100);

	return {
		html: `
      <main>
        <h1>Mini React Hooks</h1>
        <p>Hi, this is a mini React Hooks implementation.</p>
        <p>count: ${count}</p>
        <button type="button" id="button1">Increment Count</button>
        <p>step: ${step}</p>
        <button type="button" id="button2">Increment Step</button>
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
		},
	};
}

function render() {
	resetHookIndex();

	const app = App();

	root.innerHTML = app.html;

	const button1 = document.querySelector("#button1");
	const button2 = document.querySelector("#button2");
	button1.addEventListener("click", app.events.clickCountButton);
	button2.addEventListener("click", app.events.clickStepButton);

	console.log("render");
}
setRerender(render);
render();
