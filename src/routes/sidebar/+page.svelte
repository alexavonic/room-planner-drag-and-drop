<script lang="ts">
	import { Layer, Rect } from 'svelte-konva';
	import ResponsiveStage from '$lib/components/ResponsiveStage.svelte';
	import { createDragBound, dragCursor } from '$lib/utils/konva';

	let rectX = $state(50);
	let rectY = $state(50);

	const rectWidth = 100;
	const rectHeight = 100;
</script>

<ResponsiveStage
	title="Sidebar Demo"
	description="This page will demonstrate sidebar functionality with Konva canvas."
>
	{#snippet children({ stageWidth, stageHeight })}
		<Layer>
			<Rect
				bind:x={rectX}
				bind:y={rectY}
				width={rectWidth}
				height={rectHeight}
				fill="green"
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
