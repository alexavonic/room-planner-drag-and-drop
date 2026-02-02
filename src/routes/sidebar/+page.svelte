<script lang="ts">
	import { Stage, Layer, Rect } from 'svelte-konva';

	let width = $state(0);
	let height = $state(0);
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />

<div class="h-full w-full">
	<div class="p-8">
		<h1 class="mb-4 text-3xl font-bold">Sidebar Demo</h1>
		<p class="text-gray-600">This page will demonstrate sidebar functionality with Konva canvas.</p>
	</div>
	<div class="border-2 border-dashed border-gray-400" style="height: calc(100% - 8rem);">
		<Stage {width} {height}>
			<Layer>
				<Rect x={50} y={50} width={100} height={100} fill="green" />
			</Layer>
		</Stage>
	</div>
</div>
