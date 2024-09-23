<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import { slide, fade } from 'svelte/transition';

	import SocialIcons from '@rodneylab/svelte-social-icons';
	import { SyncLoader } from 'svelte-loading-spinners';

	let list: HTMLUListElement;
	let items: NodeListOf<HTMLLIElement>;
	let triangle: HTMLElement;
	let outerTriangle: HTMLElement;
	let currentIndex = 0;
	let expanded = [false, false, false, false];
	let expandedDivs: Array<HTMLDivElement | undefined> = [
		undefined,
		undefined,
		undefined,
		undefined
	];
	let loaded = false;
	let initialLi: HTMLLIElement;

	let degree = 0;
	let changeDirection = 1;
	let generatedGradient: string;

	let animatedGradient = setInterval(() => {
		let degreeChange = Math.PI / 120;

		degree += degreeChange;
		// if (changeDirection == 1) {
		// 	if (degree >= 2 * Math.PI) {
		// 		changeDirection = -1;
		// 	}
		// } else {
		// 	degree -= degreeChange;
		// 	if (degree < 0) {
		// 		changeDirection = 1;
		// 	}
		// }

		generatedGradient = `linear-gradient(${degree}deg, #ef5350,#f48fb1, #7e57c2,#2196f3,#26c6da,#43a047,#eeff41,#f9a825,#ff5722)`;
	}, 16.67);

	afterUpdate(() => {
		loaded = true;
	});

	function on_key_down(event: KeyboardEvent) {
		if (event.repeat) return;

		switch (event.key) {
			case 'ArrowUp':
				currentIndex = currentIndex - 1;
				if (currentIndex === -1) {
					currentIndex = items.length - 1;
				}
				moveTriangle(currentIndex);
				event.preventDefault();
				break;
			case 'ArrowDown':
				currentIndex = currentIndex + 1;
				if (currentIndex === items.length) {
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
		let items = list.querySelectorAll('li');
		if (triangle.parentNode && outerTriangle.parentNode) {
			let link = items[index].querySelector('button');
			if (link) {
				items[index].insertBefore(triangle.parentNode.removeChild(triangle), link);
				items[index].insertBefore(outerTriangle.parentNode.removeChild(outerTriangle), link);
				currentIndex = index;
			}
		}
	}

	function onButtonClick(index: number): void {
		expanded[index] = !expanded[index];

		let expandedDiv = expandedDivs[index];
		if (expandedDiv) {
			expandedDiv.scrollIntoView({ behavior: 'smooth', inline: 'end' });
		}
	}
</script>

<svelte:window on:keydown={on_key_down} />

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
			<h2 class="font-bold text-5xl text-center tracking-wider text-white">Anttoni Koivu</h2>
			<nav>
				<ul bind:this={list} class="flex flex-col gap-4 justify-center list-container">
					<li class="menu-item text-xl" bind:this={initialLi}>
						<span bind:this={triangle} class="triangle" />
						<span bind:this={outerTriangle} class="outertriangle" />

						<button on:mouseenter={() => moveTriangle(0)} on:click={() => onButtonClick(0)}
							>About Me</button
						>
					</li>
					<div class="m-auto">
						{#if expanded[0]}
							<div
								transition:slide={{ duration: 1000 }}
								class="transition-div items-start text-white"
								bind:this={expandedDivs[0]}
							>
								<p class="content text-sm tracking-tight">
									Hi! I'm a 24 year old software developer located in Finland. I enjoy building
									software and solving problems. I'm mostly interested in full-stack development,
									but excel more in backend than frontend development.
									<br />
									<br />
									I am passionate about weightlifting and video games.
								</p>
							</div>
						{/if}
					</div>
					<li class="menu-item text-xl">
						<button on:mouseenter={() => moveTriangle(1)} on:click={() => onButtonClick(1)}
							>Projects</button
						>
					</li>
					<div class="m-auto">
						{#if expanded[1]}
							<div
								transition:slide={{ duration: 1000 }}
								class="transition-div items-start text-white"
								bind:this={expandedDivs[1]}
							>
								<div class="content">
									<h2 class="pb-3 link-text">
										<a href="/games"
											>Web Games<img
												src="/images/link-w.png"
												class="inline-flex align-baseline ml-2"
												width="16"
												alt="link"
											/></a
										>
									</h2>
									<h2 class="pb-3">
										Suikagame
										<a
											href="https://github.com/Anttonii/suikagame"
											class="link-text"
											target="_blank"
											>[Github]<img
												src="/images/link-w.png"
												class="inline-flex align-baseline"
												width="16"
												alt="link"
											/></a
										>
									</h2>
									<p class="text-sm tracking-tight">
										An implementation of a popular Japanese arcade game written in C++ using SDL2
										and Box2D.
									</p>
								</div>
								<div class="divider"></div>
								<div class="content">
									<h2 class="pb-3">
										customizable-lootbags <a
											href="https://github.com/Anttonii/customizable-lootbags"
											class="link-text"
											target="_blank"
											>[Github]<img
												src="/images/link-w.png"
												class="inline-flex align-baseline"
												width="16"
												alt="link"
											/></a
										>
									</h2>
									<p class="text-sm tracking-tight">
										A commissioned Minecraft mod that implements lootbags as mob drops. Opening the
										lootbags give the player randomized loot based on configuration. Written in
										Java.
									</p>
								</div>
							</div>
						{/if}
					</div>
					<li class="menu-item text-xl">
						<button on:mouseenter={() => moveTriangle(2)} on:click={() => onButtonClick(2)}
							>Education</button
						>
					</li>
					<div class="m-auto">
						{#if expanded[2]}
							<div
								transition:slide={{ duration: 1000 }}
								class="transition-div items-start text-white"
								bind:this={expandedDivs[2]}
							>
								<div class="content">
									<h2>Masters of Computer Science</h2>
									<div class="flex flex-wrap">
										<div class="w-full basis-2/3">
											<h4 class="pt-1 relative"><b>Aalto</b></h4>
										</div>
										<div class="w-full basis-1/3">
											<h4 class="pt-1 relative"><b>2024 - 2026</b></h4>
										</div>
									</div>
									<p class="text-sm pt-2 tracking-tight">
										- Currently enrolled to study Machine Learning, Data Science and Artificial
										Intelligence as major in Aalto. <br />
									</p>

									<div class="divider pt-4"></div>

									<h2 class="pt-4">Bachelors of Computer Science</h2>
									<div class="flex flex-wrap">
										<div class="w-full basis-2/3">
											<h4 class="pt-1 relative"><b>Aalto</b></h4>
										</div>
										<div class="w-full basis-1/3">
											<h4 class="pt-1 relative"><b>2021 - 2024</b></h4>
										</div>
									</div>
									<p class="text-sm pt-2 tracking-tight">
										- Wrote my Bachelors thesis about 3SUM and subset sum problems. <br />
										- Minor in Bioinformation Technology.
									</p>
								</div>
							</div>
						{/if}
					</div>
					<li class="menu-item text-xl">
						<button on:mouseenter={() => moveTriangle(3)} on:click={() => onButtonClick(3)}
							>Contact</button
						>
					</li>
					<div class="m-auto">
						{#if expanded[3]}
							<div
								transition:slide={{ duration: 1000 }}
								class="transition-div items-start text-white"
								bind:this={expandedDivs[3]}
							>
								<div class="flex flex-row flex-wrap">
									<div
										class="flex flex-row align-middle relative w-1/4 justify-center contact-icon"
									>
										<SocialIcons
											id="icon"
											network="linkedin"
											width="32"
											height="32"
											fgColor="#ffffff"
										/>
										<a
											href="https://www.linkedin.com/in/anttoni-koivu-a55070230/"
											target="_blank"
											class="pt-1 pl-2"
										>
											<span class="icon-text"> Anttoni Koivu </span>
										</a>
									</div>
									<div
										class="flex flex-row align-middle relative w-1/4 justify-center contact-icon"
									>
										<SocialIcons
											id="icon"
											network="github"
											width="32"
											height="32"
											fgColor="#000000"
											bgColor="#ffffff"
										/>
										<a href="https://github.com/Anttonii" target="_blank" class="pt-1 pl-2"
											>Anttonii
										</a>
									</div>
									<div
										class="flex relative w-1/4 flex-row align-middle justify-center contact-icon"
									>
										<SocialIcons
											id="icon"
											network="discord"
											width="32"
											height="32"
											fgColor="#ffffff"
										/>
										<span class="pt-1 pl-2">Anttonii</span>
									</div>
									<div
										class="flex flex-row align-middle relative w-1/4 justify-center contact-icon"
									>
										<SocialIcons
											id="icon"
											network="telegram"
											width="32"
											height="32"
											fgColor="#ffffff"
										/>
										<span class="pt-1 pl-2"> Anttoniii </span>
									</div>
								</div>
							</div>
						{/if}
					</div>
				</ul>
			</nav>
		</div>
	{/if}
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

	a > span:hover {
		text-decoration: underline;
	}

	.github-link {
		transition: all 0.1s ease-out;
	}

	.contact-icon {
		padding: 0.75rem 0px 0.75rem 0px;
		transition: all 0.2s ease-out;
	}
	.contact-icon:hover {
		background-color: gray;
		transition: all 0.2s ease-in;
	}

	.link-text:hover {
		background: linear-gradient(
			to right,
			#ef5350,
			#f48fb1,
			#7e57c2,
			#2196f3,
			#26c6da,
			#43a047,
			#eeff41,
			#f9a825,
			#ff5722
		);
		background-clip: calc();
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-size: 800% 800%;

		-webkit-animation: AnimationName 10s ease infinite;
		-moz-animation: AnimationName 10s ease infinite;
		animation: AnimationName 10s ease infinite;
		transition: all 0.1s ease-in;
	}

	@-webkit-keyframes AnimationName {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}
	@-moz-keyframes AnimationName {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}
	@keyframes AnimationName {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}
</style>
