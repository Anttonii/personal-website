<script lang="ts">
	import { goto } from '$app/navigation';

	import Table from '../table.svelte';
	import Court from '../court.svelte';
	import Search from '../search.svelte';

	import SeasonAverages from '$lib/assets/averages_season.json';
	import AlltimeAverages from '$lib/assets/averages_alltime.json';
	import PositionAverages from '$lib/assets/averages_position.json';
	import PlayerMapping from '$lib/assets/players_map.json';
	import TeamMapping from '$lib/assets/teams_map.json';

	let { data } = $props();

	const onSearch = (playerId: number) => {
		goto('/basketball/' + playerId);
	};
</script>

<svelte:head>
	{#await data.player}
		<title>NBA Data</title>
	{:then playerData}
		<title>{playerData[0].player} | NBA Data</title>
	{/await}
</svelte:head>

<nav class="flex pb-4 pt-4 w-full justify-center">
	<div class="flex justify-between align-center">
		<div class="self-end">
			{#await data.player}
				<h2>Loading..</h2>
			{:then playerData}
				<h2>{playerData[0].player}</h2>
			{/await}
		</div>
		<div class="self-center">
			<Search onAction={onSearch} clear={true} playerMappings={PlayerMapping} />
		</div>
	</div>
</nav>
<div class="flex flex-col w-full items-center page pt-12 pb-12">
	<div class="container flex flex-col items-center gap-16">
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
<footer class="flex pb-4 pt-4 w-full justify-center">
	<h2 class="self-end">© Anttoni Koivu 2024</h2>
</footer>

<style>
	h2 {
		color: white;
		font-family: 'Inter', sans-serif;
		font-size: 24px;
	}

	nav {
		background-color: #3d3d3d;
		box-shadow: black 0px 0px 3px;
		position: fixed;
		top: 0px;
	}

	footer {
		background-color: #3d3d3d;
	}

	nav > div {
		max-width: 1100px;
		width: 100%;
	}

	.container {
		max-width: 900px;
		width: 100%;
		margin: 70px 0px 0px 0px;
	}

	.page {
		background-color: #202020;
		min-height: 100%;
	}
</style>
