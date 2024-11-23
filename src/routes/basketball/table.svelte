<script lang="ts">
	import { onMount } from 'svelte';
	import type { PlayerData } from './types';

	import Fa from 'svelte-fa';
	import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';

	let { playerData, teamsData } = $props();

	const tableColumns = [
		{
			text: 'ID',
			key: 'player_id'
		},
		{
			text: 'Season',
			key: 'season'
		},
		{
			text: 'Team',
			width: '220',
			key: 'tm'
		},
		{
			text: 'GP',
			key: 'g'
		},
		{
			text: 'MP',
			key: 'mp'
		},
		{
			text: 'PTS',
			key: 'pts'
		},
		{
			text: 'DRB',
			key: 'drb'
		},
		{
			text: 'ORB',
			key: 'orb'
		},
		{
			text: 'AST',
			key: 'ast'
		}
	];
	const sortableColumns = new Array('GP', 'MP', 'PTS', 'DRB', 'ORB', 'AST');

	const filters = [
		{
			value: 'season',
			text: 'Season'
		},
		{
			value: 'pg',
			text: 'Per Game'
		}
	];

	const teamNamesMap = new Map<string, string>();

	let innerWidth: number = $state(0);
	let innerHeight: number = $state(0);

	let teamNames: string[] = $state([]);
	// Whether or not the user is on mobile, checked by looking whether or not the width is below 640px.
	let mobileScreen: boolean = $state(false);
	let namesShortened: boolean = $state(false);
	let loading: boolean = $state(false);

	let tableFilter: string = $state('season');
	let lastTableFilter: string = 'season';

	let sortSelected: [string, boolean] = $state(['', false]);
	let currentlySorted: HTMLElement | undefined;

	let tableData: Array<PlayerData> | undefined = $state();

	onMount(() => {
		tableData = playerData;

		for (var mapping of teamsData) {
			teamNamesMap.set(mapping.abbreviation, mapping.teamName);
			teamNamesMap.set(mapping.teamName, mapping.abbreviation);
		}

		loading = true;

		window.addEventListener('resize', resize);
		return {
			destroy() {
				window.removeEventListener('resize', resize, true);
			}
		};
	});

	$effect(() => {
		let temp: string[] = [];
		for (const season of playerData) {
			temp.push(namesShortened ? season.tm : teamNamesMap.get(season.tm) || '');
		}
		teamNames = [...temp];

		if (lastTableFilter != tableFilter) {
			changeTableMode();
		}
	});

	const resize = () => {
		mobileScreen = innerWidth <= 640;

		if (mobileScreen && !namesShortened) {
			teamNames = teamNames.map((elem) => teamNamesMap.get(elem) || '');
			namesShortened = true;
		}

		if (!mobileScreen && namesShortened) {
			teamNames = teamNames.map((elem) => teamNamesMap.get(elem) || '');
			namesShortened = false;
		}
	};

	const getSeason = (season: number) => {
		return (season - 1).toString() + '/' + season.toString();
	};

	const toggleHighlight = (event: MouseEvent, index: number, toggle: boolean) => {
		let elems: HTMLElement[] = [];

		let target = event.target as HTMLTableElement;
		elems.push(target);

		let table = target.parentElement?.parentElement?.parentElement;
		let rows = table?.querySelector('tbody')?.querySelectorAll('tr');
		if (!rows) {
			return;
		}

		for (let row of rows) {
			let cells = row.querySelectorAll('td');

			if (cells) {
				elems.push(cells.item(index));
			}
		}

		for (let e of elems) {
			if (toggle) {
				e.classList.add('highlight');
			} else {
				e.classList.remove('highlight');
			}
		}
	};

	const changeTableMode = () => {
		switch (tableFilter) {
			case 'season':
				tableData = [...playerData];
				break;
			case 'pg':
				if (!tableData) {
					return;
				}

				for (var i = 0; i < tableData.length; i++) {
					tableData[i].mp = Number((playerData[i].mp / playerData[i].g).toFixed(1));
					tableData[i].pts = Number((playerData[i].pts / playerData[i].g).toFixed(1));
					tableData[i].drb = Number((playerData[i].drb / playerData[i].g).toFixed(1));
					tableData[i].orb = Number((playerData[i].orb / playerData[i].g).toFixed(1));
					tableData[i].ast = Number((playerData[i].ast / playerData[i].g).toFixed(1));
				}
				break;
		}

		lastTableFilter = tableFilter;
	};

	const onSort = (event: MouseEvent, ascending: boolean, key: string) => {
		let target = event.target as HTMLButtonElement;

		if (currentlySorted) {
			currentlySorted.classList.remove('text-lime-500');
		}

		if (sortSelected[0] == key && sortSelected[1] == ascending) {
			sortSelected = ['', false];
			currentlySorted = undefined;
		} else {
			sortSelected = [key, ascending];
			currentlySorted = target;
		}

		if (currentlySorted) {
			currentlySorted.classList.add('text-lime-500');
		}

		sortTable();
	};

	const sortTable = () => {
		let sortedKey = sortSelected[0];
		let ascending = sortSelected[1];

		if (sortedKey == '') {
			sortedKey = 'season';
			ascending = true;
		}

		if (!tableData) {
			return;
		}

		const arrayVal = tableData[0];
		const keys = Object.keys(arrayVal) as Array<keyof typeof arrayVal>;

		let sorted = [...$state.snapshot(tableData)];
		sorted.sort((a, b) => {
			let returnValue = 1;

			keys.forEach((key) => {
				if (key == sortedKey) {
					const aValue: any = a[key];
					const bValue: any = b[key];

					if (typeof aValue === 'number' && typeof bValue === 'number') {
						if (ascending) {
							returnValue = aValue > bValue ? 1 : -1;
						} else {
							returnValue = aValue < bValue ? 1 : -1;
						}
					}
				}
			});
			return returnValue;
		});
		tableData = [...sorted];
	};
