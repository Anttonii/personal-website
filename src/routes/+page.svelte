<script lang="ts">
	import { onMount } from "svelte";

	let list: HTMLUListElement
	let items: NodeListOf<HTMLLIElement>
	let triangle: HTMLElement
	let currentIndex = 0

	onMount(() => {
		items = list.querySelectorAll('li');

		if(items) {
			// If triangle doesnt exists, create one.
			if(!triangle) {
				const newEl = document.createElement('span');
				newEl.classList.add('triangle');
				items[0].appendChild(newEl);
				triangle = newEl;
			}

			items.forEach((item, index) => {
				item.addEventListener('mouseenter', () => {
					moveTriangle(index);
				});
			})
		}
	})

	function on_key_down(event: KeyboardEvent) {
		if(event.repeat) return;

		switch(event.key) {
			case 'ArrowUp':
				currentIndex = currentIndex - 1;
				if(currentIndex === -1) {
					currentIndex = list.children.length - 1;
				}
				moveTriangle(currentIndex);
				event.preventDefault();
				break;
			case 'ArrowDown':
				currentIndex = currentIndex + 1;
				if(currentIndex === list.children.length) {
					currentIndex = 0;
				}
				moveTriangle(currentIndex);
				event.preventDefault();
				break;
			case 'a': // menu selector key
				redirectTo(currentIndex);
				event.preventDefault();
				break;
		}
	}

	function moveTriangle(index: number): void {
		if(triangle.parentNode) {
			items[index].appendChild(triangle.parentNode.removeChild(triangle));
			currentIndex = index;
		}
	}

	function redirectTo(index: number): void {
		let ref = items[index].querySelector('a');
		if(ref) {
			window.location.href = ref.href
		}
	}
</script>

<svelte:window on:keydown={on_key_down}/>

<div class="container mx-auto flex flex-col justify-center items-center gap-16">
	<h1 class="font-bold text-5xl w-full text-center tracking-tight text-white">Anttoni Koivu</h1>

	<nav>
		<ul bind:this={list} class="flex flex-col gap-8 text-xl">
			<li><a href="/">Home</a></li>
			<li><a href="/about">About Me</a></li>
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