<script lang="ts">
	import { onMount } from 'svelte';
	import { slide, fade } from 'svelte/transition';

	import SocialIcons from '@rodneylab/svelte-social-icons';

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

	onMount(() => {
		items = list.querySelectorAll('li');
	});

	function onKeyDown(event: KeyboardEvent) {
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
	}
</script>

<svelte:window on:keydown={onKeyDown} />

<div class="container mx-auto flex flex-col justify-center items-center">
	<div
		class="flex flex-col justify-start md:justify-center align-middle h-full gap-16 text-white"
		id="main-transition"
	>
		<h2 class="font-bold text-3xl md:text-5xl text-center tracking-wider">Anttoni Koivu</h2>
		<nav>
			<ul bind:this={list} class="flex flex-col gap-4 justify-center">
				<li class="justify-start underline centering md:mx-auto flex text-xl">
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
							class="transition-div items-start"
							bind:this={expandedDivs[0]}
						>
							<p class="content text-sm tracking-tight">
								Hi! I'm a 25 year old software developer located in Finland. I enjoy building
								software and solving problems. I'm mostly interested in full-stack development, but
								excel more in backend than frontend development.
								<br />
								<br />
								I am passionate about weightlifting and video games.
							</p>
						</div>
					{/if}
				</div>
				<li class="justify-start underline centering md:mx-auto flex text-xl">
					<button on:mouseenter={() => moveTriangle(1)} on:click={() => onButtonClick(1)}
						>Projects</button
					>
				</li>
				<div class="m-auto">
					{#if expanded[1]}
						<div
							transition:slide={{ duration: 1000 }}
							class="transition-div items-start"
							bind:this={expandedDivs[1]}
						>
							<div class="content">
								<h2 class="pb-3">
									<a href="/neural" class="link-text"
										>Neural Network<img
											src="/images/link-w.png"
											class="inline-flex align-baseline ml-2"
											width="16"
											alt="link"
										/></a
									>
								</h2>
								<p class="text-sm tracking-tight">
									A neural network built on the backend that guesses which number is drawn onto the
									grid.
								</p>
							</div>
							<div class="divider" />
							<div class="content">
								<h2 class="pb-3">
									<a
										href="https://github.com/Anttonii/barbell-tracking"
										class="link-text"
										target="_blank"
										>Barbell Tracking<img
											src="/images/link-w.png"
											class="inline-flex align-baseline ml-2"
											width="16"
											alt="link"
										/></a
									>
								</h2>
								<p class="text-sm tracking-tight">
									Tracks movement of barbell from a video file and produces plots of data such as
									bar speed and deviation from y-axis. Designed to track the movement pattern in
									movements like squat, bench press and deadlift. Currently work-in-progress.
								</p>
							</div>
							<div class="divider" />
							<div class="content">
								<h2 class="pb-3">
									<a href="https://github.com/Anttonii/suikagame" class="link-text" target="_blank"
										>Suikagame<img
											src="/images/link-w.png"
											class="inline-flex align-baseline ml-2"
											width="16"
											alt="link"
										/></a
									>
								</h2>
								<p class="text-sm tracking-tight">
									An implementation of a popular Japanese arcade game written in C++ using SDL2 and
									Box2D.
								</p>
							</div>
							<div class="divider" />
							<div class="content">
								<h2 class="pb-3">
									<a href="/games" class="link-text"
										>Web Games<img
											src="/images/link-w.png"
											class="inline-flex align-baseline ml-2"
											width="16"
											alt="link"
										/></a
									>
								</h2>
								<p class="text-sm tracking-tight">
									Small web browser games implemented with three.js and svelte.
								</p>
							</div>
						</div>
					{/if}
				</div>
				<li class="justify-start underline centering md:mx-auto flex text-xl">
					<button on:mouseenter={() => moveTriangle(2)} on:click={() => onButtonClick(2)}
						>Education</button
					>
				</li>
				<div class="m-auto">
					{#if expanded[2]}
						<div
							transition:slide={{ duration: 1000 }}
							class="transition-div items-start"
							bind:this={expandedDivs[2]}
						>
							<div class="content">
								<h2>Masters of Computer Science</h2>
								<div class="flex flex-wrap">
									<div class="w-full basis-1/3 md:basis-2/3">
										<h4 class="pt-1 relative">Aalto</h4>
									</div>
									<div class="w-full basis-2/3 md:basis-1/3">
										<h4 class="pt-1 relative">2024 - 2026</h4>
									</div>
								</div>
								<p class="text-sm pt-2 tracking-tight">
									- Currently enrolled to study Machine Learning, Data Science and Artificial
									Intelligence as a masters major in Aalto. <br />
								</p>

								<div class="divider pt-4"></div>

								<h2 class="pt-4">Bachelors of Computer Science</h2>
								<div class="flex flex-wrap">
									<div class="w-full basis-1/3 md:basis-2/3">
										<h4 class="pt-1 relative">Aalto</h4>
									</div>
									<div class="w-full basis-2/3 md:basis-1/3">
										<h4 class="pt-1 relative">2021 - 2024</h4>
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
				<li class="justify-start underline centering md:mx-auto flex text-xl">
					<button on:mouseenter={() => moveTriangle(3)} on:click={() => onButtonClick(3)} class=""
						>Contact</button
					>
				</li>
				<div class="m-auto">
					{#if expanded[3]}
						<div
							transition:slide={{ duration: 1000 }}
							class="transition-div items-start"
							bind:this={expandedDivs[3]}
						>
							<div class="flex md:flex-row flex-wrap">
								<div class="flex contact-item align-middle justify-center contact-icon">
									<SocialIcons network="linkedin" width="32" height="32" fgColor="#ffffff" />
									<a
										href="https://www.linkedin.com/in/anttoni-koivu-a55070230/"
										target="_blank"
										class="pt-1 pl-2 underline"
										>Anttoni Koivu
									</a>
								</div>
								<div class="flex contact-item align-middle justify-center contact-icon">
									<SocialIcons
										network="github"
										width="32"
										height="32"
										fgColor="#000000"
										bgColor="#ffffff"
									/>
									<a href="https://github.com/Anttonii" target="_blank" class="pt-1 pl-2 underline"
										>Anttonii
									</a>
								</div>
								<div class="flex contact-item align-middle justify-center contact-icon">
									<SocialIcons network="discord" width="32" height="32" fgColor="#ffffff" />
									<span class="pt-1 pl-2">Anttonii</span>
								</div>
								<div class="flex contact-item align-middle justify-center contact-icon">
									<SocialIcons network="telegram" width="32" height="32" fgColor="#ffffff" />
									<span class="pt-1 pl-2"> Anttoniii </span>
								</div>
							</div>
						</div>
					{/if}
				</div>
			</ul>
		</nav>
	</div>
</div>

<style>
	@media (min-device-width: 320px) and (max-device-width: 770px) {
		.transition-div {
			min-width: 320px;
			max-width: 440px;
			box-sizing: border-box;
			border: solid 1px white;
			border-radius: 4px;
		}

		nav {
			max-height: 90%;
			min-width: 310px;
			max-width: 450px;
		}

		.link-text {
			text-decoration: underline;
			text-decoration-color: white;
		}

		.contact-item {
			flex: 1 1 50%;
		}

		.contact-item:nth-child(odd) {
			flex: 0 0 50%;
		}
	}

	@media (min-device-width: 770px) {
		.transition-div {
			width: 700px;
			box-sizing: border-box;
			border: solid 1px white;
			border-radius: 4px;
		}

		nav {
			max-height: 90%;
			width: 700px;
		}

		.centering {
			width: 700px;
			padding-left: 38%;
			text-decoration: none;
		}

		.centering > button:hover {
			color: red;
		}

		.contact-item {
			width: 25%;
		}
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
		transform: translate(-22%, 40%);
		clip-path: polygon(0 0, 0% 100%, 100% 50%);
		z-index: 2;
	}

	:global(.outertriangle) {
		height: 16px;
		width: 16px;
		background-color: white;
		transform: translate(-100%, 20%);
		clip-path: polygon(0 0, 0% 100%, 100% 50%);
		z-index: 1;
	}

	.content {
		padding: 10px 20px 10px 20px;
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

		-webkit-animation: TextGradientAnimation 10s ease infinite;
		-moz-animation: TextGradientAnimation 10s ease infinite;
		animation: TextGradientAnimation 10s ease infinite;
		transition: all 0.1s ease-in;
	}

	@-webkit-keyframes TextGradientAnimation {
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

	@-moz-keyframes TextGradientAnimation {
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

	@keyframes TextGradientAnimation {
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

	@-webkit-keyframes fadeIn {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	@-moz-keyframes fadeIn {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	@keyframes fadeIn {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	#main-transition {
		animation: fadeIn 1 ease;
		-webkit-animation: fadeIn 1s ease;
		-moz-animation: 1s fadeIn 1s ease;
	}
</style>
