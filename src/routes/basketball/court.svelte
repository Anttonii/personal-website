<script lang="ts">
	import { faUnderline } from '@fortawesome/free-solid-svg-icons';

	// take in the shooting data to draw shooting zones.
	let { data } = $props();

	// the aspect ratio of a half-court.
	// note that the x-axis is larger than the y since the court is rotated.
	let aspectRatio = 15 / 14.35;

	// measure in pixels
	let courtHeight = 640;
	let courtWidth = Math.ceil(aspectRatio * courtHeight);

	let canvas: HTMLCanvasElement;
	let canvasContext: CanvasRenderingContext2D;

	let backgroundColor = 'rgb(255 204 153)';

	let corner3pWidth = 39;
	let corner3pLineHeight = 192;
	let freeThrowLineWidth = 204;

	let basketHeight = 56;
	let backboardWidth = 81;

	$effect(() => {
		canvasContext = canvas.getContext('2d')!;

		canvasContext.fillStyle = backgroundColor;
		canvasContext.fillRect(0, 0, courtWidth, courtHeight);

		drawCourt();
	});

	const updateCanvasSize = (w: number, h: number) => {
		canvas.width = w;
		canvas.height = h;
	};

	const drawCourt = () => {
		let halfCourtWidth = courtWidth / 2;

		// Start by drawing the three point line
		canvasContext.strokeStyle = 'rgb(0 0 153)';
		canvasContext.lineWidth = 4.0;

		canvasContext.beginPath();
		canvasContext.moveTo(courtWidth - corner3pWidth, 0);
		canvasContext.lineTo(courtWidth - corner3pWidth, corner3pLineHeight);
		canvasContext.ellipse(
			courtWidth / 2,
			corner3pLineHeight,
			295, // center x
			199, // center y
			0,
			0,
			Math.PI,
			false
		);
		canvasContext.lineTo(corner3pWidth, 0);
		canvasContext.stroke();

		// Free throw line
		let freeThrowBegin = Math.ceil(courtWidth / 2 - freeThrowLineWidth / 2);
		let freeThrowEnd = freeThrowBegin + freeThrowLineWidth;
		let freeThrowHeight = Math.ceil(courtHeight * 0.4);

		canvasContext.lineWidth = 3.0;

		canvasContext.beginPath();
		canvasContext.moveTo(freeThrowBegin, 0);
		canvasContext.lineTo(freeThrowBegin, freeThrowHeight);
		canvasContext.lineTo(freeThrowEnd, freeThrowHeight);
		canvasContext.lineTo(freeThrowEnd, 0);
		canvasContext.stroke();

		canvasContext.fillStyle = 'rgb(255 215 0)';
		canvasContext.fillRect(freeThrowBegin, 0, freeThrowLineWidth, freeThrowHeight);

		canvasContext.beginPath();
		canvasContext.arc(halfCourtWidth, freeThrowHeight, 76.8, 0, Math.PI, false);
		canvasContext.stroke();

		canvasContext.beginPath();
		canvasContext.setLineDash([22]);
		canvasContext.arc(halfCourtWidth, freeThrowHeight, 76.8, 0, Math.PI, true);
		canvasContext.stroke();
		canvasContext.setLineDash([]);

		// Draw the basket
		canvasContext.strokeStyle = 'black';
		canvasContext.beginPath();
		canvasContext.arc(halfCourtWidth, basketHeight, 10, 0, Math.PI * 2, false);
		canvasContext.stroke();

		canvasContext.beginPath();
		canvasContext.moveTo(halfCourtWidth - backboardWidth / 2, basketHeight - 16);
		canvasContext.lineTo(halfCourtWidth + backboardWidth / 2, basketHeight - 16);
		canvasContext.stroke();

		canvasContext.fillStyle = 'black';
		canvasContext.fillRect(halfCourtWidth - 4, basketHeight - 16, 8, 8);
	};
</script>

<canvas bind:this={canvas} width={courtWidth} height={courtHeight}> </canvas>

<style>
	canvas {
		border: solid 1px;
		border-color: white;
	}
</style>
