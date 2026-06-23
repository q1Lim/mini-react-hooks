# mini-react-hooks

Vanilla JS로 React Hook을 직접 구현하며 동작 원리를 학습하는 프로젝트입니다.

## 학습 블로그

구현 과정과 원리를 정리한 글을 블로그에 기록하고 있습니다.

## 구현된 Hook

### useState

> [Vanilla JS로 React Hook 구현하기 - useState](https://velog.io/@cochlea00/Vanilla-JS%EB%A1%9C-React-Hook-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0-useState)

- 렌더 간 상태 유지를 위한 `states[]` 배열과 `hookIndex` 기반 구조
- 함수형 초기값 (`lazy initialization`) 지원
- 함수형 업데이트 지원
- `Object.is` 비교로 불필요한 리렌더 방지
- `queueMicrotask`를 활용한 batching 구현

### useRef

> [Vanilla JS로 React Hook 구현하기 - useRef](https://velog.io/@cochlea00/Vanilla-JS%EB%A1%9C-React-Hook-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0-useRef)

- 렌더 간 값 유지를 위한 `refs[]` 배열 구조
- `useState`와 `hookIndex`를 공유하기 위해 `hookCore.js` 모듈로 분리
- `{ current: value }` 객체 참조를 유지해 값 변경 시에도 동일성 보장
- 값이 바뀌어도 리렌더를 트리거하지 않음

### useEffect

> [Vanilla JS로 React Hook 구현하기 - useEffect](https://velog.io/@cochlea00/Vanilla-JS%EB%A1%9C-React-Hook-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0-useEffect)

- 렌더 간 deps/cleanup 유지를 위한 `effects[]` 저장소와, 이번 렌더에서 실행할 effect만 모아두는 `pendingEffects[]` 큐로 분리
- `useEffect()` 호출 시점(렌더 중)엔 실행 여부만 판단해 기록하고, 실제 실행은 DOM 갱신 후 `runPendingEffects()`에서 처리
- deps 배열은 참조 비교(`Object.is`)로는 비교가 안 돼, 원소 단위로 비교하는 `shallowEqual` 유틸(`src/utils/equality.js`) 구현
- 새 callback 실행 전 이전 cleanup을 먼저 호출하도록 구현
- deps를 생략하면(`useEffect(fn)`) 비교 없이 매 렌더 실행되도록 처리

## 기술 스택

- Vanilla JS
- Vite
