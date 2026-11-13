// src/lib/utils/portal.ts — перенесення модальних вікон у document.body поза межі backdrop-filter контейнерів
export function portal(node: HTMLElement, target?: HTMLElement): { destroy: () => void } {
	const destination = target ?? (typeof document !== 'undefined' ? document.body : null);
	if (destination) {
		destination.appendChild(node);
	}
	return {
		destroy() {
			if (node.parentNode) {
				node.parentNode.removeChild(node);
			}
		}
	};
}
