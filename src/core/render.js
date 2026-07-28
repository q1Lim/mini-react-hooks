// vDom 객체를 받아 실제 DOM 노드를 생성해 반환한다.
// 초기 렌더 시 한번 호출
export function createDOMNode(vDom) {
	const element = document.createElement(vDom.type);

	if (vDom.props) {
		Object.entries(vDom.props).forEach(([key, value]) => {
			if (key.startsWith("__")) return;
			if (key.startsWith("on")) {
				// addEventListener 대신 프로퍼티로 할당해 리렌더 시 중복 등록 방지
				element[key.toLowerCase()] = value;
			} else {
				element.setAttribute(key, value);
			}
		});
	}

	vDom.children?.forEach((child) => {
		if (typeof child === "string" || typeof child === "number") {
			element.appendChild(document.createTextNode(child));
		} else {
			element.appendChild(createDOMNode(child));
		}
	});

	return element;
}

// reconcile : 조화시키다.
// React에서는 기존 가상돔과 새로운 가상돔을 비교해서 실제 돔노드의 최소한의 변경만 적용한다.
export function reconcile(oldVDom, newVDom, domNode) {
	if (oldVDom.type !== newVDom.type) {
		console.log("교체:", oldVDom.type, "→", newVDom.type);
		const newNode = createDOMNode(newVDom);
		domNode.parentNode.replaceChild(newNode, domNode);
		return newNode;
	} else {
		Array.from(domNode.attributes).forEach((attr) => {
			domNode.removeAttribute(attr.name);
		});

		if (newVDom.props) {
			Object.entries(newVDom.props).forEach(([key, value]) => {
				if (key.startsWith("__")) return;
				if (key.startsWith("on")) {
					domNode[key.toLowerCase()] = value;
				} else {
					domNode.setAttribute(key, value);
				}
			});
		}

		// childNodes는 live NodeList라 DOM 변경 시 인덱스가 실시간으로 밀림
		// Array.from으로 스냅샷을 찍어 순회 중 인덱스 불일치 방지
		const childNodes = Array.from(domNode.childNodes);

		newVDom.children?.forEach((child, i) => {
			const oldChild = oldVDom.children[i];
			if (typeof child === "string" || typeof child === "number") {
				if (childNodes[i]) {
					childNodes[i].textContent = child;
				} else {
					domNode.appendChild(document.createTextNode(child));
				}
			} else if (oldChild) {
				reconcile(oldChild, child, childNodes[i]);
			} else {
				domNode.appendChild(createDOMNode(child));
			}
		});
		return domNode;
	}
}
