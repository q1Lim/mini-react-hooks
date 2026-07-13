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

### useMemo

> [Vanilla JS로 React Hook 구현하기 - useMemo](https://velog.io/@cochlea00/Vanilla-JS%EB%A1%9C-React-Hook-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0-useMemo)

- 렌더 간 deps/memoizedValue 유지를 위한 `memos[]` 저장소
- 렌더링 중에 실행되어 값을 즉시 반환
- `shallowEqual`(`src/utils/equality.js`)로 deps 비교해 변경 시에만 callback 재실행
- 첫 렌더 / deps 변경 / deps 동일 세 케이스로 분기 처리

### useCallback

- `callbacks[]` 배열과 `hookIndex` 기반 슬롯 구조로 함수 참조 캐싱
- `useMemo`와 달리 `fn`을 실행하지 않고 그대로 저장 — `useMemo(() => fn, deps)`와 구조 동일
- deps가 같으면 이전 렌더의 함수 참조를 그대로 반환해 불필요한 리렌더 방지

### useReducer

> [Vanilla JS로 React Hook 구현하기 - useReducer](https://velog.io/@cochlea00/Vanilla-JS%EB%A1%9C-React-Hook-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0-useReducer)

- `states[]` 배열과 `hookIndex` 기반 슬롯 구조로 state 관리 (`useState`와 동일 저장소 패턴)
- `dispatch`는 action을 받아 `reducer(state, action)`으로 새 state 계산 후 `scheduleRerender` 호출
- `init`이 있으면 초기 state를 `init(initialArg)`로 계산
- `reducer`를 컴포넌트 밖에 정의해 state 변경 로직 분리

### createContext / useContext

- `createContext`는 `{ _value, Provider }` 구조의 context 객체 생성
- `Provider(value)`는 `context._value`에 값을 저장
- `useContext(context)`는 `context._value`를 꺼내 반환
- 컴포넌트 트리 없이 전역 값 공유 흐름을 단순 구현

## 기술 스택

- Vanilla JS
- Vite
