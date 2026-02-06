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

	import BGAbstract from '$lib/assets/bg-abstract.jpg';
	import BGOffice1 from '$lib/assets/bg-office1.jpg';
	import BGOffice2 from '$lib/assets/bg-office2.jpg';
	import BGOffice3 from '$lib/assets/bg-office3.jpg';
	import BGOffice4 from '$lib/assets/bg-office4.png';

	import { ShapeType } from '$lib/utils/types';

	type Props = {
		onCanvasShapeClick?: (
			e: MouseEvent,
			shapeType: ShapeType,
			imageSrc?: string,
			gradient?: string
		) => void;
	};

	let { onCanvasShapeClick }: Props = $props();

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
					<p class="col-span-2 mt-2 text-sm text-slate-600">Pictures</p>
					{@render backgroundItem()}
					{@render backgroundItem(BGAbstract)}
					{@render backgroundItem(BGOffice1)}
					{@render backgroundItem(BGOffice2)}
					{@render backgroundItem(BGOffice3)}
					{@render backgroundItem(BGOffice4)}

					<p class="col-span-2 mt-8 text-sm text-slate-600">Gradients</p>
					{@render backgroundItem(undefined, 'linear-gradient(to right, #e2e8f0, #94a3b8)')}
					{@render backgroundItem(
						undefined,
						'linear-gradient(0deg,rgba(128, 215, 217, 1) 0%, rgba(255, 255, 255, 1) 100%)'
					)}
					{@render backgroundItem(
						undefined,
						'linear-gradient(89deg,rgba(76, 144, 207, 1) 0%, rgba(255, 255, 255, 1) 100%)'
					)}
					{@render backgroundItem(
						undefined,
						'linear-gradient(45deg, #4159d0 0.000%, #c84fc0 50.000%, #ffcd70 100.000%)'
					)}
					{@render backgroundItem(
						undefined,
						'linear-gradient(0deg,rgba(34, 193, 195, 1) 0%, rgba(253, 187, 45, 1) 100%)'
					)}
					{@render backgroundItem(
						undefined,
						'radial-gradient(circle,rgba(63, 94, 251, 1) 0%, rgba(252, 70, 107, 1) 100%)'
					)}
					{@render backgroundItem(
						undefined,
						'conic-gradient(from 45deg, #0a4a59 0.000deg, #0a4a59 27.692deg, #0b527c calc(27.692deg + 0.1deg), #0b527c 55.385deg, #0d5c9f calc(55.385deg + 0.1deg), #0d5c9f 83.077deg, #1068c2 calc(83.077deg + 0.1deg), #1068c2 110.769deg, #1276e3 calc(110.769deg + 0.1deg), #1276e3 138.462deg, #1585ff calc(138.462deg + 0.1deg), #1585ff 166.154deg, #1896ff calc(166.154deg + 0.1deg), #1896ff 193.846deg, #1ca9ff calc(193.846deg + 0.1deg), #1ca9ff 221.538deg, #1fbcff calc(221.538deg + 0.1deg), #1fbcff 249.231deg, #23d1ff calc(249.231deg + 0.1deg), #23d1ff 276.923deg, #27e6ff calc(276.923deg + 0.1deg), #27e6ff 304.615deg, #2bfbff calc(304.615deg + 0.1deg), #2bfbff 332.308deg, #2fffff calc(332.308deg + 0.1deg) 360.000deg)'
					)}
					{@render backgroundItem(
						undefined,
						'conic-gradient(from 210deg, #c5bbb8 0.000deg, #c5bbb8 24.000deg, #b8b5b8 calc(24.000deg + 0.1deg), #b8b5b8 48.000deg, #a9afb7 calc(48.000deg + 0.1deg), #a9afb7 72.000deg, #9aa8b5 calc(72.000deg + 0.1deg), #9aa8b5 96.000deg, #8ba1b3 calc(96.000deg + 0.1deg), #8ba1b3 120.000deg, #7d98af calc(120.000deg + 0.1deg), #7d98af 144.000deg, #7090ab calc(144.000deg + 0.1deg), #7090ab 168.000deg, #6587a6 calc(168.000deg + 0.1deg), #6587a6 192.000deg, #5c7ea1 calc(192.000deg + 0.1deg), #5c7ea1 216.000deg, #55759b calc(216.000deg + 0.1deg), #55759b 240.000deg, #516c94 calc(240.000deg + 0.1deg), #516c94 264.000deg, #4f638d calc(264.000deg + 0.1deg), #4f638d 288.000deg, #505a85 calc(288.000deg + 0.1deg), #505a85 312.000deg, #54537d calc(312.000deg + 0.1deg), #54537d 336.000deg, #5b4b74 calc(336.000deg + 0.1deg) 360.000deg)'
					)}
					{@render backgroundItem(
						undefined,
						'linear-gradient(90deg,rgba(155, 42, 149, 1) 0%, rgba(87, 152, 199, 1) 50%, rgba(83, 237, 163, 1) 100%)'
					)}
					{@render backgroundItem(
						undefined,
						'linear-gradient(90deg,rgba(2, 0, 36, 1) 0%, rgba(9, 9, 121, 1) 35%, rgba(171, 0, 0, 1) 100%)'
					)}
					{@render backgroundItem(
						undefined,
						'linear-gradient(139deg,rgba(99, 206, 230, 1) 0%, rgba(255, 255, 255, 1) 50%, rgba(113, 245, 203, 1) 100%)'
					)}
					{@render backgroundItem(
						undefined,
						'radial-gradient(circle,rgba(255, 255, 255, 1) 0%, rgba(184, 224, 255, 1) 50%, rgba(182, 168, 255, 1) 100%)'
					)}
				{/if}
			</div>
		</div>
	{/if}
