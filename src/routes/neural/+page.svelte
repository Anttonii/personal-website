<script lang="ts">
	import { slide } from 'svelte/transition';

	let innerWidth: number = $state(0);
	let innerHeight: number = $state(0);

	let expanderIcon: HTMLElement;
	let prediction: string | null = $state(null);
	let confidence: string | null = $state(null);

	// the html element representing our canvas
	let canvas: HTMLCanvasElement;
	let canvasContext: CanvasRenderingContext2D;
	let isDrawing = false;

	// represents the hex values of the drawn cells
	let gridValues: number[][] = new Array(28).fill(0).map(() => new Array(28).fill(0));

	// box size refers to size of a single pixel in the grid thus a box takes boxSize ** 2 space in pixels
	const gridSize: number = 28;
	let boxSize: number = 16;
	let method: number = 1;

	// Canvas is a square thus it's sides length is the same for all sides
	let currCanvasSize: number = $state(gridSize * boxSize);

	const black: string = '#000000';
	const white: string = '#FFFFFF';
	const grey: string = '#5A5A5A';

	let instructionsExpanded = $state(false);

	$effect(() => {
		canvasContext = canvas.getContext('2d')!;

		if (gridSize * boxSize > innerWidth) {
			boxSize = 12;
		}

		updateCanvasSize();
		window.addEventListener('resize', resize);
	});

	const updateCanvasSize = () => {
		currCanvasSize = boxSize * gridSize;

		canvasContext.canvas.width = currCanvasSize;
		canvasContext.canvas.height = currCanvasSize;
	};

	const resize = () => {
		if (innerWidth <= 460 && currCanvasSize == 448) {
			boxSize = 12;
		} else if (innerWidth > 460 && currCanvasSize == 336) {
			boxSize = 16;
		} else {
			return;
		}

		updateCanvasSize();
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
		canvasContext.fillRect(0, 0, currCanvasSize, currCanvasSize);

		prediction = null;
		confidence = null;
	};

	const toggleInstructions = () => {
		instructionsExpanded = !instructionsExpanded;
		if (!instructionsExpanded) {
			expanderIcon.style.transform = 'rotate(90deg)';
		} else {
			expanderIcon.style.transform = 'rotate(270deg)';
		}
	};

	const postGrid = async () => {
		// Post the request to backend
		const res = await fetch('/api/neural', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				method,
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

<svelte:window bind:innerWidth bind:innerHeight />

<div class="w-full h-full flex py-4">
	<div class="w-full mx-auto flex flex-col justify-center items-center">
		<div class="flex flex-col justify-start md:justify-center align-middle gap-8 h-full text-white">
			<h2 class="font-bold text-3xl md:text-5xl text-center tracking-wider">
				<a href="/">Anttoni Koivu</a>
			</h2>
			<h3 class="font-bold text-base md:text-xl text-center tracking-wider">Neural Network!</h3>
			<div class="flex flex-col mx-h-90 gap-4">
				<div class="flex flex-col justify-center expander">
					<button
						class="expander border border-white flex flex-row justify-between py-2 px-2 m-auto"
						onclick={toggleInstructions}
					>
						<h4 class="text-sm md:text-lg">Instructions</h4>
						<span
							class="expander-icon triangle inline-flex align-baseline ml-2 mt-1"
							bind:this={expanderIcon}
						></span>
					</button>
					{#if instructionsExpanded}
						<div class="expander ps-4" transition:slide={{ duration: 1000 }}>
							<p class="text-xs md:text-sm tracking-tight pt-4">
								Start by drawing an image of any number between 0 and 9. Press guess to see if the
								neural network is correct at predicting what number you've drawn. If you want to
								start over the drawing process, just press clear to clear the canvas.<br /><br />

								Simple NN uses a simpler model than convolutional NN and thus is a little bit less
								accurate, try to see if you can find differences in their guessing.<br /><br />
								<span class="text-center md:text-left">Happy experimenting!</span>
							</p>
						</div>
					{/if}
				</div>

				<div class="flex flex-row expander gap-4 justify-center">
					<div class="flex items-center ps-4 gap-2">
						<input
							id="bordered-radio-1"
							type="radio"
							value=""
							name="bordered-radio"
							class="w-4 h-4"
							onclick={() => {
								method = 0;
							}}
						/>
						<label for="bordered-radio-1" class="w-full py-4 ms-2 text-sm">Simple NN</label>
					</div>
					<div class="flex items-center ps-4 gap-2">
						<input
							checked
							id="bordered-radio-2"
							type="radio"
							value=""
							name="bordered-radio"
							class="w-4 h-4"
							onclick={() => {
								method = 1;
							}}
						/>
						<label for="bordered-radio-2" class="w-full py-4 ms-2 text-sm">Convolutional NN</label>
					</div>
				</div>

				<div class="flex flex-col justify-center gap-8">
					<canvas
						class="canvas"
						width={currCanvasSize}
						height={currCanvasSize}
						bind:this={canvas}
						onmousedown={handleCanvasStart}
						onmouseup={handleCanvasEnd}
						onmousemove={handleCanvasMove}
						onmouseleave={handleCanvasEnd}
						ontouchstart={handleCanvasStart}
						ontouchend={handleCanvasEnd}
						ontouchmove={handleCanvasMove}
					></canvas>
					<div class="flex flex-row justify-center gap-8">
						<button
							class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
							onclick={postGrid}
						>
							Guess
						</button>
						<button
							class="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
							onclick={clearGrid}
						>
							Clear
						</button>
					</div>
				</div>

				<div class="flex flex-col gap-4 text-white mx-auto expander ps-4" id="results">
					<h3 class="pt-4 text-sm md:text-xl">Results</h3>
					{#if prediction}
						<div class="text-left gap-4 text-white expander mx-auto">
							<h2 class="text-xs md:text-sm">
								The neural network predicted that you drew: {prediction} with confidence of: {confidence}
								<br /><br />
								Did it get it right? :)
							</h2>
						</div>
					{:else}
						<h2 class="text-xs md:text-sm">
							Results will appear here once a guess has been sent to the neural network!
						</h2>
					{/if}
				</div>
			</div>
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
			touch-action: none;
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
		transform: rotate(90deg);
		transition: all 1s;
	}

	.mx-h-90 {
		max-height: 90%;
	}

	.triangle {
		height: 16px;
		width: 16px;
		background-color: white;
		clip-path: polygon(0 0, 0% 100%, 100% 50%);
		z-index: 1;
	}
</style>
