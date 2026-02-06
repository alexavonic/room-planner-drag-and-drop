<script lang="ts">
	const demos = [
		{
			path: '/drag',
			title: 'Drag & Drop',
			description: 'Basic drag and drop functionality with boundary constraints',
			color: 'bg-blue-500'
		},
		{
			path: '/dialog',
			title: 'Dialog Window',
			description:
				'Dialog window for editing rectangle properties and managing objects with keyboard shortcuts',
			color: 'bg-red-500'
		},
		{
			path: '/snap',
			title: 'Snap to Objects',
			description: 'Objects that snap to other objects for precise placement',
			color: 'bg-purple-500'
		},
		{
			path: '/sidebar',
			title: 'Sidebar',
			description: 'Sidebar with drag-and-drop shape/image creation and background setting',
			color: 'bg-green-500'
		},
		{
			path: '/zoom',
			title: 'Zoom & Pan',
			description: 'Zoom and pan functionality for navigating the canvas',
			color: 'bg-yellow-500'
		},
		{
			path: '/room',
			title: 'Room Planner',
			description: 'Combination of all features to create a room planner application',
			color: 'bg-pink-500'
		}
	];
</script>

<div class="h-full w-full bg-linear-to-br from-gray-50 to-indigo-100">
	<div class="container mx-auto px-4 py-16">
		<div class="mb-16 text-center">
			<h1 class="mb-4 text-5xl font-bold text-gray-800">Room Planner Demo</h1>
			<p class="text-xl text-gray-600">
				Explore different Konva.js features for building interactive room planners
			</p>
		</div>

		<div class="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
			{#each demos as demo}
				<a
					href={demo.path}
					class="group block transform rounded-lg bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
				>
					<div class="p-8">
						<h2 class="mb-2 text-2xl font-bold text-gray-800">{demo.title}</h2>
						<div
							class="{demo.color} mb-4 h-1.5 w-24 rounded-lg transition-all duration-300 ease-in-out group-hover:h-1 group-hover:w-full"
						></div>
						<p class="text-gray-600">{demo.description}</p>
						<div class="mt-4 flex items-center font-medium text-blue-600">
							<span>View Demo</span>
							<svg
								class="ml-2 h-5 w-5 transition-transform group-hover:translate-x-2"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</div>
</div>
