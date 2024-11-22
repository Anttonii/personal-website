<script lang="ts">
	let { playerData, teamsData } = $props();

	const tableColumns = [
		{
			text: 'ID'
		},
		{
			text: 'Season'
		},
		{
			text: 'Team',
			width: '220'
		},
		{
			text: 'GP'
		},
		{
			text: 'MP'
		},
		{
			text: 'PTS'
		},
		{
			text: 'DRB'
		},
		{
			text: 'ORB'
		},
		{
			text: 'AST'
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

	$effect(() => {
		for (var mapping of teamsData) {
			teamNamesMap.set(mapping.abbreviation, mapping.teamName);
			teamNamesMap.set(mapping.teamName, mapping.abbreviation);
		}

		let temp: string[] = [];
		for (const season of playerData) {
			temp.push(namesShortened ? season.tm : teamNamesMap.get(season.tm) || '');
		}
		teamNames = temp;

		window.addEventListener('resize', resize);
		loading = true;
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
</script>

<svelte:window bind:innerHeight bind:innerWidth />

<div class="table-container">
	{#if loading}
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
							{column.text}
						</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each playerData as player, i}
					<tr class="data-table">
						<td class="">{player.player_id}</td>
						<td class="">{getSeason(player.season)}</td>
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

	:global(.highlight) {
		background-color: rgba(0, 0, 0, 0.5);
	}
</style>
