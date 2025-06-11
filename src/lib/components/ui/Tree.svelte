<script lang="ts">
	import * as d3 from 'd3';

	// Define props using Svelte 5 runes
	let {
		data,
		path = undefined,
		id = Array.isArray(data) ? (d: any) => d.id : undefined,
		parentId = Array.isArray(data) ? (d: any) => d.parentId : undefined,
		children = undefined,
		tree = d3.tree,
		sort = undefined,
		label = undefined,
		title = undefined,
		link = undefined,
		linkTarget = '_blank',
		width = 640,
		height = 200, // D3 will calculate if undefined
		r = 3, // radius of nodes
		padding = 1, // horizontal padding for first and last column
		fill = '#999', // fill for nodes
		fillOpacity = undefined, // fill opacity for nodes
		stroke = '#555', // stroke for links
		strokeWidth = 1.5, // stroke width for links
		strokeOpacity = 0.4, // stroke opacity for links
		strokeLinejoin = undefined, // stroke line join for links
		strokeLinecap = undefined, // stroke line cap for links
		halo = '#fff', // color of label halo
		haloWidth = 3, // padding around the labels
		curve = d3.curveStep // curve for the link
	} = $props();

	let svgContainer: HTMLDivElement; // Reference to the div where SVG will be appended

	// D3 Tree function adapted for downward growth
	function Tree(data: any, options: any) {
		let {
			path,
			id,
			parentId,
			children,
			tree,
			sort,
			label,
			title,
			link,
			linkTarget,
			width,
			height,
			r,
			padding,
			fill,
			fillOpacity,
			stroke,
			strokeWidth,
			strokeOpacity,
			strokeLinejoin,
			strokeLinecap,
			halo,
			haloWidth,
			curve
		} = options;

		const root =
			path != null
				? d3.stratify().path(path)(data)
				: id != null || parentId != null
					? d3.stratify().id(id).parentId(parentId)(data)
					: d3.hierarchy(data, children);

		if (sort != null) root.sort(sort);

		const descendants = root.descendants();
		const L = label == null ? null : descendants.map((d) => label(d.data, d));

		// --- MODIFICATIONS FOR DOWNWARD GROWTH ---
		// dx now controls vertical spacing, dy controls horizontal spacing
		const dx = 10; // Vertical spacing between nodes
		const dy = width / (root.height + padding); // Horizontal spacing between levels

		// Apply the tree layout with swapped dimensions
		tree().nodeSize([dx, dy])(root);

		// Center the tree vertically (based on y-coordinates)
		let y0 = Infinity;
		let y1 = -y0;
		root.each((d) => {
			if (d.y > y1) y1 = d.y;
			if (d.y < y0) y0 = d.y;
		});

		// Compute the default height (now based on y-extent)
		if (height === undefined) height = y1 - y0 + dx * 2; // dx is vertical padding

		if (typeof curve !== 'function') throw new Error(`Unsupported curve`);

		const svg = d3
			.create('svg')
			// Adjust viewBox: [minX, minY, width, height]
			// minX: -dy * padding / 2 (horizontal padding)
			// minY: y0 - dx (vertical offset to center)
			// width: width of the SVG
			// height: calculated height
			.attr('viewBox', [(-dy * padding) / 2, y0 - dx, width, height])
			.attr('width', width)
			.attr('height', height)
			.attr('style', 'max-width: 100%; height: auto; height: intrinsic;')
			.attr('font-family', 'sans-serif')
			.attr('font-size', 10);

		svg
			.append('g')
			.attr('fill', 'none')
			.attr('stroke', stroke)
			.attr('stroke-opacity', strokeOpacity)
			.attr('stroke-linecap', strokeLinecap)
			.attr('stroke-linejoin', strokeLinejoin)
			.attr('stroke-width', strokeWidth)
			.selectAll('path')
			.data(root.links())
			.join('path')
			// Swap x and y for links
			.attr(
				'd',
				d3
					.link(curve)
					.x((d) => d.x) // Use d.x for horizontal position
					.y((d) => d.y)
			); // Use d.y for vertical position

		const node = svg
			.append('g')
			.selectAll('a')
			.data(root.descendants())
			.join('a')
			.attr('xlink:href', link == null ? null : (d) => link(d.data, d))
			.attr('target', link == null ? null : linkTarget)
			// Swap x and y for node transform
			.attr('transform', (d) => `translate(${d.x},${d.y})`);

		node
			.append('circle')
			.attr('fill', (d) => (d.children ? stroke : fill))
			.attr('r', r);

		if (title != null) node.append('title').text((d) => title(d.data, d));

		if (L)
			node
				.append('text')
				// Adjust text positioning for downward tree
				// x: horizontal offset (e.g., 0 for centered, or -6/6 for left/right)
				// y: vertical offset (e.g., 6 for below node, -6 for above)
				.attr('y', (d) => (d.children ? -6 : 6)) // Place text above/below node
				.attr('x', 0) // Center text horizontally relative to node
				.attr('text-anchor', 'middle') // Center text horizontally
				.attr('dominant-baseline', (d) => (d.children ? 'auto' : 'hanging')) // Adjust vertical alignment
				.attr('paint-order', 'stroke')
				.attr('stroke', halo)
				.attr('stroke-width', haloWidth)
				.text((d, i) => L[i]);

		return svg.node();
	}

	// Effect to re-render the tree when data or options change
	$effect(() => {
		if (svgContainer && data) {
			// Clear previous SVG content
			svgContainer.innerHTML = '';

			// Call the D3 Tree function with current props
			const svgElement = Tree(data, {
				path,
				id,
				parentId,
				children,
				tree,
				sort,
				label,
				title,
				link,
				linkTarget,
				width,
				height,
				r,
				padding,
				fill,
				fillOpacity,
				stroke,
				strokeWidth,
				strokeOpacity,
				strokeLinejoin,
				strokeLinecap,
				halo,
				haloWidth,
				curve
			});

			// Append the new SVG element
			svgContainer.appendChild(svgElement);
		}
	});
</script>

<div bind:this={svgContainer}></div>

<style>
	/* Optional: Add some basic styling for the container if needed */
	div {
		display: flex;
		justify-content: center; /* Center the SVG horizontally */
		align-items: flex-start; /* Align SVG to the top */
		width: 100%;
		height: 100%; /* Or a fixed height if desired */
		overflow: auto; /* Enable scrolling if tree exceeds container */
	}
</style>