</div>

<!-- Snippet Definitions -->

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
	<div class="flex h-16 w-full rounded bg-slate-200 transition-colors hover:bg-gray-300">
		<button
			class="flex h-full w-full cursor-pointer items-center justify-center"
			draggable="true"
			ondragstart={(e) => handleDragStart(e, ShapeType.Image, imageSrc)}
			onclick={(e) => onCanvasShapeClick?.(e, ShapeType.Image, imageSrc)}
			title="Add Image"
		>
			<img class="h-12 object-cover" src={imageSrc} alt="" />
		</button>
	</div>
{/snippet}

{#snippet shapeItem(shapeType: ShapeType)}
	<div class="flex h-16 w-full rounded bg-slate-200 transition-colors hover:bg-gray-300">
		<button
			class="flex h-full w-full cursor-pointer items-center justify-center"
			draggable="true"
			ondragstart={(e) => handleDragStart(e, shapeType)}
			onclick={(e) => onCanvasShapeClick?.(e, shapeType)}
		>
			{#if shapeType === ShapeType.Rect}
				<div class="h-12 w-16 rounded bg-indigo-400"></div>
			{:else if shapeType === ShapeType.Circle}
				<div class="h-12 w-12 rounded-full bg-red-400"></div>
			{:else if shapeType === ShapeType.Arrow}
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
			{:else if shapeType === ShapeType.Wedge}
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
			{/if}
		</button>
	</div>
{/snippet}

{#snippet backgroundItem(imageSrc?: string, gradient?: string)}
	<button
		class="flex h-16 w-full cursor-pointer items-center justify-center rounded border-gray-400 bg-slate-200 text-sm font-medium text-gray-800 transition-colors hover:border hover:bg-gray-300"
		style={gradient ? `background-image: ${gradient}` : ''}
		onclick={(e) => onCanvasShapeClick?.(e, ShapeType.Background, imageSrc, gradient)}
	>
		{#if imageSrc}
			<img class="h-16 object-contain" loading="lazy" width="100" src={imageSrc} alt="" />
		{:else if !gradient}
			None
		{/if}
	</button>
{/snippet}
