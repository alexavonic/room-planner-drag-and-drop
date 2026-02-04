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
		fill: string;
		draggable: boolean;
	}

	let transformer: ReturnType<typeof Transformer> | undefined;
	let copiedRect: Rectangle | null = null;
	let selectedShapeName = $state<string>('');

	let rectangles = $state<Rectangle[]>([
		{
			name: 'rect1',
			rotation: 0,
			x: 50,
			y: 50,
			width: 100,
			height: 80,
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
			fill: '#95E1D3',
			draggable: true
		}
	]);

	const DELTA = 4; // pixels to move on arrow key press

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

	function getSelectedRectNode(): Konva.Rect | undefined {
		const stage = transformer?.node.getStage();
		return stage?.findOne((n: any) => n.name() === selectedShapeName);
	}

	function updateTransformer() {
		if (!transformer) return;

		const selectedNode = getSelectedRectNode();

		// do nothing if selected node is already attached
		if (selectedNode === transformer.node.nodes()[0]) {
			return;
		}

		if (selectedNode) {
			// attach to another node
			transformer.node.nodes([selectedNode]);
			// Move transformer to top of layer to ensure it's always visible
			transformer.node.moveToTop();
		} else {
			// remove transformer
			transformer.node.nodes([]);
		}
	}

	function updateRectProperty(name: string, property: keyof Rectangle, value: number) {
		const rectIndex = rectangles.findIndex((r) => r.name === name);
		if (rectIndex === -1) return;

		// Update the Konva node on canvas
		const node = getSelectedRectNode();
		if (node) {
			node.setAttr(property, value);
			// Use batchDraw instead of draw for better performance
			node.getLayer()?.batchDraw();
		}

		// Update state immutably (better for Svelte reactivity)
		rectangles[rectIndex] = { ...rectangles[rectIndex], [property]: value as never };
	}

	function handleRectangleMove(node: Konva.Rect) {
		const rectIndex = rectangles.findIndex((r) => r.name === node.name());
		if (rectIndex === -1) return;

		// Reuse the normalized values from handleTransformScaling
		rectangles[rectIndex] = {
			...rectangles[rectIndex],
			x: Math.round(node.x()),
			y: Math.round(node.y()),
			width: Math.round(node.width()),
			height: Math.round(node.height()),
			rotation: node.rotation()
		};
	}

	function handleTransformScaling(node: Konva.Rect) {
		// Only normalize if scale is not 1 (avoid unnecessary calculations)
		const scaleX = node.scaleX();
		const scaleY = node.scaleY();

		if (scaleX === 1 && scaleY === 1) return;

		// Normalize: Apply scale to width/height and reset scale to 1
		const newWidth = node.width() * node.scaleX();
		const newHeight = node.height() * node.scaleY();

		// Batch updates to node
		node.setAttrs({
			width: newWidth,
			height: newHeight,
			scaleX: 1,
			scaleY: 1
		});
	}

	function handleOnKeyDown(e: KeyboardEvent) {
		// Handle Ctrl+C (Copy)
		if ((e.ctrlKey || e.metaKey) && e.key === 'c' && selectedShapeName) {
			e.preventDefault();
			onCopy();
		}

		// Handle Ctrl+V (Paste)
		if ((e.ctrlKey || e.metaKey) && e.key === 'v' && copiedRect) {
			e.preventDefault();
			onPaste();
		}

		if (!selectedShapeName) return;

		// Delete selected rectangle on 'Delete' or 'Backspace' key press
		if (e.key === 'Delete' || e.key === 'Backspace') {
			e.preventDefault();

			// Remove rectangle from array
			rectangles = rectangles.filter((r) => r.name !== selectedShapeName);

			// Clear selection
			selectedShapeName = '';
			updateTransformer();
		} else if (e.key === 'Escape') {
			// Deselect on 'Escape' key press
			selectedShapeName = '';
			updateTransformer();
		} else if (e.key === 'ArrowUp') {
			handleArrowMove(e, 0, -DELTA);
		} else if (e.key === 'ArrowDown') {
			handleArrowMove(e, 0, DELTA);
		} else if (e.key === 'ArrowLeft') {
			handleArrowMove(e, -DELTA, 0);
		} else if (e.key === 'ArrowRight') {
			handleArrowMove(e, DELTA, 0);
		}
	}

	function onCopy() {
		if (selectedShapeName) {
			const rect = rectangles.find((r) => r.name === selectedShapeName);
			if (rect) {
				copiedRect = { ...rect };
			}
		}
	}

	function onPaste() {
		if (copiedRect) {
			// Generate unique name
			const newName = generateUniqueName(copiedRect.name);

			// Create new rectangle offset from original
			const newRect: Rectangle = {
				...copiedRect,
				name: newName,
				x: copiedRect.x + 20,
				y: copiedRect.y + 20
			};

			rectangles = [...rectangles, newRect];
			selectedShapeName = newName;

			// Use requestAnimationFrame to wait for Konva to render the new node (fixes selection issue)
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					updateTransformer();
				});
			});
		}
	}

	function generateUniqueName(baseName: string): string {
		// Remove existing number suffix if present
		const nameWithoutSuffix = baseName.replace(/\s*\(\d+\)$/, '');

		let counter = 1;
		let newName = nameWithoutSuffix;

		// Keep incrementing until we find a unique name
		while (rectangles.some((r) => r.name === newName)) {
			newName = `${nameWithoutSuffix} (${counter})`;
			counter++;
		}

		return newName;
	}

	function handleArrowMove(e: KeyboardEvent, deltaX: number, deltaY: number) {
		if (!selectedShapeName) return;

		e.preventDefault();

		const rectIndex = rectangles.findIndex((r) => r.name === selectedShapeName);
		if (rectIndex === -1) return;

		// Update the Konva node on canvas
		const node = getSelectedRectNode();
		if (node) {
			const newX = node.x() + deltaX;
			const newY = node.y() + deltaY;
			node.position({ x: newX, y: newY });
			node.getLayer()?.batchDraw();
			rectangles[rectIndex] = { ...rectangles[rectIndex], x: newX, y: newY };
		}
	}
