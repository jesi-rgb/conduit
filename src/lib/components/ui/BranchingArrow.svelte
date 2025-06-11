<!-- BranchArrow.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		startX: number;
		startY: number;
		endX: number;
		endY: number;
		visible?: boolean;
		onClick?: () => void;
	}

	let {
		startX = 100,
		startY = 100,
		endX = 900,
		endY = 900,
		visible = true,
		onClick
	}: Props = $props();

	// Calculate path dimensions
	const pathData = $derived.by(() => {
		const deltaX = endX - startX;
		const deltaY = endY - startY;
		const midX = startX + deltaX * 0.7; // Control point for curve

		// Fixed curve at start (20px radius)
		const curveRadius = 20;
		const arrowSize = 15;

		// Start curve
		const startCurveX = startX + curveRadius;
		const startCurveY = startY;

		// End arrow tip coordinates
		const tipX = endX - arrowSize;
		const tipY = endY;

		return {
			// Main path with curve at start
			mainPath: `M ${startX} ${startY} 
                 Q ${startCurveX} ${startY} ${startCurveX} ${startCurveY + curveRadius}
                 Q ${midX} ${endY} ${tipX} ${tipY}`,

			// Arrow tip
			arrowPath: `M ${tipX} ${tipY - arrowSize / 2} 
                  L ${endX} ${endY} 
                  L ${tipX} ${tipY + arrowSize / 2}
                  L ${tipX + 5} ${tipY}
                  Z`,

			// SVG viewBox
			viewBox: `${Math.min(startX, endX) - 10} ${Math.min(startY, endY) - 10} 
                ${Math.abs(deltaX) + 20} ${Math.abs(deltaY) + 20}`
		};
	});
</script>

{#if visible}
	<svg
		class="branch-arrow"
		style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 10;"
		viewBox={pathData.viewBox}
	>
		<!-- Main curved line -->
		<path
			d={pathData.mainPath}
			stroke="#ff4444"
			stroke-width="3"
			fill="none"
			stroke-linecap="round"
			class="arrow-line"
		/>

		<!-- Arrow tip -->
		<path
			d={pathData.arrowPath}
			fill="#ff4444"
			class="arrow-tip"
			style="cursor: pointer; pointer-events: all;"
			onclick={onClick}
		/>
	</svg>
{/if}

<style>
	.branch-arrow {
		transition: opacity 0.3s ease;
	}

	.arrow-line {
		animation: draw 0.5s ease-out;
		stroke-dasharray: 1000;
		stroke-dashoffset: 1000;
	}

	.arrow-tip {
		transition: transform 0.2s ease;
	}

	.arrow-tip:hover {
		transform: scale(1.1);
	}

	@keyframes draw {
		to {
			stroke-dashoffset: 0;
		}
	}
</style>
