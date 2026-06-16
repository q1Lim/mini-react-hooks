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

## 기술 스택

- Vanilla JS
- Vite
