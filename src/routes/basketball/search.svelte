<script lang="ts">
	let { onAction, clear, playerMappings } = $props();

	import fuzzysort from 'fuzzysort';
	import { onMount } from 'svelte';

	let inputElem: HTMLInputElement;
	let listElem: HTMLUListElement;
	let resultsElem: HTMLDivElement;

	let players: Array<string> = new Array<string>();
	/**
	 * Maps player name into a team and a unique player ID.
	 */
	let playerMapping: Map<string, [string, number]> = new Map<string, [string, number]>();

	let hidden = $state(true);
	let value = $state('');

	let availableOptions: Array<[string, [string, number]]> = $state(
		new Array<[string, [string, number]]>()
	);

	let typingTimeout: NodeJS.Timeout;

	onMount(() => {
		for (var player of playerMappings) {
			playerMapping.set(player.player, [player.tm, player.player_id]);
		}
		players = playerMapping.keys().toArray();

		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	});

	$effect(() => {
		let filteredOptions = getOptions(value);
		inputElem.value = value;

		if (filteredOptions) {
			availableOptions = [...renderOptions(filteredOptions)];
		} else if (!filteredOptions && !hidden) {
			availableOptions = new Array();
		}

		toggleResults(hidden);
	});

	const getOptions = (value: string) => {
		if (value == '' || hidden) {
			return undefined;
		}

		return fuzzysort.go(value, players);
	};

	const renderOptions = (options: Fuzzysort.Results) => {
		if (options.length == 0) {
			return [];
		}

		let result: Array<[string, [string, number]]> = new Array();
		for (var opt of options) {
			let mapping = playerMapping.get(opt.target)!;
			result.push([opt.target, mapping]);
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

	const onClick = (playerId: number) => {
		if (clear) {
			hidden = true;
			value = '';
			availableOptions = new Array();
		}

		onAction(playerId);
	};

	function stopTyping(node: HTMLElement) {
		const handleKeyup = (event: KeyboardEvent) => {
			if (event.target != node) {
				return;
			}

			clearInterval(typingTimeout);
			typingTimeout = setTimeout(() => {
				value = (node as HTMLInputElement).value;
			}, 700);

			if (event.key == 'Enter') {
				clearTimeout(typingTimeout);
				value = (node as HTMLInputElement).value;
			}
		};

		document.addEventListener('keyup', handleKeyup, true);
		return {
			destroy() {
				document.removeEventListener('keyup', handleKeyup, true);
			}
		};
	}

	function hideOnClick(node: HTMLElement) {
		const handleMouseDown = (event: MouseEvent) => {
			const parent = (node as HTMLElement).parentNode!;

			if (!parent.contains(event.target as HTMLElement)) {
				hidden = true;
			}

			if (typingTimeout) {
				clearInterval(typingTimeout);
				value = (node as HTMLInputElement).value;
			}
		};

		document.addEventListener('mousedown', handleMouseDown, true);
		return {
			destroy() {
				document.removeEventListener('mousedown', handleMouseDown, true);
			}
		};
	}
</script>

<div id="search-field">
	<label for="search"></label>
	<input
		id="search"
		type="text"
		bind:this={inputElem}
		onfocus={() => (hidden = false)}
		autocomplete="off"
		placeholder="Search for a player.."
		use:stopTyping
		use:hideOnClick
	/>
	<div id="search-results" class="hidden" bind:this={resultsElem}>
		<ul class="list disable-scrollbars" bind:this={listElem}>
			{#each availableOptions as option}
				<button
					onclick={(_) => {
						onClick(option[1][1]);
					}}
				>
					<li>
						<div class="flex flex-box items-center">
							<span style="width:87%;">{option[0]}</span>
							<span class="subtext text-sm">{option[1][0]}</span>
						</div>
					</li>
				</button>
			{/each}
			{#if value != '' && availableOptions.length == 0}
				<li>No player found.</li>
			{/if}
		</ul>
	</div>
</div>

<style>
	@media (min-device-width: 320px) and (max-device-width: 680px) {
		#search-field > input {
			padding: 0;
			width: 100%;
			background: transparent;
			color: white;
			font-family: 'Inter', sans-serif;
		}
	}

	@media (min-device-width: 680px) {
		#search-field > input {
			width: 100%;
			padding-left: 14px;
			background: transparent;
			color: white;
			font-family: 'Inter', sans-serif;
		}
	}

	.hidden {
		display: none;
	}

	li {
		color: white;
		font-family: 'Inter', sans-serif;
	}

	#search-field {
		z-index: 100;
		max-width: 100%;
		min-width: 250px;
	}

	#search-field > input::placeholder {
		color: white;
	}

	#search-field > input:focus {
		outline: none;
	}

	#search-results {
		position: absolute;
		background-color: #343436;
		border-top: solid 1px black;
		z-index: 101;
		width: 100%;
		max-width: 250px;
		max-height: 250px;
		overflow-y: hidden;
		-webkit-box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.5);
		-moz-box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.5);
		box-shadow: 0px 3px 3px 0px rgba(0, 0, 0, 0.5);
	}

	ul > button {
		width: 100%;
		text-align: left;
	}

	.list {
		max-height: 300px;
		overflow-y: auto;
	}

	.list li {
		padding: 2px 14px;
	}

	.list li:hover,
	.list li:focus {
		background-color: #202020;
	}

	.subtext {
		color: rgba(255, 255, 255, 0.5);
	}

	.disable-scrollbars::-webkit-scrollbar {
		background: transparent; /* Chrome/Safari/Webkit */
		width: 0px;
	}

	.disable-scrollbars {
		scrollbar-width: none; /* Firefox */
		-ms-overflow-style: none; /* IE 10+ */
	}
</style>
