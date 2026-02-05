<script lang="ts">
	import Icon from '@iconify/svelte';

	let currentCategory = $state('Furniture');

	function handleDragStart(e: DragEvent, imageUrl: string) {
		if (e.dataTransfer) {
			e.dataTransfer.setData('imageUrl', imageUrl);
		}
	}
</script>

{#snippet menuCategory(icon: string, title: string)}
	<button
		class="flex h-16 w-full cursor-pointer flex-col items-center justify-center transition-colors hover:bg-indigo-100
                {currentCategory === title ? 'bg-indigo-100' : ''}"
		onclick={() => (currentCategory = title)}
	>
		<Icon {icon} width="24" height="24" />
		<span class="text-[8px]">{title}</span>
	</button>
{/snippet}

{#snippet menuContent()}
	{#snippet canvasItem(imageSrc: string)}
		<div
			class="flex h-16 w-full cursor-pointer items-center justify-center rounded bg-gray-200 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-300"
		>
			<img
				class="h-12"
				src={imageSrc}
				draggable="true"
				alt=""
				ondragstart={(e) => handleDragStart(e, imageSrc)}
			/>
		</div>
	{/snippet}

	<div class="grid grid-cols-2 gap-2">
		{@render canvasItem('https://konvajs.org/assets/yoda.jpg')}
		{@render canvasItem('https://konvajs.org/assets/darth-vader.jpg')}
	</div>
{/snippet}

<div class="flex h-full border-r border-gray-300 bg-white">
	<!-- Sidebar Categories -->
	<div class="flex h-full w-16 flex-col border-r border-gray-300">
		{@render menuCategory('material-symbols:chair-alt', 'Furniture')}
		{@render menuCategory('material-symbols:speed-camera', 'Equipment')}
		{@render menuCategory('material-symbols:photo', 'Background')}
	</div>

	<!-- Sidebar Content -->
	{#if currentCategory}
		<div class="w-64 space-y-2 p-4">
			<div class="flex items-center justify-between">
				<p class="text-lg font-semibold">{currentCategory}</p>
				<button
					class="cursor-pointer rounded p-1 text-gray-800 transition-colors hover:bg-indigo-100"
					onclick={() => (currentCategory = '')}
				>
					<Icon icon="material-symbols:arrow-left-alt-rounded" width="24" height="24" />
				</button>
			</div>
			{@render menuContent()}
		</div>
	{/if}
</div>
