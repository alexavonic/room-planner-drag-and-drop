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

<div class="h-full w-full">
	<div class="p-8">
		<h1 class="mb-4 text-3xl font-bold">Drag and Drop</h1>
		<p class="text-gray-600">
			This page will demonstrate drag and drop functionality with Konva canvas.
		</p>
	</div>
	<div class="h-full w-full border-2 border-dashed border-gray-400">
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
</div>
