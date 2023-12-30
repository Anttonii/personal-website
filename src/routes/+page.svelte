<script lang="ts">
	import { onMount } from "svelte";

	let list: HTMLUListElement
	let triangle: HTMLElement

	onMount(() => {
		let items = list.querySelectorAll('li');

		if(items) {
			if(!triangle) {
				const newEl = document.createElement('span');
				newEl.classList.add('triangle');
				items[0].appendChild(newEl);
				triangle = newEl;
			}

			items.forEach((item) => {
				item.addEventListener('mouseenter', () => {
					if(triangle.parentNode) {
						item.appendChild(triangle.parentNode.removeChild(triangle));
					}
				});
			})
		}
	})
</script>

<div class="container mx-auto flex flex-col justify-center items-center gap-16">
	<h1 class="font-bold text-5xl w-full text-center tracking-tight text-white">Anttoni Koivu</h1>

	<nav>
		<ul bind:this={list} class="flex flex-col gap-8 text-xl">
			<li><a href="/">Home</a></li>
			<li><a href="/projects">Projects</a></li>
			<li><a href="/contact">Contact</a></li>
		</ul>
	</nav>
</div>

<style>
	li {
		color: white;
		display: flex;
		position: relative;
	}

	li:hover {
		color: red;
	}

	:global(.triangle) {
		height: 16px;
		width: 16px;
		background-color: red;
		display: block;
		position: absolute;
		top: 50%;
		left: -16px;
		transform: translate(-50%, -50%);
		clip-path: polygon(0 0, 0% 100%, 100% 50%);
	}
</style>