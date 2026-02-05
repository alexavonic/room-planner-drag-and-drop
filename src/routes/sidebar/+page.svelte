<script lang="ts">
	import { Layer, Rect, Image, Circle, Arrow, Wedge } from 'svelte-konva';

	import ResponsiveStage from '$lib/components/ResponsiveStage.svelte';
	import SideBar from '$lib/components/SideBar.svelte';

	import { dragCursor } from '$lib/utils/konva';
	import { ShapeType } from '$lib/utils/types';
	import type {
		CanvasImage,
		CanvasRectangle,
		CanvasCircle,
		CanvasArrow,
		CanvasWedge
	} from '$lib/utils/types';

	let images = $state<CanvasImage[]>([]);
	let rectangles = $state<CanvasRectangle[]>([]);
	let circles = $state<CanvasCircle[]>([]);
	let arrows = $state<CanvasArrow[]>([]);
	let wedges = $state<CanvasWedge[]>([]);

	// Cache loaded images to prevent duplicates
	const imageCache = new Map<string, HTMLImageElement>();
	const imageLoading = new Set<string>();

	function handleDrop(e: DragEvent) {
		e.preventDefault();

		const shapeType = e.dataTransfer?.getData('shapeType') as ShapeType;
		const imageSrc = e.dataTransfer?.getData('imageSrc');
		if (!shapeType) return;

		const stage = e.currentTarget as HTMLElement;
		const rect = stage.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		if (shapeType === ShapeType.Image && imageSrc) {
			initializeImage(imageSrc, x, y);
		} else if (shapeType === ShapeType.Rect) {
			addRectangleToCanvas(x, y);
		} else if (shapeType === ShapeType.Circle) {
			addCircleToCanvas(x, y);
		} else if (shapeType === ShapeType.Arrow) {
			addArrowToCanvas(x, y);
		} else if (shapeType === ShapeType.Wedge) {
			addWedgeToCanvas(x, y);
		}
	}

	function initializeImage(imageSrc: string, x: number, y: number) {
		// Check if image is already cached
		if (imageCache.has(imageSrc)) {
			const img = imageCache.get(imageSrc)!;
			addImageToCanvas(img, x, y);
			return;
		}

		// Skip if already loading
		if (imageLoading.has(imageSrc)) return;

		// Load new image
		imageLoading.add(imageSrc);
		const img = new window.Image();
		img.crossOrigin = 'Anonymous';

		img.onload = () => {
			if (!imageCache.has(imageSrc)) {
				imageCache.set(imageSrc, img);
				imageLoading.delete(imageSrc);
				addImageToCanvas(img, x, y);
			}
		};
		img.onerror = () => imageLoading.delete(imageSrc);
		img.src = imageSrc;
	}

	function addImageToCanvas(img: HTMLImageElement, x: number, y: number) {
		images.push({
			id: crypto.randomUUID(),
			src: img.src,
			x: x - img.width / 2,
			y: y - img.height / 2,
			width: img.width,
			height: img.height,
			image: img
		});
	}

	function addRectangleToCanvas(x: number, y: number) {
		rectangles.push({
			id: crypto.randomUUID(),
			x: x - 50,
			y: y - 25,
			width: 100,
			height: 50,
			fill: 'rgba(0,0,255,0.5)',
			rotation: 0
		});
	}

	function addCircleToCanvas(x: number, y: number) {
		circles.push({
			id: crypto.randomUUID(),
			x: x,
			y: y,
			radius: 30,
			fill: 'rgba(255,0,0,0.5)',
			rotation: 0
		});
	}

	function addArrowToCanvas(x: number, y: number) {
		arrows.push({
			id: crypto.randomUUID(),
			points: [x, y, x + 50, y],
			fill: 'rgba(0,0,0,1)',
			stroke: 'rgba(0,0,0,1)',
			strokeWidth: 2,
			rotation: 0
		});
	}

	function addWedgeToCanvas(x: number, y: number) {
		wedges.push({
			id: crypto.randomUUID(),
			x: x,
			y: y,
			radius: 80,
			angle: 60,
			fill: 'rgba(255,165,0,0.5)',
			rotation: 270
		});
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
	}
</script>

<div class="flex h-full bg-slate-100">
	<SideBar />

	<ResponsiveStage
		title="Sidebar Demo"
		description="This page will demonstrate sidebar functionality with Konva canvas."
		ondrop={handleDrop}
		ondragover={handleDragOver}
	>
		{#snippet children()}
			<Layer>
				{#each images as img (img.id)}
					<Image image={img.image} x={img.x} y={img.y} draggable={true} />
				{/each}
				{#each rectangles as rect (rect.id)}
					<Rect
						x={rect.x}
						y={rect.y}
						width={rect.width}
						height={rect.height}
						fill={rect.fill}
						rotation={rect.rotation}
						draggable={true}
						onmouseenter={dragCursor.grab}
						onmouseleave={dragCursor.default}
						onmousedown={dragCursor.grabbing}
						onmouseup={dragCursor.grab}
					/>
				{/each}
				{#each circles as circ (circ.id)}
					<Circle
						x={circ.x}
						y={circ.y}
						radius={circ.radius}
						fill={circ.fill}
						rotation={circ.rotation}
						draggable={true}
						onmouseenter={dragCursor.grab}
						onmouseleave={dragCursor.default}
						onmousedown={dragCursor.grabbing}
						onmouseup={dragCursor.grab}
					/>
				{/each}
				{#each arrows as arr (arr.id)}
					<Arrow
						points={arr.points}
						fill={arr.fill}
						stroke={arr.stroke}
						strokeWidth={arr.strokeWidth}
						rotation={arr.rotation}
						draggable={true}
						onmouseenter={dragCursor.grab}
						onmouseleave={dragCursor.default}
						onmousedown={dragCursor.grabbing}
						onmouseup={dragCursor.grab}
					/>
				{/each}
				{#each wedges as wed (wed.id)}
					<Wedge
						x={wed.x}
						y={wed.y}
						radius={wed.radius}
						angle={wed.angle}
						fill={wed.fill}
						rotation={wed.rotation}
						draggable={true}
						onmouseenter={dragCursor.grab}
						onmouseleave={dragCursor.default}
						onmousedown={dragCursor.grabbing}
						onmouseup={dragCursor.grab}
					/>
				{/each}
			</Layer>
		{/snippet}
	</ResponsiveStage>
</div>