</script>

<ResponsiveStage
	title="Context Menu Demo"
	description="This page will demonstrate context menu functionality with Konva canvas."
	onmousedown={handleStageMouseDown}
	oncanvasdown={handleCanvasMouseDown}
	onkeydown={handleOnKeyDown}
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
					ondragend={(e) => handleRectangleMove(e.target as Konva.Rect)}
					ontransform={(e) => handleTransformScaling(e.target as Konva.Rect)}
					ontransformend={(e) => handleRectangleMove(e.target as Konva.Rect)}
				/>
			{/each}

			<!-- Position transformer at the bottom of all components so it is always the topmost element on the canvas -->
			<Transformer bind:this={transformer} keepRatio={false} />
		</Layer>
	{/snippet}

	{#snippet overlay()}
		{#if selectedShapeName}
			{@const selectedRect = rectangles.find((r) => r.name === selectedShapeName)}
			{#if selectedRect}
				<div
					class="property-popup absolute top-4 right-4 w-64 rounded-lg border border-gray-300 bg-white p-4 shadow-lg"
				>
					<h3 class="mb-2 font-semibold text-gray-700">Properties</h3>
					<div class="space-y-2 text-sm">
						<div class="flex items-center justify-between gap-4">
							<span class="text-gray-600">Name:</span>
							<input
								type="text"
								class="w-full rounded border border-gray-300 px-2 py-1 font-mono"
								value={selectedRect.name}
								readonly
							/>
						</div>
						<div class="flex items-center justify-between gap-4">
							<span class="text-gray-600">X:</span>
							<input
								type="number"
								class="w-20 rounded border border-gray-300 px-2 py-1 text-right font-mono"
								value={Math.round(selectedRect.x)}
								oninput={(e) =>
									updateRectProperty(selectedRect.name, 'x', Number(e.currentTarget.value))}
							/>
						</div>
						<div class="flex items-center justify-between gap-4">
							<span class="text-gray-600">Y:</span>
							<input
								type="number"
								class="w-20 rounded border border-gray-300 px-2 py-1 text-right font-mono"
								value={Math.round(selectedRect.y)}
								oninput={(e) =>
									updateRectProperty(selectedRect.name, 'y', Number(e.currentTarget.value))}
							/>
						</div>
						<div class="flex items-center justify-between gap-4">
							<span class="text-gray-600">Width:</span>
							<input
								type="number"
								class="w-20 rounded border border-gray-300 px-2 py-1 text-right font-mono"
								value={Math.round(selectedRect.width)}
								oninput={(e) =>
									updateRectProperty(selectedRect.name, 'width', Number(e.currentTarget.value))}
							/>
						</div>
						<div class="flex items-center justify-between gap-4">
							<span class="text-gray-600">Height:</span>
							<input
								type="number"
								class="w-20 rounded border border-gray-300 px-2 py-1 text-right font-mono"
								value={Math.round(selectedRect.height)}
								oninput={(e) =>
									updateRectProperty(selectedRect.name, 'height', Number(e.currentTarget.value))}
							/>
						</div>
						<div class="flex items-center justify-between gap-4">
							<span class="text-gray-600">Rotation:</span>
							<input
								type="number"
								class="w-20 rounded border border-gray-300 px-2 py-1 text-right font-mono"
								value={Math.round(selectedRect.rotation)}
								oninput={(e) =>
									updateRectProperty(selectedRect.name, 'rotation', Number(e.currentTarget.value))}
							/>
						</div>
					</div>
				</div>
			{/if}
		{/if}
	{/snippet}
</ResponsiveStage>

<div class="overflow-y-auto p-8">
	<h2 class="mb-4 text-xl font-semibold">Rectangle Data (JSON):</h2>
	<pre class="overflow-auto rounded bg-gray-100 p-4">{JSON.stringify(rectangles, null, 2)}</pre>
</div>
