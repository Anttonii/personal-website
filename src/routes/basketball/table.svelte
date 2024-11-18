<script lang="ts">
	let { data } = $props();

	const playerColumns = ['Player ID', 'Season', 'Team', 'GP', 'MP', 'PTS', 'DRB', 'ORB', 'AST'];
	const teamNamesMap = new Map<string, string>([
		['GSW', 'Golden State Warriors'],
		['Golden State Warriors', 'GSW']
	]);

	let innerWidth: number = $state(0);
	let innerHeight: number = $state(0);

	let teamNames: string[] = $state([]);
	// Whether or not the user is on mobile, checked by looking whether or not the width is below 640px.
	let mobileScreen: boolean = $state(false);
	let namesShortened: boolean = $state(false);
	let loading: boolean = $state(false);

	$effect(() => {
		let temp: string[] = [];
		for (const season of data.players) {
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

<div class="w-full">
	{#if loading}
		<table
			class="border-collapse max-w-2xl min-w-full border border-slate-500 table-fixed md:overflow-x-scroll"
		>
			<thead>
				<tr>
					{#each playerColumns as column, i}
						<th
							scope="row"
							onmouseenter={(e) => toggleHighlight(e, i, true)}
							onmouseleave={(e) => toggleHighlight(e, i, false)}
							class="border border-slate-600">{column}</th
						>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each data.players as playerData, i}
					<tr class="data-table">
						<td class="border border-slate-700">{playerData.player_id}</td>
						<td class="border border-slate-700">{getSeason(playerData.season)}</td>
						<td class="border border-slate-700">{teamNames[i]}</td>
						<td class="border border-slate-700">{playerData.g}</td>
						<td class="border border-slate-700">{playerData.mp}</td>
						<td class="border border-slate-700">{playerData.pts}</td>
						<td class="border border-slate-700">{playerData.drb}</td>
						<td class="border border-slate-700">{playerData.orb}</td>
						<td class="border border-slate-700">{playerData.ast}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</div>

<style>
	table {
		color: white;
		font-family: 'Inter', sans-serif;
		background-color: #313131;
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
