<script lang="ts">
	import { afterUpdate } from 'svelte';
	import { fade } from 'svelte/transition';

	let loaded = false;

	afterUpdate(() => {
		loaded = true;
	});
</script>

<div class="w-full mx-auto flex flex-col justify-center items-center gap-16">
	<div
		class="flex flex-col justify-center align-middle h-full gap-16"
		transition:fade={{ duration: 1000 }}
	>
		<h2 class="font-bold text-5xl text-center tracking-wider text-white">
			<a href="/">Anttoni Koivu</a>
		</h2>
		<h3 class="font-bold text-xl text-center tracking-wider text-white">
			Unfortunately not yet available..<br />
			Check back in later :)
		</h3>
	</div>
</div>
