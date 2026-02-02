<script lang="ts">
	import { Stage } from 'svelte-konva';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet<[{ width: number; height: number }]>;
		title?: string;
		description?: string;
	}

	let { children, title, description }: Props = $props();

	let width = $state(0);
	let height = $state(0);

	let canvasContainer: HTMLDivElement;

	$effect(() => {
		if (canvasContainer) {
			const updateDimensions = () => {
				const rect = canvasContainer.getBoundingClientRect();
				width = rect.width;
				height = rect.height;
			};

			updateDimensions();
			window.addEventListener('resize', updateDimensions);

			return () => {
				window.removeEventListener('resize', updateDimensions);
			};
		}
	});
</script>

<div class="flex h-full w-full flex-col overflow-hidden">
	{#if title || description}
		<div class="shrink-0 p-8">
			{#if title}
				<h1 class="mb-4 text-3xl font-bold">{title}</h1>
			{/if}
			{#if description}
				<p class="text-gray-600">{description}</p>
			{/if}
		</div>
	{/if}
	<div
		bind:this={canvasContainer}
		class="mx-8 mb-8 min-h-0 flex-1 border-2 border-dashed border-gray-400"
	>
		<Stage {width} {height}>
			{@render children({ width, height })}
		</Stage>
	</div>
</div>
