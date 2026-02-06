<script lang="ts">
	import { Layer, Rect, Stage, type KonvaWheelEvent } from 'svelte-konva';
	import ResponsiveStage from '$lib/components/ResponsiveStage.svelte';
	import { createDragBound, dragCursor } from '$lib/utils/konva';
	import type Konva from 'konva';

	let rectX = $state(100);
	let rectY = $state(100);
	let mouseAbsoluteX = $state(0);
	let mouseAbsoluteY = $state(0);
	let mouseCanvasX = $state(0);
	let mouseCanvasY = $state(0);
	let stageScale = $state(1);

	let stage = $state<ReturnType<typeof Stage> | undefined>(undefined);

	const rectWidth = 200;
	const rectHeight = 100;
	const roomWidth = 1200;
	const roomHeight = 600;
	const scaleBy = 1.01;

	function handleMouseMove() {
		if (!stage?.node) return;

		// Absolute position (screen coordinates)
		const pointer = stage.node.getPointerPosition();
		if (pointer) {
			mouseAbsoluteX = pointer.x;
			mouseAbsoluteY = pointer.y;
		}

		// Canvas position (accounting for zoom/pan)
		const transform = stage.node.getAbsoluteTransform().copy().invert();
		const canvasPos = transform.point(pointer || { x: 0, y: 0 });
		mouseCanvasX = canvasPos.x;
		mouseCanvasY = canvasPos.y;
	}

	function handleDragBound(pos: { x: number; y: number }) {
		if (!stage?.node) return pos;

		// Get the stage's transform and apply it to convert to canvas coordinates
		const stageTransform = stage.node.getAbsoluteTransform().copy().invert();
		const canvasPos = stageTransform.point(pos);

		// Constrain in canvas coordinates
		const constrainedCanvas = {
			x: Math.max(0, Math.min(canvasPos.x, roomWidth - rectWidth)),
			y: Math.max(0, Math.min(canvasPos.y, roomHeight - rectHeight))
		};

		// Transform back to stage coordinates
		const stageTransformForward = stage.node.getAbsoluteTransform();
		const constrainedStage = stageTransformForward.point(constrainedCanvas);

		return constrainedStage;
	}

	function handleWheel(e: KonvaWheelEvent) {
		// Zooming logic inspired by https://konvajs.org/docs/sandbox/Zooming_Relative_To_Pointer.html
		if (!stage?.node) return;

		e.evt.preventDefault();

		const stageNode = stage.node;
		const oldScale = stageNode.scaleX();
		const pointer = stageNode.getPointerPosition();

		if (!pointer) return;

		// Calculate the position of the pointer relative to the stage before scaling
		const mousePointTo = {
			x: (pointer.x - stageNode.x()) / oldScale,
			y: (pointer.y - stageNode.y()) / oldScale
		};

		// Determine the new scale factor based on the wheel delta
		const direction = e.evt.deltaY > 0 ? -1 : 1;
		const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;
		stageNode.scale({ x: newScale, y: newScale });

		// Calculate the new position of the stage to keep the pointer in the same place
		const newPos = {
			x: pointer.x - mousePointTo.x * newScale,
			y: pointer.y - mousePointTo.y * newScale
		};
		stageNode.position(newPos);
		stageScale = newScale;
	}
</script>

<div class="flex h-full w-full flex-row overflow-hidden">
	<ResponsiveStage
		title="Zoom & Pan Demo"
		description="This page demonstrates zooming and panning functionality. Use mouse wheel to zoom in and out, and click and drag on empty canvas space to pan around."
		draggable={true}
		onpointermove={handleMouseMove}
		onwheel={handleWheel}
		bind:stage
	>
		{#snippet children({ stageWidth, stageHeight })}
			<Layer>
				<!-- Border around original canvas size -->
				<Rect
					x={0}
					y={0}
					width={1200}
					height={600}
					stroke="red"
					strokeWidth={2}
					listening={false}
				/>

				<Rect
					bind:x={rectX}
					bind:y={rectY}
					width={rectWidth}
					height={rectHeight}
					fill="blue"
					draggable
					dragBoundFunc={handleDragBound}
					onmouseenter={dragCursor.grab}
					onmouseleave={dragCursor.default}
					onmousedown={dragCursor.grabbing}
					onmouseup={dragCursor.grab}
				/>
			</Layer>
		{/snippet}
	</ResponsiveStage>
	<div class="my-auto w-60 pr-2">
		<p class="font-semibold">Room Scale factor:</p>
		<p>{stageScale.toFixed(2) || '1.00'}</p>
		<br />
		<p class="font-semibold">Rectangle Position:</p>
		<p>X: {Math.round(rectX)}</p>
		<p>Y: {Math.round(rectY)}</p>
		<br />
		<p class="font-semibold">Mouse Absolute Position:</p>
		<p>X: {Math.round(mouseAbsoluteX)}</p>
		<p>Y: {Math.round(mouseAbsoluteY)}</p>
		<br />
		<p class="font-semibold">Mouse Relative Position:</p>
		<p>X: {Math.round(mouseCanvasX)}</p>
		<p>Y: {Math.round(mouseCanvasY)}</p>
	</div>
</div>
