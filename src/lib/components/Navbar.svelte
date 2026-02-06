<script lang="ts">
	import { page } from '$app/state';

	const navItems = [
		{ path: '/', label: 'Home' },
		{ path: '/drag', label: 'Drag' },
		{ path: '/dialog', label: 'Dialog' },
		{ path: '/snap', label: 'Snap' },
		{ path: '/sidebar', label: 'Sidebar' },
		{ path: '/zoom', label: 'Zoom & Pan' },
		{ path: '/room', label: 'Room Planner' }
	];
</script>

<nav class="bg-gray-800 text-white shadow-lg">
	<div class="flex h-16 items-center justify-between px-8">
		<div class="flex items-center space-x-1">
			<span class="text-xl font-bold">Room Planner</span>
		</div>
		<div class="flex space-x-1">
			{#each navItems as item}
				<a
					href={item.path}
					class="rounded-md px-4 py-2 text-sm font-medium transition-colors
							{page.url.pathname === item.path
						? 'bg-gray-900 text-white'
						: 'text-gray-300 hover:bg-gray-700 hover:text-white'}"
				>
					{item.label}
				</a>
			{/each}
		</div>
	</div>
</nav>
