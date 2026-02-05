import type Konva from 'konva';

/**
 * Cursor utilities for drag interactions
 */
export const dragCursor = {
	grab: () => (document.body.style.cursor = 'grab'),
	grabbing: () => (document.body.style.cursor = 'grabbing'),
	default: () => (document.body.style.cursor = 'default')
};

/**
 * Creates a drag boundary function that constrains an object within the canvas bounds
 * Only works for non-rotated objects, use createRotatedDragBound for rotated objects
 */
export function createDragBound(
	width: number,
	height: number,
	objectWidth: number,
	objectHeight: number
) {
	return (pos: { x: number; y: number }) => ({
		x: Math.max(0, Math.min(pos.x, width - objectWidth)),
		y: Math.max(0, Math.min(pos.y, height - objectHeight))
	});
}

/**
 * Creates a drag boundary function that constrains a rotated object within the canvas bounds
 * This accounts for the object's rotation by calculating its bounding box
 */
export function createRotatedDragBound(
	width: number,
	height: number,
	objectWidth: number,
	objectHeight: number,
	rotation: number
) {
	return (pos: { x: number; y: number }) => {
		// Calculate bounding box for the rotated shape
		const rad = (rotation * Math.PI) / 180;
		const cos = Math.cos(rad);
		const sin = Math.sin(rad);

		// Calculate all four corners after rotation
		const corners = [
			{ x: pos.x, y: pos.y },
			{ x: pos.x + objectWidth * cos, y: pos.y + objectWidth * sin },
			{
				x: pos.x + objectWidth * cos - objectHeight * sin,
				y: pos.y + objectWidth * sin + objectHeight * cos
			},
			{ x: pos.x - objectHeight * sin, y: pos.y + objectHeight * cos }
		];

		const xs = corners.map((c) => c.x);
		const ys = corners.map((c) => c.y);

		const box = {
			x: Math.min(...xs),
			y: Math.min(...ys),
			width: Math.max(...xs) - Math.min(...xs),
			height: Math.max(...ys) - Math.min(...ys)
		};

		// Constrain the position so the bounding box stays within stage bounds
		let newX = pos.x;
		let newY = pos.y;

		// If left edge goes past 0, shift right
		if (box.x < 0) {
			newX = pos.x - box.x;
		}
		// If right edge goes past stage width, shift left
		if (box.x + box.width > width) {
			newX = pos.x - (box.x + box.width - width);
		}

		// If top edge goes past 0, shift down
		if (box.y < 0) {
			newY = pos.y - box.y;
		}
		// If bottom edge goes past stage height, shift up
		if (box.y + box.height > height) {
			newY = pos.y - (box.y + box.height - height);
		}

		return { x: newX, y: newY };
	};
}

// Calculate real pointer position on canvas taking scale and stage position into account
// This is required if you scale or reposition your stage x/y coordinates
export function getRealPointerPos(pos: Konva.Vector2d, stage: Konva.Stage) {
	const realPos = {
		x: 0,
		y: 0
	};

	const stageScale = stage.scaleX(); // Only care about x scale as y is always the same

	realPos.x = pos.x / stageScale - stage.x() / stageScale;
	realPos.y = pos.y / stageScale - stage.y() / stageScale;

	return realPos;
}
