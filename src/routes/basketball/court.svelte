<script lang="ts">
	import Fa from 'svelte-fa';
	import { faX, faCheck, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
	import { onMount } from 'svelte';

	let { player, seasonAverages, alltimeAverages, positionAverages, teamMappings } = $props();

	interface ShootingZone {
		zone: string;
		player: string;
		explanation: string;
		percentage: number;
		average_percentage: number;
	}

	const filters = [
		{
			value: 'season',
			text: 'Season',
			tooltip: "Compare current player against the given seasons' average player."
		},
		{
			value: 'position',
			text: 'Position',
			tooltip: "Compare current player against the positions' average player for the given season."
		},
		{
			value: 'alltime',
			text: 'Alltime',
			tooltip: 'Compare current player against the average player of all time.'
		}
	];

	/** The aspect ratio of a half-court.
	 * Note that the court is slightly wider than it's long. */
	let aspectRatio = 15 / 14.35;

	// Measured in pixels
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
	let toolTipCanvas: HTMLCanvasElement;
	let outlineCanvas: HTMLCanvasElement;
	let canvasContext: CanvasRenderingContext2D;
	let toolTipCanvasContext: CanvasRenderingContext2D;
	let outlineCanvasContext: CanvasRenderingContext2D;

	let seasons: number[] = [];

	/** The background color or the color of the floor of the court. */
	let backgroundColor = 'rgb(255 204 153)';

	/** Basket color defines the color of the basket and the backboard. */
	let basketColor = '#000000D0';

	/** Paint color defines the color of the 'paint' area
	 *  being the are between the basket and the free throw line.
	 *
	 * 	This is a default value, paint color will be changed to the secondary color.
	 * */
	let paintColor = 'rgb(255 215 0)';
	/**
	 * Line color defines which color is used for drawing the 3p line,
	 * free throw line and the paints boundaries.
	 *
	 * This is a default value, line color will be changed to the teams primary
	 * color.
	 * */
	let lineColor = 'rgb(0 0 153)';

	let goodShooterColor = '#03C04A';
	let averageShooterColor = '#FCAE1E';
	let badShooterColor = '#E3242B';

	let tooltipBoxBGColor = '#303030FF';
	let tooltipBoxColor = '#505050FF';

	let loaded = $state(false);

	let selectedSeason = $state();
	let checkedDataset = $state('season');
	let highlightZones = $state(false);
	let showInformation = $state(false);

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

	let mobileScreen: boolean = $state(false);
	let innerScrollY: number = $state(0);
	let innerWidth: number = $state(0);
	let innerHeight: number = $state(0);

	onMount(() => {
		canvasContext = canvas.getContext('2d')!;
		toolTipCanvasContext = toolTipCanvas.getContext('2d')!;
		outlineCanvasContext = outlineCanvas.getContext('2d')!;

		mobileScreen = innerWidth <= 680;

		getAllSeasons();
		getColors();
		createRegions();
		drawBackground();
		drawCourt();
		setupShootingZones();

		loaded = true;

		window.addEventListener('resize', resize);
		return {
			destroy() {
				window.removeEventListener('resize', resize, true);
			}
		};
	});

	$effect(() => {
		getColors();
		updateShootingZones();
		requestAnimationFrame(drawShootingZones);
	});

	const resize = () => {
		mobileScreen = innerWidth <= 680;
	};

	const createRegions = () => {
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
		line3pRegion.moveTo(courtWidth, 0);
		line3pRegion.lineTo(courtWidth - corner3pWidth, 0);
		line3pRegion.lineTo(courtWidth - corner3pWidth, corner3pLineHeight);
		line3pRegion.ellipse(courtWidth / 2, corner3pLineHeight, 295, 199, 0, 0, Math.PI, false);
		line3pRegion.lineTo(corner3pWidth, 0);
		line3pRegion.lineTo(0, 0);
		line3pRegion.lineTo(0, courtHeight);
		line3pRegion.lineTo(courtWidth, courtHeight);
		line3pRegion.lineTo(courtWidth, 0);
		line3pRegion.closePath();

		closeRegion = new Path2D();
		closeRegion.arc(courtWidth / 2, 26, 70, 0, Math.PI, false);
		closeRegion.closePath();

		short2pRegion = new Path2D();
		short2pRegion.moveTo(courtWidth - corner3pWidth - 50, 0);
		short2pRegion.lineTo(courtWidth - corner3pWidth - 200, 0);
		short2pRegion.lineTo(courtWidth - corner3pWidth - 200, corner3pLineHeight - 110);
		short2pRegion.ellipse(courtWidth / 2, corner3pLineHeight - 110, 95, 60, 0, 0, Math.PI, false);
		short2pRegion.lineTo(corner3pWidth + 200, 0);
		short2pRegion.closePath();

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
		zoneRegions = new Array();

		const season = selectedSeason ? (selectedSeason as number) : -1;
		if (season == -1) {
			return;
		}

		const player = getPlayer(season);
		const average = getAverage(season);

		if (!player || !average) {
			return;
		}

		// Setup shooting regions
		zoneRegions.push([
			[freeThrowArc],
			0,
			0,
			{
				zone: 'ft',
				player: player.player,
				explanation: 'Free throws',
				percentage: player.ft_percent,
				average_percentage: average.ft_percent
			}
		]);
		zoneRegions.push([
			[leftCornerThreeRegion, rightCornerThreeRegion],
			0,
			0,
			{
				zone: 'ct',
				player: player.player,
				explanation: 'Corner threes',
				percentage: player.corner_3_point_percent,
				average_percentage: average.corner_3_point_percent
			}
		]);
		zoneRegions.push([
			[line3pRegion],
			0,
			0,
			{
				zone: 'tp',
				player: player.player,
				explanation: 'Three pointers',
				percentage: player.x3p_percent,
				average_percentage: average.x3p_percent
			}
		]);
		zoneRegions.push([
			[long2pRegion],
			0,
			0,
			{
				zone: 'lt',
				player: player.player,
				explanation: 'Long twos',
				percentage: player.fg_percent_from_x16_3p_range,
				average_percentage: average.fg_percent_from_x16_3p_range
			}
		]);
		zoneRegions.push([
			[midrange2pRegion],
			0,
			0,
			{
				zone: 'mrt',
				player: player.player,
				explanation: 'Midrange twos',
				percentage: player.fg_percent_from_x10_16_range,
				average_percentage: average.fg_percent_from_x10_16_range
			}
		]);
		zoneRegions.push([
			[short2pRegion],
			0,
			0,
			{
				zone: 'utr',
				player: player.player,
				explanation: 'Under the rim',
				percentage: player.fg_percent_from_x0_3_range,
				average_percentage: average.fg_percent_from_x0_3_range
			}
		]);
	};

	const updateShootingZones = () => {
		const season = selectedSeason ? (selectedSeason as number) : -1;
		if (season == -1) {
			return;
		}

		const player = getPlayer(season);
		const average = getAverage(season);
		if (!player || !average) {
			return;
		}

		for (let i = 0; i < zoneRegions.length; i++) {
			let zone = zoneRegions[i][3].zone;

			let newPlayer = 0;
			let newAvg = 0;

			if (zone == 'ft') {
				newPlayer = player.ft_percent;
				newAvg = average.ft_percent;
			} else if (zone == 'ct') {
				newPlayer = player.corner_3_point_percent;
				newAvg = average.corner_3_point_percent;
			} else if (zone == 'tp') {
				newPlayer = player.x3p_percent;
				newAvg = average.x3p_percent;
			} else if (zone == 'lt') {
				newPlayer = player.fg_percent_from_x16_3p_range;
				newAvg = average.fg_percent_from_x16_3p_range;
			} else if (zone == 'mrt') {
				newPlayer = player.fg_percent_from_x10_16_range;
				newAvg = average.fg_percent_from_x10_16_range;
			} else if (zone == 'utr') {
				newPlayer = player.fg_percent_from_x0_3_range;
				newAvg = average.fg_percent_from_x0_3_range;
			}

			zoneRegions[i][3].percentage = newPlayer;
			zoneRegions[i][3].average_percentage = newAvg;
		}
	};

	const drawBackground = () => {
		canvasContext.fillStyle = backgroundColor;
		canvasContext.fillRect(0, 0, courtWidth, courtHeight);

		// Draw the paint
		canvasContext.fillStyle = paintColor;
		canvasContext.fill(paintRegion);

		outlineCanvasContext.clearRect(0, 0, courtWidth, courtHeight);
	};

	/**
	 * Draws the basketball court using canvas.
	 */
	const drawCourt = () => {
		if (highlightZones) {
			canvasContext.strokeStyle = 'white';
		} else {
			canvasContext.strokeStyle = lineColor;
		}

		// Start by drawing the three point line
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

		drawPlayerName();
	};

	const drawPlayerName = () => {
		const playerName: string = getPlayerName();

		canvasContext.font = '52px Inter, sans-serif';
		if (highlightZones) {
			canvasContext.fillStyle = 'black';
		} else {
			canvasContext.fillStyle = tooltipBoxBGColor;
		}
		const nameWidth = canvasContext.measureText(playerName).width;
		const nameX = courtWidth / 2 - nameWidth / 2;
		const nameY = 540;
		canvasContext.fillText(playerName, nameX, nameY);
	};

	const drawTooltip = (mouseX: number, mouseY: number) => {
		toolTipCanvasContext.font = '18px Inter, sans-serif';

		const region = zoneRegions[currentRegion];
		const fontSize = 18; // in pixels
		const title = 'Zone: ' + region[3].explanation;
		const fields = [
			'Player: ' + region[3].player,
			'Shooting-%: ' + (region[3].percentage * 100).toFixed(1),
			'NBA Avg-%: ' + (region[3].average_percentage * 100).toFixed(1)
		];
		const titleWidth = toolTipCanvasContext.measureText(title).width;
		const maxWidth = Math.max(
			...fields.map((elem) => toolTipCanvasContext.measureText(elem).width)
		);

		let tooltipOffsetY = 15;
		let tooltipTextOffsetX = 10;
		let tooltipTextOffsetY = 10;

		let tooltipWidth = Math.ceil(Math.max(maxWidth, titleWidth)) + 2 * tooltipTextOffsetX;
		let tooltipHeight = (fields.length + 1) * fontSize + tooltipTextOffsetY * 2;

		let tooltipX = mouseX - tooltipWidth / 2;
		let tooltipY = mouseY - tooltipHeight - tooltipOffsetY;

		if (tooltipX + tooltipWidth > canvas.width) {
			tooltipX = mouseX - tooltipWidth;
		} else if (tooltipX < 0) {
			tooltipX = mouseX;
		}

		if (tooltipY < 0) {
			tooltipY = mouseY + tooltipOffsetY;
		}

		if (currentRegion == -1) {
			return;
		}

		// Draws title in the center of the tooltip box.
		const titleX = tooltipX + (tooltipWidth / 2 - titleWidth / 2);

		// Clear canvas
		toolTipCanvasContext.clearRect(0, 0, courtWidth, courtHeight);

		// Render background boxes
		toolTipCanvasContext.fillStyle = tooltipBoxBGColor;
		toolTipCanvasContext.fillRect(tooltipX + 2, tooltipY + 2, tooltipWidth + 3, tooltipHeight + 3);
		toolTipCanvasContext.fillStyle = tooltipBoxColor;
		toolTipCanvasContext.fillRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);

		// Render texts
		toolTipCanvasContext.fillStyle = 'white';
		toolTipCanvasContext.fillText(title, titleX, tooltipY + tooltipTextOffsetY * 2);
		toolTipCanvasContext.fillRect(tooltipX + 5, tooltipY + 27, tooltipWidth - 10, 2);
		for (let i = 0; i < fields.length; i++) {
			toolTipCanvasContext.fillText(
				fields[i],
				tooltipX + tooltipTextOffsetX,
				tooltipY + 30 + (i + 1) * fontSize
			);
		}
	};

	const drawHelp = () => {
		canvasContext.fillStyle = 'white';
		canvasContext.font = '16px Inter, sans-serif';

		const identifiers = ['Green', 'Yellow', 'Red'];
		const maxWidth = Math.max(...identifiers.map((elem) => canvasContext.measureText(elem).width));

		const boxWidth = 180;
		const boxHeight = 70;

		const boxX = courtWidth - boxWidth;
		const boxY = courtHeight - boxHeight;

		canvasContext.fillStyle = tooltipBoxBGColor;
		canvasContext.fillRect(boxX, boxY, boxWidth, boxHeight);
		canvasContext.fillStyle = 'white';
		canvasContext.font = '16px Inter, sans-serif';

		for (let i = 0; i < identifiers.length; i++) {
			let id = identifiers[i];
			canvasContext.fillText(id, boxX + 5, boxY + 5 + (i + 1) * 18);
		}

		canvasContext.fillText('= +5% of avg', boxX + 7 + maxWidth, boxY + 23);
		canvasContext.fillText('= +/- 5% of avg', boxX + 7 + maxWidth, boxY + 41);
		canvasContext.fillText('= -5% of avg', boxX + 7 + maxWidth, boxY + 59);
	};

	const drawShootingZones = () => {
		drawBackground();

		const season = selectedSeason ? (selectedSeason as number) : -1;
		if (season == -1) {
			return;
		}

		// Render regions in reverse order when zones are highlighted.
		// This allows corner 3s and free throws to be rendered on top instead
		// of being drawn below overlapping regions.
		let regions = [...zoneRegions];
		if (highlightZones) {
			regions.reverse();
		}

		for (let i = 0; i < regions.length; i++) {
			let zone = regions[i];
			let zoneInformation = zone[3];

			const color = getShootingColor(
				zoneInformation.percentage,
				zoneInformation.average_percentage
			);

			canvasContext.globalAlpha = zone[1];
			canvasContext.fillStyle = color;

			for (var region of zone[0]) {
				canvasContext.fill(region);

				if (highlightZones) {
					outlineCanvasContext.strokeStyle = 'white';
					outlineCanvasContext.lineWidth = 4;
					outlineCanvasContext.stroke(region);
				}
			}

			canvasContext.globalAlpha = 1;
		}

		drawCourt();
		if (showInformation) drawHelp();
	};

	function animateShootingZones(force: boolean = false) {
		let redraw = false;

		for (let i = 0; i < zoneRegions.length; i++) {
			let zoneOpacity = zoneRegions[i][1];
			let zoneOpacityTarget = zoneRegions[i][2];

			if (zoneOpacity !== zoneOpacityTarget) {
				if (zoneOpacityTarget > zoneOpacity) {
					zoneRegions[i][1] = Math.min(zoneOpacity + 0.167, zoneOpacityTarget);
				} else {
					zoneRegions[i][1] = Math.max(zoneOpacity - 0.167, 0);
				}

				redraw = true;
			}
		}

		if (redraw || force) {
			drawShootingZones();

			setTimeout(() => {
				requestAnimationFrame(() => {
					animateShootingZones(false);
				});
			}, 35);
		}
	}

	const handleMouse = (event: MouseEvent) => {
		if (mobileScreen) {
			return;
		}

		const posX = event.clientX - canvas.getBoundingClientRect().x;
		const posY = event.clientY - canvas.getBoundingClientRect().y;

		onTouch(posX, posY);
	};

	const handleTouch = (event: TouchEvent) => {
		if (!mobileScreen) {
			return;
		}

		const posX = (event.touches[0].clientX - canvas.getBoundingClientRect().x) * 1.85;
		const posY = (event.touches[0].clientY - canvas.getBoundingClientRect().y) * 1.85;

		onTouch(posX, posY);
	};

	const onTouch = (posX: number, posY: number) => {
		let foundRegion: number = -1;

		for (let i = 0; i < zoneRegions.length; i++) {
			for (var region of zoneRegions[i][0]) {
				if (canvasContext.isPointInPath(region, posX, posY)) {
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

			if (!highlightZones) {
				animateShootingZones();
			}
		}

		drawTooltip(posX, posY);
	};

	const handleMouseEnter = () => {
		if (highlightZones) {
			return;
		}

		toggleRegions(0, 1);
	};

	const handleMouseExit = () => {
		toolTipCanvasContext.clearRect(0, 0, courtWidth, courtHeight);

		if (highlightZones) {
			return;
		}

		currentRegion = -1;

		toggleRegions(0, 2);
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

	const getPlayerName = () => {
		if (!player) {
			return undefined;
		}

		return player[0].player;
	};

	const getPlayer = (season: number) => {
		for (let playerData of player) {
			if (playerData.season == season) {
				return playerData;
			}
		}
		return undefined;
	};

	const getAverage = (season: number) => {
		let dataset = getDataset();
		if (checkedDataset == 'alltime') {
			return dataset;
		}

		for (let avg of dataset) {
			if (avg.season == season) {
				return avg;
			}
		}

		return undefined;
	};

	const getAllSeasons = () => {
		if (!player) {
			return;
		}

		for (var season of player) {
			seasons.push(season.season);
		}
		seasons.reverse();

		if (seasons.length > 0) selectedSeason = seasons[0];
	};

	/**
	 * Updates colors such that the line color and paint color are chosen
	 * as the primary and secondary colors of the team that the player
	 * is currently playing for.
	 */
	const getColors = () => {
		const season = selectedSeason ? (selectedSeason as number) : -1;
		if (season == -1) {
			return;
		}

		const player = getPlayer(season);
		if (!player) {
			return;
		}

		const team = player.tm;
		for (var mapping of teamMappings) {
			if (mapping.abbreviation == team) {
				lineColor = mapping.primaryColor;
				paintColor = mapping.secondaryColor;
			}
		}
	};

	const getDataset = () => {
		if (checkedDataset == 'season') {
			return seasonAverages;
		} else if (checkedDataset == 'alltime') {
			return alltimeAverages;
		} else {
			return positionAverages;
		}
	};

	const toggleHighlight = () => {
		if (highlightZones) {
			toggleRegions(1, 1);
			toggleRegions(1, 2);
		} else {
			toggleRegions(0, 1);
			toggleRegions(0, 2);
		}

		animateShootingZones(true);
	};

	const toggleRegions = (toggle: number, target: number) => {
		for (let i = 0; i < zoneRegions.length; i++) {
			zoneRegions[i][target] = toggle;
		}
	};

	const addFilterTooltip = (event: MouseEvent, index: number) => {
		if (mobileScreen) {
			return;
		}

		let target = event.target;
		let element = target as HTMLLabelElement;
		let left = element.getBoundingClientRect().x;
		let height = element.getBoundingClientRect().y - 40 + innerScrollY;

		let tooltipText = document.createElement('p');
		let newDivElement = document.createElement('div');

		tooltipText.classList.add('courtTooltipText');
		tooltipText.classList.add('text-md');
		tooltipText.textContent = filters[index].tooltip;

		newDivElement.classList.add('courtTooltip');
		newDivElement.classList.add('border');
		newDivElement.classList.add('rounded');
		newDivElement.classList.add('px-1');
		newDivElement.classList.add('py-1');
		newDivElement.style.left = left + 'px';
		newDivElement.style.top = height + 'px';
		newDivElement.appendChild(tooltipText);

		element.after(newDivElement);
	};

	const removeFilterTooltip = (event: MouseEvent) => {
		let target = event.target;
		let element = target as HTMLLabelElement;
		let parent = element.parentNode!;

		let div = element.nextSibling;
		if (div) {
			parent.removeChild(div);
		}
	};
</script>

<svelte:window bind:scrollY={innerScrollY} bind:innerWidth bind:innerHeight />

<div class="flex flex-col">
	<div class="flex flex-row justify-between pb-2 px-2 md:px-0 gap-2 md:gap-0">
		<div class="flex flex-row flex-wrap gap-2 filter md:my-auto">
			{#each filters as filter, i}
				<div class="z-0">
					<input
						id={'court-filter-' + i + 1}
						type="radio"
						value={filter.value}
						bind:group={checkedDataset}
					/>
					<label
						for={'court-filter-' + i + 1}
						class="border rounded px-2 py-1 z-10"
						onmouseenter={(e) => {
							addFilterTooltip(e, i);
						}}
						onmouseleave={(e) => {
							removeFilterTooltip(e);
						}}>{filter.text}</label
					>
				</div>
			{/each}
		</div>
		{#if loaded}
			<div class="flex flex-row gap-2 dropbox border rounded pl-2">
				<label for="seasons" class="text-md my-auto">Season:</label>
				<select
					id="seasons"
					class="md:py-2 px-1 md:px-2 md:pe-2 text-md"
					bind:value={selectedSeason}
				>
					{#each seasons as season}
						<option value={season}>{season}</option>
					{/each}
				</select>
			</div>
		{/if}
	</div>

	<div class="relative md:mx-0 mx-auto" style="width: {courtWidth}; height: {courtHeight};">
		<canvas bind:this={canvas} width={courtWidth} height={courtHeight} class="z-0"> </canvas>
		<canvas
			bind:this={outlineCanvas}
			width={courtWidth}
			height={courtHeight}
			class="absolute top-0 left-0 z-10"
		>
		</canvas>
		<canvas
			onmouseenter={(_) => handleMouseEnter()}
			onmousemove={handleMouse}
			onmouseleave={(_) => handleMouseExit()}
			ontouchstart={handleTouch}
			bind:this={toolTipCanvas}
			width={courtWidth}
			height={courtHeight}
			class="absolute top-0 left-0 z-20"
		>
		</canvas>
	</div>
	<div class="pt-2 px-2 md:px-0">
		<div class="flex flex-row toggle justify-between">
			<input
				id="checkbox-1"
				type="checkbox"
				bind:checked={highlightZones}
				onchange={() => {
					toggleHighlight();
				}}
			/>
			<label for="checkbox-1" class="my-auto border rounded px-2 py-1">
				<span class="text-xl">
					{#if highlightZones}
						<Fa icon={faCheck} class="inline-block pr-2 text-lime-500" />
					{:else}
						<Fa icon={faX} class="inline-block pr-2 text-red-600" />
					{/if}
				</span><span class="align-text-bottom text-center">Highlight Zones</span>
			</label>
			<input
				id="checkbox-2"
				type="checkbox"
				bind:checked={showInformation}
				onchange={() => {
					animateShootingZones(true);
				}}
			/>
			<label for="checkbox-2" class="my-auto border rounded px-2 py-1">
				<span class="text-2xl text-center">
					<Fa icon={faInfoCircle} />
				</span>
			</label>
		</div>
	</div>
</div>

<style>
	@media (min-device-width: 320px) and (max-device-width: 680px) {
		canvas {
			border: solid 1px white;
			width: 360px;
			height: 346px;
		}

		.dropbox {
			height: 35px;
		}
	}

	canvas {
		border: solid 1px white;
	}

	label {
		font-family: 'Inter', sans-serif;
		color: white;
	}

	.filter input[type='radio']:checked + label {
		border-bottom: 3px solid white;
	}

	.filter input[type='radio'] + label {
		cursor: pointer;
		display: inline-block;
		background-color: #343436;
		-webkit-touch-callout: none; /* iOS Safari */
		-webkit-user-select: none; /* Safari */
		-khtml-user-select: none; /* Konqueror HTML */
		-moz-user-select: none; /* Old versions of Firefox */
		-ms-user-select: none; /* Internet Explorer/Edge */
		user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
	}

	.filter input[type='radio'] + label:hover {
		background-color: #707070;
	}

	.filter input[type='radio'] {
		display: none;
	}

	.toggle input[type='checkbox'] {
		display: none;
	}

	.toggle input[type='checkbox'] + label {
		cursor: pointer;
		display: inline-block;
		background-color: #343436;
		-webkit-touch-callout: none; /* iOS Safari */
		-webkit-user-select: none; /* Safari */
		-khtml-user-select: none; /* Konqueror HTML */
		-moz-user-select: none; /* Old versions of Firefox */
		-ms-user-select: none; /* Internet Explorer/Edge */
		user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
	}

	.toggle input[type='checkbox'] + label:hover {
		background-color: #707070;
	}

	.dropbox {
		background-color: #343436;
		color: white;
	}

	.dropbox select {
		font-family: 'Inter', sans-serif;
		background-color: #343436;
		border-left: 1px solid;
	}

	.dropbox select:focus {
		outline: none;
	}

	:global(.courtTooltip) {
		position: absolute;
		background-color: #202020a0;
		z-index: 99;
	}

	:global(.courtTooltipText) {
		color: white;
		font-family: 'Inter', sans-serif;
	}
</style>
