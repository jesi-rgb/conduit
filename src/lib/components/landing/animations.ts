// Animation utilities for landing page components

// Words Fade In Component
export function createWordsFadeIn(node: HTMLElement, { words = '', delay = 0.15 } = {}) {
	const wordElements = words.split(' ').map((word, i) => {
		const span = document.createElement('span');
		span.textContent = word + ' ';
		span.style.opacity = '0';
		span.style.transform = 'translateY(10px)';
		span.style.filter = 'blur(4px)';
		span.style.transition = `all 0.4s ease`;
		span.style.transitionDelay = `${i * delay}s`;
		return span;
	});

	node.innerHTML = '';
	wordElements.forEach((span) => node.appendChild(span));

	setTimeout(() => {
		wordElements.forEach((span) => {
			span.style.opacity = '1';
			span.style.transform = 'translateY(0)';
			span.style.filter = 'blur(0)';
		});
	}, 100);

	return {
		destroy() {
			// cleanup if needed
		}
	};
}

// Blur Fade Component
export function createBlurFade(node: HTMLElement, { delay = 0, duration = 0.4 } = {}) {
	node.style.opacity = '0';
	node.style.transform = 'translateY(20px)';
	node.style.filter = 'blur(6px)';
	node.style.transition = `all ${duration}s ease`;

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					setTimeout(() => {
						node.style.opacity = '1';
						node.style.transform = 'translateY(0)';
						node.style.filter = 'blur(0)';
					}, delay * 1000);
				}
			});
		},
		{ threshold: 0.1 }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}