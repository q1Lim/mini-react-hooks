import "./style.css";

const root = document.querySelector("#app");

let count = 0;

function App() {
  return `
  <main>
    <h1>Mini React Hooks</h1>
    <p>Hi, this is a mini React Hooks implementation.</p>
    <p>count: ${count}</p>
    <button type="button">Increment</button>
  </main>`;
}

function render() {
  root.innerHTML = App();

  const button = document.querySelector("button");
  button.addEventListener("click", () => {
    count++;
    render();
  });
}

render();
