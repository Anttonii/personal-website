<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, slide } from 'svelte/transition';

	let expanderIcon: HTMLElement;
	let prediction: string;

	// the html element representing our canvas
	let canvas: HTMLCanvasElement;
	let canvasContext: CanvasRenderingContext2D;
	let isDrawing = false;

	// represents the hex values of the drawn cells
	let gridValues: number[][] = new Array(28).fill(0).map(() => new Array(28).fill(0));

	// box size refers to size of a single pixel in the grid thus a box takes boxSize ** 2 space in pixels
	const gridSize: number = 28;
	const boxSize: number = 16;

	const canvasWidth: number = gridSize * boxSize;
	const canvasHeight: number = gridSize * boxSize;

	const black: string = '#000000';
	const white: string = '#FFFFFF';
	const grey: string = '#5A5A5A';

	let instructionsExpanded = false;

	onMount(() => {
		canvasContext = canvas.getContext('2d')!;
	});

	const getPosition = (event: MouseEvent) => {
		let mouseX = event.clientX - canvas.getBoundingClientRect().x;
		let mouseY = event.clientY - canvas.getBoundingClientRect().y;
		return [mouseX, mouseY];
	};

	const getPositionOnGrid = (event: MouseEvent) => {
		let [mouseX, mouseY] = getPosition(event);
		return [Math.floor(mouseX / 16), Math.floor(mouseY / 16)];
	};

	const inBoundCells = (position: [number, number]) => {
		let numbers: number[][] = [];
		if (position[0] > 0) {
			numbers.push([position[0] - 1, position[1]]);
		}
		if (position[0] < gridSize - 1) {
			numbers.push([position[0] + 1, position[1]]);
		}
		if (position[1] > 0) {
			numbers.push([position[0], position[1] - 1]);
		}
		if (position[1] < gridSize - 1) {
			numbers.push([position[0], position[1] + 1]);
		}
		return numbers;
	};

	const drawCell = (position: [number, number]) => {
		canvasContext.fillStyle = white;
		canvasContext.fillRect(position[0] * boxSize, position[1] * boxSize, boxSize, boxSize);
		gridValues[position[1]][position[0]] = 255;

		let inBound = inBoundCells(position);
		inBound.forEach((element) => {
			if (gridValues[element[1]][element[0]] == 0) {
				canvasContext.fillStyle = grey;
				canvasContext.fillRect(element[0] * boxSize, element[1] * boxSize, boxSize, boxSize);
				gridValues[element[1]][element[0]] = 127;
			}
		});
	};

	const handleStart = (event: MouseEvent) => {
		isDrawing = true;

		let [gridX, gridY] = getPositionOnGrid(event);
		drawCell([gridX, gridY]);
	};

	const handleEnd = () => {
		isDrawing = false;
	};

	const handleMove = (event: MouseEvent) => {
		if (!isDrawing) return;

		let [gridX, gridY] = getPositionOnGrid(event);
		drawCell([gridX, gridY]);
	};

	const clearGrid = () => {
		for (var i = 0; i < gridSize; i++) {
			for (var j = 0; j < gridSize; j++) {
				gridValues[i][j] = 0;
			}
		}
		canvasContext.fillStyle = black;
		canvasContext.fillRect(0, 0, canvasWidth, canvasHeight);
	};

	const toggleInstructions = () => {
		instructionsExpanded = !instructionsExpanded;
		if (!instructionsExpanded) {
			expanderIcon.style.transform = 'rotate(180deg)';
		} else {
			expanderIcon.style.transform = 'rotate(0deg)';
		}
	};

	const postGrid = async () => {
		// Post the request to backend
		const res = await fetch('http://46.101.113.170:3000/neural', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				gridValues
			})
		});

		// Get the prediction result
		const json = await res.json();
		const result = JSON.stringify(json);
		prediction = result;
	};
</script>

<div class="container mx-auto flex flex-col justify-center items-center gap-16">
	<div
		class="flex flex-col justify-center align-middle h-full gap-16"
		transition:fade={{ duration: 1000 }}
	>
		<h2 class="font-bold text-5xl text-center tracking-wider text-white">
			<a href="/">Anttoni Koivu</a>
		</h2>
		<h3 class="font-bold text-xl text-center tracking-wider text-white">Neural Network!</h3>
		<div class="expander flex flex-col">
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div
				class="border border-white rounded text-white flex flex-row justify-between py-2 px-4"
				on:click={toggleInstructions}
			>
				<h4 class="text-l">Instructions</h4>
				<img
					src="/images/triangle-32.png"
					class="expander-icon inline-flex align-baseline ml-2"
					width="16"
					alt="expander triangle"
					bind:this={expanderIcon}
				/>
			</div>
			{#if instructionsExpanded}
				<div class="expanded text-white pt-4 px-4" transition:slide={{ duration: 1000 }}>
					<p class="text-sm">
						Start by drawing an image of any number between 0 and 9. Press guess to see if the
						neural network is correct at predicting what number you've drawn. If you want to start
						over the drawing process, just press clear to clear the canvas.<br /><br />

						Happy experimenting!
					</p>
				</div>
			{/if}
		</div>

		<div class="flex flex-col justify-center gap-4">
			<canvas
				class="canvas"
				width={canvasWidth}
				height={canvasHeight}
				bind:this={canvas}
				on:mousedown={handleStart}
				on:mouseup={handleEnd}
				on:mousemove={handleMove}
			/>
			<div class="flex flex-row justify-center gap-4">
				<button
					class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
					on:click={postGrid}
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
		{#if prediction}
			<div class="flex flex-col justify-center gap-4 text-white">
				<h2>The neural network predicted that you drew: {prediction}</h2>
				<h3>Did it get it right? :)</h3>
			</div>
		{/if}
	</div>
</div>

<style>
	.canvas {
		display: flex;
		width: 448px;
		height: 448px;
		border: 1px solid white;
		align-self: center;
	}

	.expander {
		width: 700px;
	}

	.expander-icon {
		justify-self: right;
		transform: rotate(180deg);
		transition: all 1s;
	}
</style>