</script>

<svelte:window bind:innerHeight bind:innerWidth />

<div class="flex flex-col table-container gap-2">
	<div class="flex flex-row filter gap-1">
		{#each filters as filter, i}
			<input
				id={'table-filter-' + i + 1}
				type="radio"
				value={filter.value}
				bind:group={tableFilter}
			/>
			<label for={'table-filter-' + i + 1} class="border rounded px-2 py-1">{filter.text}</label>
		{/each}
	</div>
	{#if loading && tableData}
		<table class="border-collapse table-shadow">
			<thead>
				<tr>
					{#each tableColumns as column, i}
						<th
							scope="row"
							onmouseenter={(e) => toggleHighlight(e, i, true)}
							onmouseleave={(e) => toggleHighlight(e, i, false)}
							style={column.width ? 'width: ' + column.width + 'px;' : ''}
						>
							{#if !sortableColumns.includes(column.text)}
								<span>{column.text}</span>
							{:else}
								<div class="flex flex-row justify-between">
									<span class="self-center">{column.text}</span>

									<div class="flex flex-col">
										<button onclick={(e) => onSort(e, false, column.key)}>
											<span class="sort-up"><Fa icon={faSortUp} translateY={0.35} /></span>
										</button>
										<button onclick={(e) => onSort(e, true, column.key)}>
											<span class="sort-down"><Fa icon={faSortDown} translateY={-0.35} /></span>
										</button>
									</div>
								</div>
							{/if}
						</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each tableData as player, i}
					<tr class="data-table">
						<td class="">{player.player_id}</td>
						<td class="">{getSeason(player.season!)}</td>
						<td class="">{teamNames[i]}</td>
						<td class="text-right">{player.g}</td>
						<td class="text-right">{player.mp}</td>
						<td class="text-right">{player.pts}</td>
						<td class="text-right">{player.drb}</td>
						<td class="text-right">{player.orb}</td>
						<td class="text-right">{player.ast}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>

<style>
	table {
		background-color: #313131;
		border-right: solid 1px black;
		table-layout: fixed;
		min-width: 100%;
	}

	label {
		font-family: 'Inter', sans-serif;
		color: white;
	}

	.table-container {
		color: white;
		font-family: 'Inter', sans-serif;
		width: 100%;
	}

	.table-shadow {
		-webkit-box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.5);
		-moz-box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.5);
		box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.5);
	}

	tr {
		height: 36px;
	}

	table td {
		padding: 4px 6px;
		border-top: solid 1px black;
	}

	table th {
		padding: 4px 6px;
	}

	th:nth-child(-n + 3) {
		text-align: left;
	}

	th {
		text-align: right;
	}

	thead {
		border-bottom: 1px black;
		-webkit-box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.5);
		-moz-box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.5);
		box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.5);
	}

	.data-table:nth-child(even) {
		background-color: #343436;
	}

	.data-table:nth-child(odd) {
		background-color: #707070;
	}

	.data-table:hover {
		background-color: rgba(0, 0, 0, 0.5);
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

	:global(.highlight) {
		background-color: rgba(0, 0, 0, 0.5);
	}
</style>
