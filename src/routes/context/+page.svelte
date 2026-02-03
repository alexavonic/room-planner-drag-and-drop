<script lang="ts">
	import Konva from 'konva';

	import { Layer, Rect, Transformer } from 'svelte-konva';
	import type { KonvaMouseEvent, KonvaPointerEvent } from 'svelte-konva';

	import ResponsiveStage from '$lib/components/ResponsiveStage.svelte';
	import { createDragBound, dragCursor } from '$lib/utils/konva';

	interface Rectangle {
		name: string;
		rotation: number;
		x: number;
		y: number;
		width: number;
		height: number;
		scaleX: number;
		scaleY: number;
		fill: string;
		draggable: boolean;
	}

	let transformer: ReturnType<typeof Transformer> | undefined;
	let selectedShapeName = $state<string>('');

	let rectangles = $state<Rectangle[]>([
		{
			name: 'rect1',
			rotation: 0,
			x: 50,
			y: 50,
			width: 100,
			height: 80,
			scaleX: 1,
			scaleY: 1,
			fill: '#FF6B6B',
			draggable: true
		},
		{
			name: 'rect2',
			rotation: 0,
			x: 200,
			y: 100,
			width: 120,
			height: 100,
			scaleX: 1,
			scaleY: 1,
			fill: '#4ECDC4',
			draggable: true
		},
		{
			name: 'rect3',
			rotation: 0,
			x: 100,
			y: 250,
			width: 150,
			height: 90,
			scaleX: 1,
			scaleY: 1,
			fill: '#95E1D3',
			draggable: true
		}
	]);

	function handleStageMouseDown(e: KonvaMouseEvent) {
		const target = e.target;
		// clicked on stage - clear selection
		if (target === target.getStage()) {
			selectedShapeName = '';
			updateTransformer();
			return;
		}

		// clicked on transformer - do nothing
		const parent = target.getParent();
		const clickedOnTransformer = parent && parent.className === 'Transformer';
		if (clickedOnTransformer) {
			return;
		}

		// find clicked rect by its name
		const name = target.name();
		const rect = rectangles.find((r) => r.name === name);
		if (rect) {
			selectedShapeName = name;
		} else {
			selectedShapeName = '';
		}

		updateTransformer();
	}

	function handleCanvasMouseDown(e: MouseEvent) {
		// Prevent deselection if clicking on the popup
		const target = e.target as HTMLElement;
		if (target.closest('.property-popup')) {
			e.stopPropagation();
			return;
		}
	}

	function updateTransformer() {
		if (!transformer) return;

		// here we need to manually attach or detach Transformer node
		const stage = transformer.node.getStage();
		const selectedNode = stage?.findOne('.' + selectedShapeName);

		console.log(transformer.node.nodes());

		// do nothing if selected node is already attached
		if (selectedNode === transformer.node.nodes()[0]) {
			return;
		}

		if (selectedNode) {
			// attach to another node
			transformer.node.nodes([selectedNode]);
		} else {
			// remove transformer
			transformer.node.nodes([]);
		}
	}

	function updateRect(node: Konva.Rect) {
		if (!(node instanceof Konva.Rect)) return;

		const rect = rectangles.find((r) => r.name === node.name());
		if (rect) {
			rect.x = node.x();
			rect.y = node.y();
			rect.width = node.width();
			rect.height = node.height();
			rect.scaleX = node.scaleX();
			rect.scaleY = node.scaleY();
		}
	}
</script>

<div class="flex h-full w-full flex-row">
	<ResponsiveStage
		title="Context Menu Demo"
		description="This page will demonstrate context menu functionality with Konva canvas."
		onmousedown={handleStageMouseDown}
		oncanvasdown={handleCanvasMouseDown}
	>
		{#snippet children({ stageWidth, stageHeight })}
			<Layer>
				{#each rectangles as rectangle}
					<Rect
						{...rectangle}
						dragBoundFunc={createDragBound(
							stageWidth,
							stageHeight,
							rectangle.width,
							rectangle.height
						)}
						onmouseenter={dragCursor.grab}
						onmouseleave={dragCursor.default}
						onmousedown={dragCursor.grabbing}
						onmouseup={dragCursor.grab}
						ondragend={(e) => updateRect(e.target as Konva.Rect)}
						ontransformend={(e) => updateRect(e.target as Konva.Rect)}
					/>
				{/each}

				<!-- Position transformer at the bottom of all components so it is always the topmost element on the canvas -->
				<Transformer bind:this={transformer} />
			</Layer>
		{/snippet}

		{#snippet overlay()}
			{#if selectedShapeName}
				{@const selectedRect = rectangles.find((r) => r.name === selectedShapeName)}
				{#if selectedRect}
					<div
						class="property-popup absolute top-4 right-4 rounded-lg border border-gray-300 bg-white p-4 shadow-lg"
					>
						<h3 class="mb-2 font-semibold text-gray-700">Properties</h3>
						<div class="space-y-1 text-sm">
							<div class="flex justify-between gap-4">
								<span class="text-gray-600">X:</span>
								<span class="font-mono">{Math.round(selectedRect.x)}</span>
							</div>
							<div class="flex justify-between gap-4">
								<span class="text-gray-600">Y:</span>
								<span class="font-mono">{Math.round(selectedRect.y)}</span>
							</div>
							<div class="flex justify-between gap-4">
								<span class="text-gray-600">Width:</span>
								<span class="font-mono">{Math.round(selectedRect.width * selectedRect.scaleX)}</span
								>
							</div>
							<div class="flex justify-between gap-4">
								<span class="text-gray-600">Height:</span>
								<span class="font-mono"
									>{Math.round(selectedRect.height * selectedRect.scaleY)}</span
								>
							</div>
						</div>
					</div>
				{/if}
			{/if}
		{/snippet}
	</ResponsiveStage>

	<div class="w-1/3 overflow-y-auto pt-8 pr-8">
		<h2 class="mb-4 text-xl font-semibold">Rectangle Data (JSON):</h2>
		<pre class="overflow-auto rounded bg-gray-100 p-4">{JSON.stringify(rectangles, null, 2)}</pre>
	</div>
</div>
