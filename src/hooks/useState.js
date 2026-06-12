let states = [];
let hookIndex = 0;
let rerender;

// setState가 호출되면 rerender를 호출하기 위해 정의
export function setRerender(callback) {
  rerender = callback;
}

// 렌더 전에 hookIndex를 초기화하기 위해 정의
export function resetHookIndex() {
  hookIndex = 0;
}

export function useState(initialState) {
  const currentIndex = hookIndex;

  if (states[currentIndex] === undefined) {
    states[currentIndex] = initialState;
  }
  function setState(newState) {
    states[currentIndex] = newState;
    rerender();
  }
  hookIndex++;
  return [states[currentIndex], setState];
}
