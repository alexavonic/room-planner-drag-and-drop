<script lang="ts">
	import { Layer, Rect, Image } from 'svelte-konva';
	import ResponsiveStage from '$lib/components/ResponsiveStage.svelte';
	import SideBar from '$lib/components/SideBar.svelte';
	import { createDragBound, dragCursor } from '$lib/utils/konva';

	type CanvasImage = {
		id: string;
		src: string;
		x: number;
		y: number;
		width: number;
		height: number;
		image?: HTMLImageElement;
	};

	let images = $state<CanvasImage[]>([]);

	function handleDrop(e: DragEvent) {
		e.preventDefault();

		const imageUrl = e.dataTransfer?.getData('imageUrl');
		if (!imageUrl) return;

		const stage = e.currentTarget as HTMLElement;
		const rect = stage.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		// Load image and add to canvas
		const img = new window.Image();
		img.src = imageUrl;
		img.crossOrigin = 'Anonymous';
		img.onload = () => {
			images.push({
				id: crypto.randomUUID(),
				src: imageUrl,
				x: x - img.width / 2,
				y: y - img.height / 2,
				width: img.width,
				height: img.height,
				image: img
			});
		};
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
		{#snippet children({ stageWidth, stageHeight })}
			<Layer>
				{#each images as img (img.id)}
					<Image image={img.image} x={img.x} y={img.y} draggable={true} />
				{/each}
			</Layer>
		{/snippet}
	</ResponsiveStage>
</div>
