<script lang="ts">
	import { Layer, Rect } from 'svelte-konva';
	import ResponsiveStage from '$lib/components/ResponsiveStage.svelte';
	import { createDragBound, dragCursor } from '$lib/utils/konva';

	let rectX = $state(100);
	let rectY = $state(100);

	const rectWidth = 400;
	const rectHeight = 200;
</script>

<ResponsiveStage
	title="Drag and Drop Demo"
	description="This page will demonstrate drag and drop functionality with Konva canvas using boundary constraints and responsive sizing."
>
	{#snippet children({ stageWidth, stageHeight })}
		<Layer>
			<Rect
				bind:x={rectX}
				bind:y={rectY}
				width={rectWidth}
				height={rectHeight}
				fill="blue"
				draggable
				dragBoundFunc={createDragBound(stageWidth, stageHeight, rectWidth, rectHeight)}
				onmouseenter={dragCursor.grab}
				onmouseleave={dragCursor.default}
				onmousedown={dragCursor.grabbing}
				onmouseup={dragCursor.grab}
			/>
		</Layer>
	{/snippet}
</ResponsiveStage>
