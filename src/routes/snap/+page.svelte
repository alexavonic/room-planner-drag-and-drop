<script lang="ts">
	import { Layer, Rect, Line } from 'svelte-konva';
	import ResponsiveStage from '$lib/components/ResponsiveStage.svelte';
	import { dragCursor } from '$lib/utils/konva';
	import Konva from 'konva';

	const GUIDELINE_OFFSET = 5;

	type Rectangle = {
		id: number;
		x: number;
		y: number;
		width: number;
		height: number;
		fill: string;
		rotation: number;
	};

	type BoundingBox = {
		x: number;
		y: number;
		width: number;
		height: number;
	};

	type SnapEdge = {
		guide: number;
		offset: number;
		snap: 'start' | 'center' | 'end';
	};

	type SnapGuide = {
		lineGuide: number;
		offset: number;
		orientation: 'V' | 'H';
		snap: string;
	};

	type GuideLine = {
		points: number[];
		x: number;
		y: number;
		orientation: string;
	};

	let rectangles = $state<Rectangle[]>([]);
	let guideLines = $state<GuideLine[]>([]);

	// Initialize rectangles
	$effect(() => {
		if (rectangles.length === 0) {
			rectangles = Array.from({ length: 5 }, (_, i) => ({
				id: i,
				x: Math.random() * 800,
				y: Math.random() * 500,
				width: 50 + Math.random() * 50,
				height: 50 + Math.random() * 50,
				fill: Konva.Util.getRandomColor(),
				rotation: Math.random() * 360
			}));
		}
	});

	// Helper: Calculate bounding box for rotated rectangle
	function getClientRect(rect: Rectangle): BoundingBox {
		const rad = (rect.rotation * Math.PI) / 180;
		const cos = Math.cos(rad);
		const sin = Math.sin(rad);

		// Calculate all four corners after rotation
		const corners = [
			{ x: rect.x, y: rect.y },
			{ x: rect.x + rect.width * cos, y: rect.y + rect.width * sin },
			{
				x: rect.x + rect.width * cos - rect.height * sin,
				y: rect.y + rect.width * sin + rect.height * cos
			},
			{ x: rect.x - rect.height * sin, y: rect.y + rect.height * cos }
		];

		const xs = corners.map((c) => c.x);
		const ys = corners.map((c) => c.y);

		return {
			x: Math.min(...xs),
			y: Math.min(...ys),
			width: Math.max(...xs) - Math.min(...xs),
			height: Math.max(...ys) - Math.min(...ys)
		};
	}

	// Helper: Create snap edge data for a single axis
	function createSnapEdges(boxStart: number, boxSize: number, absPos: number): SnapEdge[] {
		return [
			{
				guide: Math.round(boxStart),
				offset: Math.round(absPos - boxStart),
				snap: 'start'
			},
			{
				guide: Math.round(boxStart + boxSize / 2),
				offset: Math.round(absPos - boxStart - boxSize / 2),
				snap: 'center'
			},
			{
				guide: Math.round(boxStart + boxSize),
				offset: Math.round(absPos - boxStart - boxSize),
				snap: 'end'
			}
		];
	}

	// Helper: Extract snap points from a bounding box
	function getBoxSnapPoints(box: BoundingBox): number[][] {
		return [
			[box.x, box.x + box.width / 2, box.x + box.width],
			[box.y, box.y + box.height / 2, box.y + box.height]
		];
	}

	// Get all possible snap guide stops from stage and other shapes
	function getLineGuideStops(skipShapeId: number, stageWidth: number, stageHeight: number) {
		const vertical = [0, stageWidth / 2, stageWidth];
		const horizontal = [0, stageHeight / 2, stageHeight];

		rectangles.forEach((rect) => {
			if (rect.id === skipShapeId) return;
			const box = getClientRect(rect);
			const [vPoints, hPoints] = getBoxSnapPoints(box);
			vertical.push(...vPoints);
			horizontal.push(...hPoints);
		});

		return { vertical, horizontal };
	}

	// Get snapping edges of the dragged object
	function getObjectSnappingEdges(rect: Rectangle) {
		const box = getClientRect(rect);
		return {
			vertical: createSnapEdges(box.x, box.width, rect.x),
			horizontal: createSnapEdges(box.y, box.height, rect.y)
		};
	}

	// Helper: Find snaps within threshold for one axis
	function findAxisSnaps(
		lineGuides: number[],
		itemBounds: SnapEdge[]
	): Array<{ lineGuide: number; diff: number; snap: string; offset: number }> {
		const snaps: Array<{ lineGuide: number; diff: number; snap: string; offset: number }> = [];

		for (const lineGuide of lineGuides) {
			for (const itemBound of itemBounds) {
				const diff = Math.abs(lineGuide - itemBound.guide);
				if (diff < GUIDELINE_OFFSET) {
					snaps.push({
						lineGuide,
						diff,
						snap: itemBound.snap,
						offset: itemBound.offset
					});
				}
			}
		}

		return snaps;
	}

	// Find the closest snap guides for both axes
	function getGuides(
		lineGuideStops: { vertical: number[]; horizontal: number[] },
		itemBounds: { vertical: SnapEdge[]; horizontal: SnapEdge[] }
	): SnapGuide[] {
		const resultV = findAxisSnaps(lineGuideStops.vertical, itemBounds.vertical);
		const resultH = findAxisSnaps(lineGuideStops.horizontal, itemBounds.horizontal);

		const guides: SnapGuide[] = [];

		// Find closest vertical snap
		const minV = resultV.sort((a, b) => a.diff - b.diff)[0];
		if (minV) {
			guides.push({
				lineGuide: minV.lineGuide,
				offset: minV.offset,
				orientation: 'V',
				snap: minV.snap
			});
		}

		// Find closest horizontal snap
		const minH = resultH.sort((a, b) => a.diff - b.diff)[0];
		if (minH) {
			guides.push({
				lineGuide: minH.lineGuide,
				offset: minH.offset,
				orientation: 'H',
				snap: minH.snap
			});
		}

		return guides;
	}

	// Helper: Create guide line configuration
	function createGuideLine(guide: SnapGuide): GuideLine {
		return guide.orientation === 'H'
			? { points: [-6000, 0, 6000, 0], x: 0, y: guide.lineGuide, orientation: 'H' }
			: { points: [0, -6000, 0, 6000], x: guide.lineGuide, y: 0, orientation: 'V' };
	}

	// Helper: Calculate snapped position
	function calculateSnappedPosition(
		currentPos: { x: number; y: number },
		guides: SnapGuide[]
	): { x: number; y: number } {
		const snappedPos = { ...currentPos };

		for (const guide of guides) {
			if (guide.orientation === 'V') {
				snappedPos.x = guide.lineGuide + guide.offset;
			} else {
				snappedPos.y = guide.lineGuide + guide.offset;
			}
		}

		return snappedPos;
	}

	// Handle drag move event
	function handleDragMove(id: number, stageWidth: number, stageHeight: number) {
		return (e: any) => {
			guideLines = [];

			const rectIndex = rectangles.findIndex((r) => r.id === id);
			if (rectIndex === -1) return;

			const target = e.target;
			const absPos = target.absolutePosition();
			const currentRect = { ...rectangles[rectIndex], x: absPos.x, y: absPos.y };

			const lineGuideStops = getLineGuideStops(id, stageWidth, stageHeight);
			const itemBounds = getObjectSnappingEdges(currentRect);
			const guides = getGuides(lineGuideStops, itemBounds);

			if (!guides.length) return;

			guideLines = guides.map(createGuideLine);
			const snappedPos = calculateSnappedPosition(absPos, guides);
			target.absolutePosition(snappedPos);
		};
	}

	// Clear guide lines on drag end
	function handleDragEnd() {
		guideLines = [];
	}
</script>

<ResponsiveStage
	title="Snap to Grid Demo"
	description="Drag the rectangles to see snapping guides. They will snap to stage borders, center, and edges of other shapes."
>
	{#snippet children({ stageWidth, stageHeight })}
		<Layer>
			{#each rectangles as rect (rect.id)}
				<Rect
					bind:x={rect.x}
					bind:y={rect.y}
					width={rect.width}
					height={rect.height}
					fill={rect.fill}
					rotation={rect.rotation}
					draggable
					ondragmove={handleDragMove(rect.id, stageWidth, stageHeight)}
					ondragend={handleDragEnd}
					onmouseenter={dragCursor.grab}
					onmouseleave={dragCursor.default}
					onmousedown={dragCursor.grabbing}
					onmouseup={dragCursor.grab}
				/>
			{/each}

			{#each guideLines as line (line.orientation + line.x + line.y)}
				<Line
					points={line.points}
					x={line.x}
					y={line.y}
					stroke="rgb(0, 161, 255)"
					strokeWidth={1}
					dash={[4, 6]}
				/>
			{/each}
		</Layer>
	{/snippet}
</ResponsiveStage>
