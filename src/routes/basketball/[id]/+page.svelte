<script lang="ts">
	import Table from '../table.svelte';
	import Court from '../court.svelte';
	import Search from '../search.svelte';

	import SeasonAverages from '$lib/assets/averages_season.json';
	import AlltimeAverages from '$lib/assets/averages_alltime.json';
	import PositionAverages from '$lib/assets/averages_position.json';
	import PlayerMapping from '$lib/assets/players_map.json';
	import TeamMapping from '$lib/assets/teams_map.json';

	let { data } = $props();
</script>

<svelte:head>
	{#await data.player}
		<title>NBA Data</title>
	{:then playerData}
		<title>{playerData[0].player} | NBA Data</title>
	{/await}
</svelte:head>

<div class="bg-color h-full w-full">
	<div class="flex flex-col items-center w-full">
		<div class="container flex flex-col items-center gap-16">
			<Search playerMappings={PlayerMapping} />
			<div class="content flex flex-col gap-8 items-center">
				{#await data.player}
					<h2>Loading player information..</h2>
				{:then playerData}
					<Table {playerData} teamsData={TeamMapping} />
					<Court
						player={playerData}
						seasonAverages={SeasonAverages}
						alltimeAverages={AlltimeAverages}
						positionAverages={PositionAverages}
						teamMappings={TeamMapping}
					/>
				{:catch error}
					<h2>Player information not found.</h2>
					<h2>{error}</h2>
				{/await}
			</div>
		</div>
	</div>
</div>

<style>
	h2 {
		color: white;
		font-family: 'Inter', sans-serif;
		font-size: 24px;
	}

	.container {
		max-width: 1000px;
		width: 100%;
	}

	.content {
		min-width: 900px;
		max-width: 900px;
		width: 100%;
	}

	.bg-color {
		background-color: #202020;
	}
</style>
