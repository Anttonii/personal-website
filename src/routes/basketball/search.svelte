<script lang="ts">
	let { playerMappings } = $props();

	import fuzzysort from 'fuzzysort';
	import { onMount } from 'svelte';

	let inputElem: HTMLInputElement;
	let listElem: HTMLUListElement;
	let resultsElem: HTMLDivElement;

	let players: Array<string> = new Array<string>();
	let playerMapping: Map<string, number> = new Map<string, number>();

	let hidden = $state(true);
	let value = $state('');

	let filteredOptions;
	let availableOptions: Array<[string, number]> = $state(new Array<[string, number]>());

	onMount(() => {
		for (var player of playerMappings) {
			playerMapping.set(player.player, player.player_id);
		}
		players = playerMapping.keys().toArray();

		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	});

	$effect(() => {
		filteredOptions = getOptions(value);

		if (filteredOptions) {
			availableOptions = [...renderOptions(filteredOptions)];
		}

		toggleResults(hidden);
	});

	const getOptions = (value: string) => {
		if (value == '') {
			return;
		}

		return fuzzysort.go(value, players);
	};

	const renderOptions = (options: Fuzzysort.Results) => {
		if (options.length == 0) {
			return [];
		}

		let result: Array<[string, number]> = new Array();
		for (var opt of options) {
			result.push([opt.target, playerMapping.get(opt.target)!]);
		}

		return result;
	};

	const handleKeyDown = (event: KeyboardEvent) => {
		if (hidden) {
			return;
		}

		switch (event.key) {
			case 'Escape':
				hidden = true;
				break;
			case 'ArrowDown':
				break;
			case 'ArrowUp':
				break;
		}
	};

	const toggleResults = (toggle: boolean) => {
		if (toggle && !resultsElem.classList.contains('hidden')) {
			resultsElem.classList.add('hidden');
		}

		if (!toggle && resultsElem.classList.contains('hidden')) {
			resultsElem.classList.remove('hidden');
		}
	};
</script>

<div id="search-field">
	<label for="search"></label>
	<input
		id="search"
		type="search"
		bind:value
		bind:this={inputElem}
		onfocus={() => (hidden = false)}
		autocomplete="off"
		placeholder="Search for a player.."
	/>
	<div id="search-results" class="hidden" bind:this={resultsElem}>
		<ul class="list" bind:this={listElem}>
			{#each availableOptions as option}
				<li>
					<a href={'/basketball/' + option[1]}>{option[0]}</a>
				</li>
			{:else}
				<li>No player found.</li>
			{/each}
		</ul>
	</div>
</div>

<style>
	.hidden {
		display: none;
	}

	li,
	a {
		color: white;
		font-family: 'Inter', sans-serif;
	}

	#search-field {
		z-index: 100;
		max-width: 100%;
		min-width: 300px;
	}

	#search-field > input {
		width: 100%;
		padding-left: 14px;
	}

	#search-results {
		position: absolute;
		background-color: grey;
		border: solid 1px white;
		z-index: 101;
		width: 100%;
		max-width: 300px;
	}

	.list {
		max-height: 400px;
		overflow-y: auto;
	}

	.list li {
		padding: 2px 14px;
	}

	.list li:hover,
	.list li:focus {
		background-color: #343436;
	}
</style>
