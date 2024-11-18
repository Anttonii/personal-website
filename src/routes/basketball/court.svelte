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
	let paintRegion: Path2D;
	let closeRegion: Path2D;
	let leftCornerThreeRegion: Path2D;
	let rightCornerThreeRegion: Path2D;
	let line3pRegion: Path2D;
	let short2pRegion: Path2D;
	let midrange2pRegion: Path2D;
	let long2pRegion: Path2D;

	let freeThrowArc: Path2D;
	let freeThrowCounterArc: Path2D;
	let line3pArc: Path2D;
	let basketHoopArc: Path2D;
	let backboardLine: Path2D;
	let backboardHoopRect: Path2D;

	let currentRegion: number = -1;
	let zoneRegions: [Path2D[], number, number, ShootingZone][];

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

		freeThrowArc = new Path2D();
		freeThrowArc.arc(halfCourtWidth, freeThrowHeight, 76.8, 0, Math.PI, false);
		freeThrowArc.closePath();

		freeThrowCounterArc = new Path2D();
		freeThrowCounterArc.arc(halfCourtWidth, freeThrowHeight, 76.8, 0, Math.PI, true);
		freeThrowCounterArc.closePath();

		line3pArc = new Path2D();
		line3pArc.moveTo(courtWidth - corner3pWidth, 0);
		line3pArc.lineTo(courtWidth - corner3pWidth, corner3pLineHeight);
		line3pArc.ellipse(courtWidth / 2, corner3pLineHeight, 295, 199, 0, 0, Math.PI, false);
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

		leftCornerThreeRegion = new Path2D();
		leftCornerThreeRegion.rect(0, 0, corner3pWidth, 70);
		leftCornerThreeRegion.closePath();

		rightCornerThreeRegion = new Path2D();
		rightCornerThreeRegion.rect(courtWidth - corner3pWidth, 0, corner3pWidth, 70);
		rightCornerThreeRegion.closePath();

		line3pRegion = new Path2D();
		line3pRegion.moveTo(courtWidth, 70);
		line3pRegion.lineTo(courtWidth - corner3pWidth, 70);
		line3pRegion.lineTo(courtWidth - corner3pWidth, corner3pLineHeight);
		line3pRegion.ellipse(courtWidth / 2, corner3pLineHeight, 295, 199, 0, 0, Math.PI, false);
		line3pRegion.lineTo(corner3pWidth, 70);
		line3pRegion.lineTo(0, 70);
		line3pRegion.lineTo(0, courtHeight);
		line3pRegion.lineTo(courtWidth, courtHeight);
		line3pRegion.lineTo(courtWidth, 70);
		line3pRegion.closePath();

		closeRegion = new Path2D();
		closeRegion.arc(courtWidth / 2, 26, 70, 0, Math.PI, false);
		closeRegion.closePath();

		midrange2pRegion = new Path2D();
		midrange2pRegion.moveTo(courtWidth - corner3pWidth - 50, 0);
		midrange2pRegion.lineTo(courtWidth - corner3pWidth - 200, 0);
		midrange2pRegion.lineTo(courtWidth - corner3pWidth - 200, corner3pLineHeight - 110);
		midrange2pRegion.ellipse(
			courtWidth / 2,
			corner3pLineHeight - 110,
			95,
			60,
			0,
			0,
			Math.PI,
			false
		);
		midrange2pRegion.lineTo(corner3pWidth + 200, 0);
		midrange2pRegion.lineTo(corner3pWidth + 50, 0);
		midrange2pRegion.lineTo(corner3pWidth + 50, corner3pLineHeight - 25);
		midrange2pRegion.ellipse(
			courtWidth / 2,
			corner3pLineHeight - 25,
			245,
			169,
			0,
			Math.PI,
			0,
			true
		);
		midrange2pRegion.lineTo(courtWidth - corner3pWidth - 50, 0);
		midrange2pRegion.closePath();

		short2pRegion = new Path2D();
		short2pRegion.moveTo(courtWidth - corner3pWidth - 50, 0);
		short2pRegion.lineTo(courtWidth - corner3pWidth - 200, 0);
		short2pRegion.lineTo(courtWidth - corner3pWidth - 200, corner3pLineHeight - 110);
		short2pRegion.ellipse(courtWidth / 2, corner3pLineHeight - 110, 95, 60, 0, 0, Math.PI, false);
		short2pRegion.lineTo(corner3pWidth + 200, 0);
		short2pRegion.closePath();

		long2pRegion = new Path2D();
		long2pRegion.moveTo(courtWidth - corner3pWidth, 0);
		long2pRegion.lineTo(courtWidth - corner3pWidth - 50, 0);
		long2pRegion.lineTo(courtWidth - corner3pWidth - 50, corner3pLineHeight - 25);
		long2pRegion.ellipse(courtWidth / 2, corner3pLineHeight - 25, 245, 169, 0, 0, Math.PI, false);
		long2pRegion.lineTo(corner3pWidth + 50, 0);
		long2pRegion.lineTo(corner3pWidth, 0);
		long2pRegion.lineTo(corner3pWidth, corner3pLineHeight);
		long2pRegion.ellipse(courtWidth / 2, corner3pLineHeight, 295, 199, 0, Math.PI, 0, true);
		long2pRegion.lineTo(courtWidth - corner3pWidth, 0);
		long2pRegion.closePath();
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
			[freeThrowArc],
			0,
			0,
			{ percentage: player.ft_percent, average_percentage: seasonAverage.ft_percent }
		]);
		zoneRegions.push([
			[leftCornerThreeRegion, rightCornerThreeRegion],
			0,
			0,
			{
				percentage: player.corner_3_point_percent,
				average_percentage: seasonAverage.corner_3_point_percent
			}
		]);
		zoneRegions.push([
			[line3pRegion],
			0,
			0,
			{
				percentage: player.fg_percent_from_x3p_range,
				average_percentage: seasonAverage.fg_percent_from_x3p_range
			}
		]);
		zoneRegions.push([
			[long2pRegion],
			0,
			0,
			{
				percentage: player.fg_percent_from_x16_3p_range,
				average_percentage: seasonAverage.fg_percent_from_x16_3p_range
			}
		]);
		zoneRegions.push([
			[midrange2pRegion],
			0,
			0,
			{
				percentage: player.fg_percent_from_x10_16_range,
				average_percentage: seasonAverage.fg_percent_from_x10_16_range
			}
		]);
		zoneRegions.push([
			[short2pRegion],
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
		canvasContext.stroke(freeThrowArc);

		canvasContext.setLineDash([22]);
		canvasContext.stroke(freeThrowCounterArc);
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
			canvasContext.globalAlpha = zone[1];
			canvasContext.fillStyle = color;

			for (var region of zone[0]) {
				canvasContext.fill(region);
			}

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

			setTimeout(() => {
				requestAnimationFrame(animateShootingZones);
			}, 40);
		}
	}

	const handleMouse = (event: MouseEvent) => {
		const positionX = event.clientX - canvas.getBoundingClientRect().x;
		const positionY = event.clientY - canvas.getBoundingClientRect().y;

		let foundRegion: number = -1;

		for (let i = 0; i < zoneRegions.length; i++) {
			for (var region of zoneRegions[i][0]) {
				if (canvasContext.isPointInPath(region, positionX, positionY)) {
					foundRegion = i;
				}
			}

			if (foundRegion != i) {
				zoneRegions[i][2] = 0;
			} else {
				break;
			}
		}

		if (foundRegion == -1) {
			currentRegion = foundRegion;
			return;
		}

		if (foundRegion != currentRegion || currentRegion == -1) {
			currentRegion = foundRegion;
			zoneRegions[foundRegion][2] = 1;

			for (let i = 0; i < zoneRegions.length; i++) {
				if (i != currentRegion) {
					zoneRegions[i][2] = 0;
				}
			}

			animateShootingZones();
		}
	};

	const handleMouseEnter = () => {
		for (let i = 0; i < zoneRegions.length; i++) {
			zoneRegions[i][1] = 0;
		}
	};

	const handleMouseExit = () => {
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
		onmouseenter={(_) => handleMouseEnter()}
		onmousemove={(e) => handleMouse(e)}
		onmouseleave={(_) => handleMouseExit()}
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
