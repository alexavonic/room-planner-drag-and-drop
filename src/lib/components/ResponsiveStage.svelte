<script lang="ts">
	import { Stage, type KonvaEventHooks } from 'svelte-konva';
	import { onMount, onDestroy, type Snippet } from 'svelte';

	type Props = {
		children: Snippet<[{ stageWidth: number; stageHeight: number }]>;
		overlay?: Snippet;
		title?: string;
		description?: string;
		stage?: ReturnType<typeof Stage> | undefined;
		oncanvasdown?: (e: MouseEvent) => void;
		onkeydown?: (e: KeyboardEvent) => void;
	} & KonvaEventHooks;

	let {
		children,
		overlay,
		title,
		description,
		oncanvasdown,
		onkeydown,
		stage = $bindable(),
		onpointerdblclick,
		onpointerdown,
		onpointerup,
		onpointermove,
		onmouseout,
		onmousedown,
		ontouchstart
	}: Props = $props();

	let stageWidth = $state(0);
	let stageHeight = $state(0);

	let canvasContainer: HTMLDivElement;

	function updateStageSize() {
		if (!canvasContainer) return;

		const rect = canvasContainer.getBoundingClientRect();
		stageWidth = rect.width;
		stageHeight = rect.height;
	}

	onMount(() => {
		window.addEventListener('resize', updateStageSize);
		updateStageSize();
	});

	onDestroy(() => {
		window.removeEventListener('resize', updateStageSize);
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
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
	<div
		bind:this={canvasContainer}
		onmousedown={(e) => {
			canvasContainer.focus();
			oncanvasdown?.(e);
		}}
		{onkeydown}
		tabindex="0"
		class="relative mx-8 mb-8 min-h-0 flex-1 border-2 border-dashed border-gray-400 bg-white"
	>
		<Stage
			width={stageWidth}
			height={stageHeight}
			bind:this={stage}
			{onpointerdblclick}
			{onpointerdown}
			{onpointerup}
			{onpointermove}
			{onmouseout}
			{onmousedown}
			{ontouchstart}
		>
			{@render children({ stageWidth, stageHeight })}
		</Stage>

		<!-- Overlay content (e.g., popup dialogs) -->
		{#if overlay}
			{@render overlay()}
		{/if}
	</div>
</div>
