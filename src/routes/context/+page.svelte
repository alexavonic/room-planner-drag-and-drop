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
	title="Context Menu Demo"
	description="This page will demonstrate context menu functionality with Konva canvas."
>
	{#snippet children({ width, height })}
		<Layer>
			<Rect
				bind:x={rectX}
				bind:y={rectY}
				width={rectWidth}
				height={rectHeight}
				fill="red"
				draggable
				dragBoundFunc={createDragBound(width, height, rectWidth, rectHeight)}
				onmouseenter={dragCursor.grab}
				onmouseleave={dragCursor.default}
				onmousedown={dragCursor.grabbing}
				onmouseup={dragCursor.grab}
				oncontextmenu={(e) => {
					e.evt.preventDefault();
					alert(`Context menu opened at (${e.evt.clientX}, ${e.evt.clientY})`);
				}}
			/>
		</Layer>
	{/snippet}
</ResponsiveStage>
