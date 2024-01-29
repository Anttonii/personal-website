<script lang="ts">
	import { onMount } from "svelte";
	import { slide } from "svelte/transition";
	import SocialIcons from "@rodneylab/svelte-social-icons"

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

						let expandedDiv = item.nextElementSibling
						if(expandedDiv) {
							expandedDiv.scrollIntoView({behavior: 'smooth', inline: 'end'});
						}
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
		items[index].scrollIntoView({behavior: 'smooth', inline: 'end'});
	}
</script>

<svelte:window on:keydown={on_key_down}/>

<div class="container mx-auto flex flex-col justify-center items-center gap-16">
	<h2 class="font-bold text-5xl text-center tracking-wider text-white">Anttoni Koivu</h2>
	<nav>
		<ul bind:this={list} class="flex flex-col gap-4 text-xl justify-center list-container">
			<li class="menu-item">
				<button>About Me</button>
			</li>
			<div class="m-auto">
				{#if expanded[0]}
					<div transition:slide={{duration: 1000}} class="transition-div items-start text-white text-lg">
						<p class="content">
							Hi! I'm a 24 year old software developer located in Finland. I enjoy building software and in general just experimenting in different approaches to solve problems.
						</p>
					</div>
				{/if}
			</div>
			<li class="menu-item">
				<button>Projects</button>
			</li>
			<div class="m-auto">
				{#if expanded[1]}
				<div transition:slide={{duration: 1000}} class="transition-div items-start text-white text-lg">
					<div class="content">
						<h2 class="pb-3">Suikagame <a href="https://github.com/Anttonii/suikagame" class="github-link">[Github]</a></h2>
						<p>
							An implementation of a popular Japanese arcade game written in C++ using SDL2 and Box2D.
						</p>
					</div>
					<div class="divider"></div>
					<div class="content">
						<h2 class="pb-3">customizable-lootbags <a href="https://github.com/Anttonii/suikagame" class="github-link">[Github]</a></h2>
						<p>
							A commissioned Minecraft mod that implements lootbags as mob drops. Opening the lootbags give the player randomized loot based on configuration. Written in Java.
						</p>
					</div>
				</div>
				{/if}
			</div>
			<li class="menu-item">
				<button>Education</button>
			</li>
			<div class="m-auto">
				{#if expanded[2]}
				<div transition:slide={{duration: 1000}} class="transition-div items-start text-white text-lg">
					<div class="content">
						<h2>Masters of Computer Science</h2>
						<div class="flex flex-wrap">
							<div class="w-full basis-2/3">
								<h4 class="text-xl pt-1 relative"><b>Aalto</b></h4>
							</div>
							<div class="w-full basis-1/3">
								<h4 class="text-xl pt-1 relative"><b>2024 - 2026</b></h4>
							</div>
						</div>
						
						<div class="divider pt-4"></div>

						<h2 class="pt-4">Bachelors of Computer Science</h2>
						<div class="flex flex-wrap">
							<div class="w-full basis-2/3">
								<h4 class="text-xl pt-1 relative"><b>Aalto</b></h4>
							</div>
							<div class="w-full basis-1/3">
								<h4 class="text-xl pt-1 relative"><b>2021 - 2024</b></h4>
							</div>
						</div>
						<ul class="list-disc pl-8 pt-2 m-auto">
							<li>
								Wrote my Bachelors thesis about 3SUM and subset sum problems.
							</li>
							<li>
								Minor in Bioinformation Technology.
							</li>
						</ul>
					</div>
				</div>
				{/if}
			</div>
			<li class="menu-item">
				<button>Contact</button>
			</li>
			<div class="m-auto">
				{#if expanded[3]}
				<div transition:slide={{duration: 1000}} class="transition-div items-start text-white text-lg">
					<div class="icon-container">
						<a href="https://www.linkedin.com/in/anttoni-koivu-a55070230/">
							<SocialIcons id="icon" network="linkedin" width="32" height="32" fgColor="#ffffff"/>
							<span class="icon-text">
								Anttoni Koivu
							</span>
						</a>
					</div>
					<div class="icon-container">
						<a href="https://github.com/Anttonii">
							<SocialIcons id="icon" network="github" width="32" height="32" fgColor="#000000" bgColor="#ffffff"/>
							<span class="icon-text">
								Anttonii
							</span>
						</a>
					</div>
					<div class="icon-container">
						<SocialIcons id="icon" network="discord" width="32" height="32" fgColor="#ffffff" />
						<span class="icon-text">
							Anttonii
						</span>
					</div>
					<div class="icon-container">
						<SocialIcons id="icon" network="telegram" width="32" height="32" fgColor="#ffffff" />
						<span class="icon-text">
							Anttoniii
						</span>
					</div>
				</div>
				{/if}
			</div>
		</ul>
	</nav>
</div>

<style>
	.menu-item {
		color: white;
		display: flex;
		position: relative;
		padding-left: 250px;
	}

	.menu-item:hover {
		color: red;
	}

	li > button {
		max-width: 300px;
	}

	.list-wrapper {
		padding: 0px 0px 0px 100px;
	}

	nav {
		max-height: 90%;
		width: 700px;
	}

	.transition-div {
		width: 700px;
		box-sizing: border-box;
		border: solid 1px white;
		border-radius: 4px;
	}

	.divider {
		justify-content: center;
		align-items: center;
		position: relative;
		margin: 5px auto 5px auto;
		max-width: 75%;
		border-bottom: 1px white solid;
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
	
	.content {
		padding: 10px 20px 10px 20px;
	}

	.icon-container {
		padding: 10px 0px 5px 10px;
		position: relative;
	}

	.icon-text {
		margin: 0px 0px 0px 10px;
		position: absolute;
		transform: translateY(10%);
	}

	a > span:hover {
		text-decoration: underline;
	}

	.github-link:hover {
		color: purple;
	}
	
</style>