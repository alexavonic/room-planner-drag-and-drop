<script lang="ts">
	import { Stage, Layer, Rect } from 'svelte-konva';

	let width = $state(0);
	let height = $state(0);

	let rectX = $state(100);
	let rectY = $state(100);

	const rectWidth = 400;
	const rectHeight = 200;

	function dragBound(pos: { x: number; y: number }) {
		return {
			x: Math.max(0, Math.min(pos.x, width - rectWidth)),
			y: Math.max(0, Math.min(pos.y, height - rectHeight))
		};
	}
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<div class="h-screen w-full border-2 border-dashed border-gray-400">
	<Stage {width} {height}>
		<Layer>
			<Rect
				bind:x={rectX}
				bind:y={rectY}
				width={rectWidth}
				height={rectHeight}
				fill="blue"
				draggable
				dragBoundFunc={dragBound}
			/>
		</Layer>
	</Stage>
</div>

<!-- Move to app.css -->
<style>
	:global(html),
	:global(body),
	:global(#svelte) {
		width: 100%;
		height: 100%;
		margin: 0;
	}
</style>
