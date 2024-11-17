<script lang="ts">
	import PaginatedTable from './table.svelte';
	import Players from '$lib/assets/mock_players.json';

	let data = {
		players: Players
	};
</script>

<PaginatedTable {data} />
