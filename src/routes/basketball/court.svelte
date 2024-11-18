<script lang="ts">
	interface ShootingZone {
		percentage: number;
		average_percentage: number;
	}

	// take in the shooting data to draw shooting zones.
	let { data } = $props();

	/** The aspect ratio of a half-court.
	 * Note that the court is slightly wider than it's long. */
	let aspectRatio = 15 / 14.35;

	// measure in pixels
	let courtHeight = 640;
	let courtWidth = Math.ceil(aspectRatio * courtHeight);
	let halfCourtWidth = courtWidth / 2;

	let corner3pWidth = 39;
	let corner3pLineHeight = 192;
	let freeThrowLineWidth = 204;

	let basketHeight = 44;
	let backboardWidth = 81;

	let freeThrowBegin = Math.ceil(courtWidth / 2 - freeThrowLineWidth / 2);
	let freeThrowEnd = freeThrowBegin + freeThrowLineWidth;
	let freeThrowHeight = Math.ceil(courtHeight * 0.4);

	let canvas: HTMLCanvasElement;
	let canvasContext: CanvasRenderingContext2D;

	let seasons: number[] = [];

	/** The background color or the color of the floor of the court. */
	let backgroundColor = 'rgb(255 204 153)';
	/** Basket color defines the color of the basket and the backboard. */
	let basketColor = '#000000D0';
	/** Paint color defines the color of the 'paint' area
	 *  being the are between the basket and the free throw line.*/
	let paintColor = 'rgb(255 215 0)';
	/** Line color defines which color is used for drawing the 3p line,
	 * free throw line and the paints boundaries. */
	let lineColor = 'rgb(0 0 153)';

	let goodShooterColor = '#00FF00A0';
	let averageShooterColor = '#FFFF00A0';
	let badShooterColor = '#FF0000A0';

	let loaded = $state(false);

	let selectedSeason = $state();

	let freeThrowRegion: Path2D;
	let freeThrowArcRegion: Path2D;
	let freeThrowCounteArcRegion: Path2D;
	let paintRegion: Path2D;
	let line3pArc: Path2D;
	let basketHoopArc: Path2D;
	let backboardLine: Path2D;
	let backboardHoopRect: Path2D;

	let currentRegion: Path2D | undefined;
	let zoneRegions: [Path2D, number, number, ShootingZone][];

	$effect(() => {
		canvasContext = canvas.getContext('2d')!;

		getAllSeasons();
		createRegions();
		drawBackground();
		drawCourt();
		setupShootingZones();

		loaded = true;
	});

	const updateCanvasSize = (w: number, h: number) => {
		canvas.width = w;
		canvas.height = h;
	};

	const drawBackground = () => {
		canvasContext.fillStyle = backgroundColor;
		canvasContext.fillRect(0, 0, courtWidth, courtHeight);
		canvasContext.closePath();

		// Draw the paint
		canvasContext.fillStyle = paintColor;
		canvasContext.fill(paintRegion);
	};

	const createRegions = () => {
		zoneRegions = new Array();

		freeThrowRegion = new Path2D();
		freeThrowRegion.arc(halfCourtWidth, freeThrowHeight, 76.8, 0, Math.PI, false);
		freeThrowRegion.closePath();

		paintRegion = new Path2D();
		paintRegion.moveTo(freeThrowBegin, 0);
		paintRegion.lineTo(freeThrowBegin, freeThrowHeight);
		paintRegion.lineTo(freeThrowEnd, freeThrowHeight);
		paintRegion.lineTo(freeThrowEnd, 0);
		paintRegion.closePath();

		freeThrowArcRegion = new Path2D();
		freeThrowArcRegion.arc(halfCourtWidth, freeThrowHeight, 76.8, 0, Math.PI, false);
		freeThrowArcRegion.closePath();

		freeThrowCounteArcRegion = new Path2D();
		freeThrowCounteArcRegion.arc(halfCourtWidth, freeThrowHeight, 76.8, 0, Math.PI, true);
		freeThrowCounteArcRegion.closePath();

		line3pArc = new Path2D();
		line3pArc.moveTo(courtWidth - corner3pWidth, 0);
		line3pArc.lineTo(courtWidth - corner3pWidth, corner3pLineHeight);
		line3pArc.ellipse(
			courtWidth / 2,
			corner3pLineHeight,
			295, // center x
			199, // center y
			0,
			0,
			Math.PI,
			false
		);
		line3pArc.lineTo(corner3pWidth, 0);
		line3pArc.closePath();

		basketHoopArc = new Path2D();
		basketHoopArc.arc(halfCourtWidth, basketHeight, 10, 0, Math.PI * 2, false);
		basketHoopArc.closePath();

		backboardLine = new Path2D();
		backboardLine.moveTo(halfCourtWidth - backboardWidth / 2, basketHeight - 16);
		backboardLine.lineTo(halfCourtWidth + backboardWidth / 2, basketHeight - 16);
		backboardLine.closePath();

		backboardHoopRect = new Path2D();
		backboardHoopRect.rect(halfCourtWidth - 4, basketHeight - 16, 8, 8);
		backboardHoopRect.closePath();
	};

	const setupShootingZones = () => {
		const season = selectedSeason ? (selectedSeason as number) : -1;
		if (season == -1) {
			return;
		}

		const player = getPlayer(season);
		const seasonAverage = getSeasonAverage(season);

		if (!player || !seasonAverage) {
			return;
		}

		// Setup shooting regions
		zoneRegions.push([
			freeThrowArcRegion,
			0,
			0,
			{ percentage: player.ft_percent, average_percentage: seasonAverage.ft_percent }
		]);
		zoneRegions.push([
			paintRegion,
			0,
			0,
			{
				percentage: player.fg_percent_from_x0_3_range,
				average_percentage: seasonAverage.fg_percent_from_x0_3_range
			}
		]);
	};

	/**
	 * Draws the basketball court using canvas.
	 */
	const drawCourt = () => {
		// Start by drawing the three point line
		canvasContext.strokeStyle = lineColor;
		canvasContext.lineWidth = 4.0;
		canvasContext.stroke(line3pArc);

		// Free throw line
		canvasContext.lineWidth = 3.0;
		canvasContext.stroke(paintRegion);
		canvasContext.stroke(freeThrowArcRegion);

		canvasContext.setLineDash([22]);
		canvasContext.stroke(freeThrowCounteArcRegion);
		canvasContext.setLineDash([]);

		// Draw the basket
		canvasContext.strokeStyle = basketColor;
		canvasContext.fillStyle = basketColor;

		canvasContext.stroke(basketHoopArc);
		canvasContext.stroke(backboardLine);
		canvasContext.fill(backboardHoopRect);
	};

	const drawShootingZones = () => {
		drawBackground();

		const season = selectedSeason ? (selectedSeason as number) : -1;
		if (season == -1) {
			return;
		}

		for (var zone of zoneRegions) {
			const color = getShootingColor(zone[3].percentage, zone[3].average_percentage);
			canvasContext.fillStyle = color;
			canvasContext.globalAlpha = zone[1];
			canvasContext.fill(zone[0]);
			canvasContext.globalAlpha = 1;
		}

		drawCourt();
	};

	function animateShootingZones() {
		let redraw = false;

		for (let i = 0; i < zoneRegions.length; i++) {
			let zoneOpacity = zoneRegions[i][1];
			let zoneOpacityTarget = zoneRegions[i][2];

			if (zoneOpacity !== zoneOpacityTarget) {
				if (zoneOpacityTarget > zoneOpacity) {
					zoneOpacity += 0.125;
					zoneRegions[i][1] = Math.min(zoneOpacity, zoneOpacityTarget);
				} else {
					zoneOpacity -= 0.125;
					zoneRegions[i][1] = Math.max(zoneOpacity, 0);
				}

				redraw = true;
			}
		}

		if (redraw) {
			drawShootingZones();
			drawCourt();

			setTimeout(() => {
				requestAnimationFrame(animateShootingZones);
			}, 30);
		}
	}

	const handleMouse = (event: MouseEvent) => {
		const positionX = event.clientX - canvas.getBoundingClientRect().x;
		const positionY = event.clientY - canvas.getBoundingClientRect().y;

		let foundRegion: number = -1;

		for (let i = 0; i < zoneRegions.length; i++) {
			if (canvasContext.isPointInPath(zoneRegions[i][0], positionX, positionY)) {
				foundRegion = i;
			} else {
				zoneRegions[i][2] = 0;
			}
		}

		if (foundRegion == -1) {
			currentRegion = undefined;
			return;
		}

		if (zoneRegions[foundRegion][0] != currentRegion || currentRegion === undefined) {
			currentRegion = zoneRegions[foundRegion][0];
			zoneRegions[foundRegion][2] = 1;
			animateShootingZones();
		}
	};

	const cleanShootingZones = () => {
		for (let i = 0; i < zoneRegions.length; i++) {
			zoneRegions[i][2] = 0;
		}

		animateShootingZones();
	};

	const getShootingColor = (shootingPct: number, averagePct: number) => {
		if (shootingPct > averagePct * 1.05) {
			return goodShooterColor;
		} else if (averagePct * 0.95 < shootingPct && shootingPct < averagePct * 1.05) {
			return averageShooterColor;
		} else {
			return badShooterColor;
		}
	};

	const getPlayer = (season: number) => {
		//const seasonObj = data.players.find((elem) => elem.season == season);
		for (let player of data.players) {
			if (player.season == season) {
				return player;
			}
		}
		return undefined;
	};

	const getSeasonAverage = (season: number) => {
		for (let avg of data.averages) {
			if (avg.season == season) {
				return avg;
			}
		}
		return undefined;
	};

	const getAllSeasons = () => {
		for (var season of data.players) {
			seasons.push(season.season);
		}
		seasons.reverse();
	};
</script>

<div class="flex flex-col gap-2">
	<canvas
		onmousemove={(e) => handleMouse(e)}
		onmouseleave={(_) => cleanShootingZones()}
		bind:this={canvas}
		width={courtWidth}
		height={courtHeight}
	>
	</canvas>
	{#if loaded}
		<div class="flex flex-row gap-2 items-end justify-end">
			<label for="seasons" class="text-md font-medium my-auto dark:text-white align-middle"
				>Season:
			</label>

			<select
				name="seasons"
				class="py-2 px-3 pe-2 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
				bind:value={selectedSeason}
			>
				{#each seasons as season}
					<option value={season}>{season}</option>
				{/each}
			</select>
		</div>
	{/if}
</div>

<style>
	canvas {
		border: solid 1px;
		border-color: white;
	}

	label {
		font-family: 'Inter', sans-serif;
		color: white;
	}
</style>
