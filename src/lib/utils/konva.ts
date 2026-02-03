import type Konva from 'konva';

/**
 * Creates a drag boundary function that constrains an object within the canvas bounds
 * @param width - Canvas width
 * @param height - Canvas height
 * @param objectWidth - Width of the draggable object
 * @param objectHeight - Height of the draggable object
 * @returns A boundary function for Konva's dragBoundFunc
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
 * Cursor utilities for drag interactions
 */
export const dragCursor = {
	grab: () => (document.body.style.cursor = 'grab'),
	grabbing: () => (document.body.style.cursor = 'grabbing'),
	default: () => (document.body.style.cursor = 'default')
};

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
