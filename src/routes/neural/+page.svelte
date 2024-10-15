<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, slide } from 'svelte/transition';

	let expanderIcon: HTMLElement;
	let prediction: string | null;
	let confidence: string | null;

	// the html element representing our canvas
	let canvas: HTMLCanvasElement;
	let canvasContext: CanvasRenderingContext2D;
	let isDrawing = false;

	// represents the hex values of the drawn cells
	let gridValues: number[][] = new Array(28).fill(0).map(() => new Array(28).fill(0));

	// box size refers to size of a single pixel in the grid thus a box takes boxSize ** 2 space in pixels
	const gridSize: number = 28;
	let boxSize: number = 16;

	const canvasWidth: number = gridSize * boxSize;
	const canvasHeight: number = gridSize * boxSize;

	const black: string = '#000000';
	const white: string = '#FFFFFF';
	const grey: string = '#5A5A5A';

	let instructionsExpanded = false;

	onMount(() => {
		canvasContext = canvas.getContext('2d')!;

		// For mobile devices
		let viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
		if (gridSize * boxSize > viewportWidth) {
			boxSize = 12;
			canvasContext.canvas.width = gridSize * boxSize;
			canvasContext.canvas.height = gridSize * boxSize;
		}

		window.addEventListener('resize', resize);
	});

	const resize = () => {
		let viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

		if (viewportWidth <= 460) {
			boxSize = 12;
		} else if (viewportWidth > 460 && boxSize == 12) {
			boxSize = 16;
		} else {
			return;
		}

		canvasContext.canvas.width = gridSize * boxSize;
		canvasContext.canvas.height = gridSize * boxSize;
		clearGrid();
	};

	const getPosition = (event: UIEvent) => {
		let positionX = 0;
		let positionY = 0;

		if (event instanceof MouseEvent) {
			positionX = event.clientX - canvas.getBoundingClientRect().x;
			positionY = event.clientY - canvas.getBoundingClientRect().y;
		} else if (event instanceof TouchEvent) {
			positionX = event.touches[0].clientX - canvas.getBoundingClientRect().x;
			positionY = event.touches[0].clientY - canvas.getBoundingClientRect().y;
		}

		return [positionX, positionY];
	};

	const getPositionOnGrid = (event: UIEvent) => {
		let [positionX, positionY] = getPosition(event);
		return [Math.floor(positionX / boxSize), Math.floor(positionY / boxSize)];
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

	const handleCanvasStart = (event: UIEvent) => {
		isDrawing = true;

		let [gridX, gridY] = getPositionOnGrid(event);

		// When drawing disable moving the screen
		if (event instanceof TouchEvent) {
			event.preventDefault();
		}

		drawCell([gridX, gridY]);
	};

	const handleCanvasEnd = () => {
		isDrawing = false;
	};

	const handleCanvasMove = (event: UIEvent) => {
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

		prediction = null;
		confidence = null;
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
		const res = await fetch('/api/neural', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				gridValues
			})
		});

		// Get the prediction result
		const result = await res.json();
		prediction = result[0];
		confidence = result[1];

		// Transform confidence into a percentage
		confidence = (parseFloat(confidence!) * 100.0).toFixed(1).toString() + '%';

		const resultsElem = document.querySelector('#results');
		if (resultsElem) {
			resultsElem.scrollIntoView({ behavior: 'smooth', inline: 'end' });
		}
	};
</script>

<div class="container mx-auto flex flex-col justify-center items-center text-white">
	<div
		class="flex flex-col align-middle justify-start md:justify-center h-full gap-8"
		transition:fade={{ duration: 1000 }}
	>
		<h2 class="font-bold text-3xl md:text-5xl text-center tracking-wider">
			<a href="/">Anttoni Koivu</a>
		</h2>

		<h3 class="font-bold text-base md:text-xl text-center tracking-wider">Neural Network!</h3>

		<div class="flex flex-col justify-center align-middle">
			<button
				class="expander border border-white rounded flex flex-row justify-between py-2 px-4 m-auto"
				on:click={toggleInstructions}
			>
				<h4 class="text-sm md:text-lg">Instructions</h4>
				<img
					src="/images/triangle-32.png"
					class="expander-icon inline-flex align-baseline ml-2 mt-1"
					width="18"
					height="18"
					alt="expander triangle"
					bind:this={expanderIcon}
				/>
			</button>
			{#if instructionsExpanded}
				<div class="expander pt-4 m-auto" transition:slide={{ duration: 1000 }}>
					<p class="text-sm">
						Start by drawing an image of any number between 0 and 9. Press guess to see if the
						neural network is correct at predicting what number you've drawn. If you want to start
						over the drawing process, just press clear to clear the canvas.<br /><br />
					</p>
					<p class="text-center md:text-left">Happy experimenting!</p>
				</div>
			{/if}
		</div>

		<div class="flex flex-col justify-center gap-4">
			<canvas
				class="canvas"
				width={canvasWidth}
				height={canvasHeight}
				bind:this={canvas}
				on:mousedown={handleCanvasStart}
				on:mouseup={handleCanvasEnd}
				on:mousemove={handleCanvasMove}
				on:touchstart={handleCanvasStart}
				on:touchend={handleCanvasEnd}
				on:touchmove={handleCanvasMove}
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
		<div class="flex flex-col gap-4 text-white mx-auto expander" id="results">
			<h3 class="text-xl">Results</h3>
			{#if prediction}
				<div class="text-left gap-4 text-white expander mx-auto">
					<h2 class="text-sm md:text-base">
						The neural network predicted that you drew: {prediction} with confidence of: {confidence}
						<br /><br />
						Did it get it right? :)
					</h2>
				</div>
			{:else}
				<h2 class="text-sm md:text-base">
					Results will appear here once a guess has been sent to the neural network!
				</h2>
			{/if}
		</div>
	</div>
</div>

<style>
	@media (min-device-width: 320px) and (max-device-width: 460px) {
		.canvas {
			width: 336px;
			height: 336px;
			border: 1px solid white;
			align-self: center;
		}

		.expander {
			max-width: 600px;
			min-width: 320px;
		}
	}

	@media (min-device-width: 460px) {
		.canvas {
			width: 448px;
			height: 448px;
			border: 1px solid white;
			align-self: center;
		}

		.expander {
			max-width: 700px;
			min-width: 460px;
		}
	}

	.expander-icon {
		justify-self: right;
		transform: rotate(180deg);
		transition: all 1s;
	}
</style>
