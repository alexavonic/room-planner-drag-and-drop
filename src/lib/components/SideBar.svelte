<script lang="ts">
	import Icon from '@iconify/svelte';

	let currentCategory = $state('Furniture');
</script>

{#snippet menuCategory(icon: string, title: string)}
	<button
		class="flex h-16 w-full cursor-pointer flex-col items-center justify-center hover:bg-indigo-100"
		onclick={() => (currentCategory = title)}
	>
		<Icon {icon} width="24" height="24" />
		<span class="text-[8px]">{title}</span>
	</button>
{/snippet}

<div class="flex h-full w-lg border-r border-gray-300 bg-white">
	<div class="flex h-full w-16 flex-col border-r border-gray-300">
		{@render menuCategory('material-symbols:chair-alt', 'Furniture')}
		{@render menuCategory('material-symbols:speed-camera', 'Equipment')}
		{@render menuCategory('material-symbols:photo', 'Background')}
	</div>
	<div class="p-4">{currentCategory}</div>
</div>
