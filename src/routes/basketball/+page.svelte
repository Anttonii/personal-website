<script lang="ts">
	import { goto } from '$app/navigation';

	import Fa from 'svelte-fa';
	import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

	import Search from './search.svelte';
	import PlayerMapping from '$lib/assets/players_map.json';
	const cards = [
		{
			name: 'Stephen Curry',
			player_id: 3903,
			team: 'Golden State Warriors',
			position: 'Point Guard',
			player_number: 30
		},
		{
			name: 'LeBron James',
			player_id: 3462,
			team: 'Los Angeles Lakers',
			position: 'Small Forward',
			player_number: 6
		},
		{
			name: 'Nikola Jokic',
			player_id: 4352,
			team: 'Denver Nuggets',
			position: 'Center',
			player_number: 15
		},
		{
			name: 'Shai Gilgeous-Alexander',
			player_id: 4669,
			team: 'Oklahoma City Thunder',
			position: 'Point Guard',
			player_number: 2
		},
		{
			name: 'Luka Doncic',
			player_id: 4653,
			team: 'Dallas Mavericks',
			position: 'Point Guard',
			player_number: 77
		},
		{
			name: 'Joel Embiid',
			player_id: 4416,
			team: 'Philadelphia 76ers',
			position: 'Center',
			player_number: 21
		},
		{
			name: 'Lauri Markkanen',
			player_id: 4535,
			team: 'Utah Jazz',
			position: 'Power Forward',
			player_number: 23
		},
		{
			name: 'Damian Lillard',
			player_id: 4077,
			team: 'Milwaukee Bucks',
			position: 'Point Guard',
			player_number: 0
		},
		{
			name: 'Donovan Mitchell',
			player_id: 4495,
			team: 'Cleveland Cavaliers',
			position: 'Shooting Guard',
			player_number: 45
		}
	];

	const onSearch = (playerId: number) => {
		goto('/basketball/' + playerId);
	};

	// A hacky way to set the body background color to something else than what is defined
	// in app.css.
	function setBackground(node: HTMLBodyElement) {
		node.style.backgroundColor = '#202020';
	}
</script>

<svelte:body use:setBackground />

<svelte:head>
	<title>NBA Data</title>
</svelte:head>

<nav class="flex pb-4 pt-4 w-full justify-center">
	<div class="flex flex-col md:flex-row md:justify-between">
		<div class="min-w-fit self-end mx-auto mb-4 md:mx-0 md:mb-0">
			<h2 class="text-xl md:text-2xl">NBA Stats</h2>
		</div>
		<div class="self-center">
			<Search onAction={onSearch} clear={true} playerMappings={PlayerMapping} />
		</div>
	</div>
</nav>

<div class="flex flex-col w-full items-center page">
	<div class="container px-2 md:px-0 justify-center">
		<div class="flex flex-col content gap-4 rounded">
			<p class="text-lg">
				Welcome to NBA Stats. View your favorite players stats and see how they compare in terms of
				shooting efficiency with interactive visualization.
			</p>
			<div class="flex md:flex-row flex-col gap-6 flex-wrap py-4">
				{#each cards as card}
					<a href={'/basketball/' + card.player_id}>
						<div class="card rounded px-2 py-2">
							<h2 class="text-xl md:text-center pb-2">{card.name}</h2>
							<div class="px-2 pt-2">
								<h3 class="text-md">Team: {card.team}</h3>
								<h3 class="text-md">Position: {card.position}</h3>
								<h3 class="text-md">Number: {card.player_number}</h3>
								<div class="arrow">
									<Fa icon={faArrowRight} class="text-lg" />
								</div>
							</div>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</div>
</div>

<footer class="flex w-full justify-center">
	<h2 class="self-end my-auto">© Anttoni Koivu 2024</h2>
</footer>

<style>
	@media (min-device-width: 320px) and (max-device-width: 680px) {
		nav {
			max-width: 100%;
			padding-left: 8px;
			padding-right: 8px;
			z-index: 20;
		}

		nav > div {
			max-width: 100%;
			min-width: 100%;
		}

		.card {
			width: 100%;
		}
	}

	@media (min-device-width: 680px) {
		nav > div {
			max-width: 1100px;
			width: 100%;
		}

		.container {
			max-width: 960px;
		}

		.card {
			width: 290px;
		}

		.card:hover {
			transform: scale(1.05);
		}
	}

	p,
	h2,
	h3 {
		color: white;
		font-family: 'Inter', sans-serif;
	}

	nav {
		background-color: #3d3d3d;
		box-shadow: black 0px 0px 3px;
		position: fixed;
		top: 0px;
	}

	footer {
		background-color: #3d3d3d;
		height: 5vh;
	}

	nav > div {
		max-width: 1100px;
		width: 100%;
	}

	.container {
		background-color: #202020;
		height: 100%;
		padding-bottom: 10px;
	}

	.content {
		margin-top: 18vh;
		padding: 30px 20px 30px 20px;
		background-color: #3d3d3d;
	}

	.card {
		position: relative;
		box-shadow: 0px 2px 2px 0px black;
		background-color: rgb(54, 54, 54);
	}

	.page {
		min-height: calc(95vh);
	}

	.arrow {
		position: absolute;
		color: white;
		display: flex;
		bottom: 0;
		right: 0;
		padding-right: 10px;
		padding-bottom: 6px;
		transition: 0.2s;
		align-items: center;
		justify-content: center;
	}

	.card:hover .arrow {
		transform: translateX(3px);
	}
</style>
