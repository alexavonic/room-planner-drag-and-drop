<script lang="ts">
	import Icon from '@iconify/svelte';

	import chairOutline from '$lib/assets/chair-outline.png';
	import ChairOutlineFilled from '$lib/assets/chair-outline-filled.png';
	import ChairWithPerson from '$lib/assets/chair-with-person.png';
	import ChairWithPersonFilled from '$lib/assets/chair-with-person-filled.png';

	import AvonicCM93 from '$lib/assets/Avonic_CM93_Top.png';
	import AudioTechnicaATND1060 from '$lib/assets/Audio-Technica_ATND_1060.png';
	import SennheiserTCC2 from '$lib/assets/Sennheiser_TCC2.png';
	import SennheiserTCCM from '$lib/assets/Sennheiser_TCCM.png';
	import ShureMX920 from '$lib/assets/Shure_MX920.png';
	import UnbrandedMicRound from '$lib/assets/Unbranded_Round.png';
	import UnbrandedMicSquare from '$lib/assets/Unbranded_Square.png';
	import YamahaRMCG from '$lib/assets/Yamaha_RM-CG.png';

	import { ShapeType } from '$lib/utils/types';

	const Category = {
		Furniture: 'Furniture',
		Equipment: 'Equipment',
		Background: 'Background',
		None: 'None'
	} as const;

	type Category = (typeof Category)[keyof typeof Category];

	let currentCategory = $state<Category>(Category.Furniture);

	function handleDragStart(e: DragEvent, shapeType: ShapeType, imageSrc?: string) {
		if (e.dataTransfer) {
			e.dataTransfer.setData('shapeType', shapeType);
			e.dataTransfer.setData('imageSrc', imageSrc || '');
			e.dataTransfer.effectAllowed = 'copy';
		}
	}
</script>

<div class="flex h-full border-r border-gray-300 bg-white">
	<!-- Sidebar Categories -->
	<div class="flex h-full w-16 flex-col border-r border-gray-300">
		{@render menuCategory('material-symbols:chair-alt', Category.Furniture)}
		{@render menuCategory('material-symbols:speed-camera', Category.Equipment)}
		{@render menuCategory('material-symbols:photo', Category.Background)}
	</div>

	<!-- Sidebar Content -->
	{#if currentCategory !== Category.None}
		<div class="w-64 space-y-2 p-4">
			<div class="flex items-center justify-between">
				<p class="text-lg font-semibold">{currentCategory}</p>
				<button
					class="cursor-pointer rounded p-1 text-gray-800 transition-colors hover:bg-indigo-100"
					onclick={() => (currentCategory = Category.None)}
				>
					<Icon icon="material-symbols:arrow-left-alt-rounded" width="24" height="24" />
				</button>
			</div>
			<div class="grid grid-cols-2 gap-2">
				{#if currentCategory === Category.Furniture}
					<p class="col-span-2 mt-2 text-sm text-slate-600">Basic shapes</p>
					{@render shapeItem(ShapeType.Rect)}
					{@render shapeItem(ShapeType.Circle)}
					{@render shapeItem(ShapeType.Arrow)}
					{@render shapeItem(ShapeType.Wedge)}

					<p class="col-span-2 mt-8 text-sm text-slate-600">Png renders</p>
					{@render imageItem(chairOutline)}
					{@render imageItem(ChairOutlineFilled)}
					{@render imageItem(ChairWithPerson)}
					{@render imageItem(ChairWithPersonFilled)}

					<p class="col-span-2 mt-8 text-sm text-slate-600">???</p>
					{@render imageItem('https://konvajs.org/assets/yoda.jpg')}
					{@render imageItem('https://konvajs.org/assets/darth-vader.jpg')}
				{:else if currentCategory === Category.Equipment}
					<p class="col-span-2 mt-2 text-sm text-slate-600">Cameras</p>
					{@render imageItem(AvonicCM93)}

					<p class="col-span-2 mt-8 text-sm text-slate-600">Microphones</p>
					{@render imageItem(AudioTechnicaATND1060)}
					{@render imageItem(SennheiserTCC2)}
					{@render imageItem(SennheiserTCCM)}
					{@render imageItem(ShureMX920)}
					{@render imageItem(YamahaRMCG)}
					{@render imageItem(UnbrandedMicRound)}
					{@render imageItem(UnbrandedMicSquare)}
				{:else if currentCategory === Category.Background}
					C
				{/if}
			</div>
		</div>
	{/if}
</div>

{#snippet menuCategory(icon: string, title: Category)}
	<button
		class="flex h-16 w-full cursor-pointer flex-col items-center justify-center transition-colors hover:bg-indigo-100
                {currentCategory === title ? 'bg-indigo-100' : ''}"
		onclick={() => (currentCategory = title)}
	>
		<Icon {icon} width="24" height="24" />
		<span class="text-[8px]">{title}</span>
	</button>
{/snippet}

{#snippet imageItem(imageSrc: string)}
	<div
		class="flex h-16 w-full cursor-pointer items-center justify-center rounded bg-slate-200 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-300"
	>
		<div
			class="flex h-full w-full items-center justify-center"
			draggable="true"
			ondragstart={(e) => handleDragStart(e, ShapeType.Image, imageSrc)}
			role="button"
			tabindex="0"
		>
			<img class="h-12" src={imageSrc} alt="" />
		</div>
	</div>
{/snippet}

{#snippet shapeItem(shapeType: ShapeType)}
	<div
		class="flex h-16 w-full cursor-pointer items-center justify-center rounded bg-slate-200 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-300"
	>
		{#if shapeType === ShapeType.Rect}
			<div
				class="flex h-full w-full items-center justify-center"
				draggable="true"
				ondragstart={(e) => handleDragStart(e, ShapeType.Rect)}
				role="button"
				tabindex="0"
			>
				<div class="h-12 w-16 rounded bg-indigo-400"></div>
			</div>
		{:else if shapeType === ShapeType.Circle}
			<div
				class="flex h-full w-full items-center justify-center"
				draggable="true"
				ondragstart={(e) => handleDragStart(e, ShapeType.Circle)}
				role="button"
				tabindex="0"
			>
				<div class="h-12 w-12 rounded-full bg-red-400"></div>
			</div>
		{:else if shapeType === ShapeType.Arrow}
			<div
				class="flex h-full w-full items-center justify-center"
				draggable="true"
				ondragstart={(e) => handleDragStart(e, ShapeType.Arrow)}
				role="button"
				tabindex="0"
			>
				<svg
					width="48"
					height="48"
					viewBox="0 0 48 48"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M4 24H44M44 24L34 14M44 24L34 34"
						stroke="black"
						stroke-width="4"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</div>
		{:else if shapeType === ShapeType.Wedge}
			<div
				class="flex h-full w-full items-center justify-center"
				draggable="true"
				ondragstart={(e) => handleDragStart(e, ShapeType.Wedge)}
				role="button"
				tabindex="0"
			>
				<svg
					width="48"
					height="48"
					viewBox="0 0 48 48"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M24 24 L24 4 A 20 20 0 0 1 40 16 Z"
						fill="orange"
						stroke="black"
						stroke-width="2"
					/>
				</svg>
			</div>
		{/if}
	</div>
{/snippet}
