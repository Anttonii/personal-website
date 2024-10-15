<script>
	import { page } from '$app/stores';
</script>

<div class="flex error-container justify-center align-center flex-col text-center gap-4 m-auto">
	<h1 class="text-3xl text-white">{$page.status} {$page.error?.message}</h1>
	<h2 class="text-2xl text-white">Whoops, return back to frontpage <a href="/">here.</a></h2>
</div>

<style>
	.error-container {
		width: 75%;
		height: 50%;
	}

	a {
		text-decoration-line: underline;
	}
</style>
