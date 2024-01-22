<script lang="ts">
	import { onMount } from "svelte";
	import { quintInOut } from "svelte/easing";
	import { fade, draw } from "svelte/transition";

	let list: HTMLUListElement
	let items: NodeListOf<HTMLLIElement>
	let triangle: HTMLElement
	let outerTriangle: HTMLElement
	let currentIndex = 0
	let expanded = [false, false, false]

	onMount(() => {
		items = list.querySelectorAll('li');

		if(items) {
			const link = items[0].querySelector('button');

			if(!triangle && link) {
				const newEl = document.createElement('span');
				newEl.classList.add('triangle');
				items[0].insertBefore(newEl, link);
				triangle = newEl;
			}

			if(!outerTriangle && link) {
				const newEl = document.createElement('span');
				newEl.classList.add('outertriangle');
				items[0].insertBefore(newEl, link);
				outerTriangle = newEl;
			}

			items.forEach((item, index) => {
				item.addEventListener('mouseenter', () => {
					moveTriangle(index);
				});

				const button = item.querySelector('button');
				if(button) {
					button.addEventListener('click', () => {
						expanded[currentIndex] = !expanded[currentIndex];
					})
				}
			})
		}
	})

	function on_key_down(event: KeyboardEvent) {
		if(event.repeat) return;

		switch(event.key) {
			case 'ArrowUp':
				currentIndex = currentIndex - 1;
				if(currentIndex === -1) {
					currentIndex = items.length - 1;
				}
				moveTriangle(currentIndex);
				event.preventDefault();
				break;
			case 'ArrowDown':
				currentIndex = currentIndex + 1;
				if(currentIndex === items.length) {
					currentIndex = 0;
				}
				moveTriangle(currentIndex);
				event.preventDefault();
				break;
			case 'a':
				expanded[currentIndex] = !expanded[currentIndex];
				event.preventDefault();
				break;
		}
	}

	function moveTriangle(index: number): void {
		if(triangle.parentNode && outerTriangle.parentNode) {
			let link = items[index].querySelector('button');
			if(link) {
				items[index].insertBefore(triangle.parentNode.removeChild(triangle), link);
				items[index].insertBefore(outerTriangle.parentNode.removeChild(outerTriangle), link);
				currentIndex = index;
			}
		}
	}
</script>

<svelte:window on:keydown={on_key_down}/>

<div class="container mx-auto flex flex-col justify-center items-center gap-16">
	<h1 class="font-bold text-5xl w-full text-center tracking-tight text-white">Anttoni Koivu</h1>

	<nav>
		<ul bind:this={list} class="flex flex-col gap-8 text-xl justify-center list-container">
			<li>
				<button>About Me</button>
			</li>
			{#if expanded[0]}
				<div transition:fade={{duration: 300}} class="transition-div items-start text-white text-sm">Hi</div>
			{/if}
			<li>
				<button>Projects</button>
			</li>
			{#if expanded[1]}
				<div transition:fade={{duration: 500}} class="transition-div items-start text-white text-sm">
					Hi
				</div>
			{/if}
			<li>
				<button>Contact</button>
			</li>
			{#if expanded[2]}
				<div transition:fade={{duration: 500}} class="transition-div items-start text-white text-sm">
					Hi and welcome to my website :)
				</div>
			{/if}
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

	.list-container {
		flex-wrap: wrap;
		max-width: 200px;
	}

	.transition-div {
		transition: all 0.3s ease;
		width: 300px;
	}

	:global(.triangle) {
		height: 12px;
		width: 12px;
		background-color: red;
		display: block;
		top: 50%;
		transform: translate(-22%, 40%);
		clip-path: polygon(0 0, 0% 100%, 100% 50%);
		z-index: 2;
		position: relative;
	}
	
	:global(.outertriangle) {
		height: 16px;
		width: 16px;
		background-color: white;
		display: block;
		top: 50%;
		transform: translate(-100%, 20%);
		clip-path: polygon(0 0, 0% 100%, 100% 50%);
		z-index: 1;
		position: relative;
	}
	
</style>