<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import { slide, fade } from 'svelte/transition';

	import { SyncLoader } from 'svelte-loading-spinners';

	let loaded = false;

	let isDrawing = false;
	// represents html elements that change color when drawn to.
	let grid: HTMLElement[][] = new Array(28).fill(null).map(() => new Array(28).fill(null));
	// represents the hex values of the drawn cells
	let gridValues: number[][] = new Array(28).fill(0).map(() => new Array(28).fill(0));
	// the html element representing our canvas
	let canvas: HTMLElement;

	// box size refers to size of a single pixel in the grid thus a box takes boxSize ** 2 space in pixels
	const gridSize: number = 28;

	const black: string = '#000000';
	const white: string = '#FFFFFF';

	let mouseX = 0;
	let mouseY = 0;

	let currentlyDrawn: [number, number][] = [];

	afterUpdate(() => {
		loaded = true;
	});

	onMount(() => {});

	const handleStart = () => {
		if (!canvas) {
			console.log('Failure to load canvas!');
			return;
		}

		isDrawing = true;
	};

	const handleEnd = () => {
		if (!canvas) {
			console.log('Failure to load canvas!');
			return;
		}

		isDrawing = false;
		currentlyDrawn = [];
	};

	const handleMove = (event: MouseEvent) => {
		if (!canvas) {
			console.log('Failure to load canvas!');
			return;
		}

		mouseX = event.pageX - canvas.getBoundingClientRect().x;
		mouseY = event.pageY - canvas.getBoundingClientRect().y;

		if (!isDrawing) return;

		let gridX = Math.floor(mouseX / 16);
		let gridY = Math.floor(mouseY / 16);

		if (!currentlyDrawn.includes([gridX, gridY])) {
			grid[gridX][gridY].style.background = white;
			gridValues[gridX][gridY] = 1;
			currentlyDrawn.push([gridX, gridY]);
		}
	};

	const clearGrid = () => {
		for (var i = 0; i < 28; i++) {
			for (var j = 0; j < 28; j++) {
				grid[i][j].style.background = black;
				gridValues[i][j] = 0;
			}
		}
	};
</script>

<div class="container mx-auto flex flex-col justify-center items-center gap-16">
	{#if !loaded}
		<div class="flex flex-col justify-center align-middle h-full items-center">
			<h2 class="text-xl text-white">Loading</h2>
			<SyncLoader size="60" color="#FFFFFF" unit="px" />
		</div>
	{:else}
		<div
			class="flex flex-col justify-center align-middle h-full gap-16"
			transition:fade={{ duration: 1000 }}
		>
			<h2 class="font-bold text-5xl text-center tracking-wider text-white">
				<a href="/">Anttoni Koivu</a>
			</h2>
			<h3 class="font-bold text-xl text-center tracking-wider text-white">Neural Network!</h3>
			<div class="flex flex-col justify-center gap-4">
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div
					class="canvas-grid flex flex-row"
					bind:this={canvas}
					on:mousemove={handleMove}
					on:mousedown={handleStart}
					on:mouseup={handleEnd}
				>
					{#each { length: gridSize } as _, i}
						<div class="row-{i}">
							{#each { length: gridSize } as _, j}
								<div id="column-{i}-{j}" bind:this={grid[i][j]} class="gridElem"></div>
							{/each}
						</div>
					{/each}
				</div>
				<div class="flex flex-row justify-center gap-4">
					<button
						class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
					>
						Guess
					</button>
					<button
						class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
						on:click={clearGrid}
					>
						Clear
					</button>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.canvas-grid {
		width: calc(448px + padding);
		height: calc(448px + padding);
		border: solid 1px;
		border-color: white;
		padding: 4px;
		align-self: center;
	}

	.gridElem {
		width: 16px;
		height: 16px;
	}
</style>
