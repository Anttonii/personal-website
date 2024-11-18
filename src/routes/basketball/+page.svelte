<script lang="ts">
	import PaginatedTable from './table.svelte';
	import Court from './court.svelte';

	import Players from '$lib/assets/mock_players.json';
	import AlltimeAverages from '$lib/assets/averages_season.json';

	let data = {
		players: Players,
		averages: AlltimeAverages
	};
</script>

<div class="flex flex-col gap-8">
	<PaginatedTable {data} />
	<Court {data} />
</div>
