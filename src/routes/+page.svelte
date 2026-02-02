<script lang="ts">
	const demos = [
		{
			path: '/drag',
			title: 'Drag & Drop',
			description: 'Basic drag and drop functionality with boundary constraints',
			color: 'bg-blue-500'
		},
		{
			path: '/sidebar',
			title: 'Sidebar',
			description: 'Canvas with sidebar controls and object management',
			color: 'bg-green-500'
		},
		{
			path: '/snap',
			title: 'Snap to Grid',
			description: 'Objects that snap to grid for precise placement',
			color: 'bg-purple-500'
		},
		{
			path: '/context',
			title: 'Context Menu',
			description: 'Right-click context menu for object manipulation',
			color: 'bg-red-500'
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
						<div
							class="{demo.color} mb-4 h-16 w-16 rounded-lg transition-transform group-hover:scale-110"
						></div>
						<h2 class="mb-2 text-2xl font-bold text-gray-800">{demo.title}</h2>
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
