<script lang="ts">
	import PaginatedTable from './table.svelte';
	import Court from './court.svelte';

	import Players from '$lib/assets/mock_players.json';

	let data = {
		players: Players
	};
</script>

<div class="flex flex-col gap-8">
	<PaginatedTable {data} />
	<Court {data} />
</div>
