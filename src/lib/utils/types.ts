export const ShapeType = {
	Rect: 'rect',
	Circle: 'circle',
	Arrow: 'arrow',
	Wedge: 'wedge',
	Image: 'image'
} as const;

export type ShapeType = (typeof ShapeType)[keyof typeof ShapeType];

export type CanvasImage = {
	id: string;
	src: string;
	x: number;
	y: number;
	width: number;
	height: number;
	image?: HTMLImageElement;
};

export type CanvasRectangle = {
	id: string;
	x: number;
	y: number;
	width: number;
	height: number;
	fill: string;
	rotation: number;
};

export type CanvasCircle = {
	id: string;
	x: number;
	y: number;
	radius: number;
	fill: string;
	rotation: number;
};

export type CanvasArrow = {
	id: string;
	points: number[];
	fill: string;
	stroke: string;
	strokeWidth: number;
	rotation: number;
};

export type CanvasWedge = {
	id: string;
	x: number;
	y: number;
	radius: number;
	angle: number;
	fill: string;
	rotation: number;
};
