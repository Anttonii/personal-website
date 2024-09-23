<script lang="ts">
	import { afterUpdate } from 'svelte';
	import { slide, fade } from 'svelte/transition';

	import { SyncLoader } from 'svelte-loading-spinners';

	let loaded = false;

	afterUpdate(() => {
		loaded = true;
	});
</script>

<div class="container mx-auto flex flex-col justify-center items-center gap-16">
	{#if !loaded}
		<div class="flex flex-col justify-center align-middle h-full items-center">
			<h2 class="text-xl text-white">Loading</h2>
			<SyncLoader size="60" color="#FFFFFF" unit="px" />
		</div>
	{:else}
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
	{/if}
</div>
