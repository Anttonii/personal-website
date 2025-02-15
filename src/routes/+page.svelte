<script lang="ts">
	import Resume from '$lib/assets/AnttoniKoivuResume.pdf';

	import Fa from 'svelte-fa';
	import { faLinkedin, faGithub, faDiscord, faTelegram } from '@fortawesome/free-brands-svg-icons';
	import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

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

<div class="w-full h-full flex">
	<div class="w-full mx-auto flex flex-col justify-center items-center py-4">
		<div
			class="flex flex-col justify-start md:justify-center h-full text-white px-6"
			id="main-transition"
		>
			<h2 class="font-bold text-3xl md:text-5xl text-center tracking-wider">Anttoni Koivu</h2>
			<div class="flex flex-row justify-between px-5 py-4" id="header">
				<a
					download="AnttoniKoivuResume.pdf"
					target="_blank"
					href={Resume}
					class="md:text-xl text-md top-link"
					>Resume<span class="inline-flex pl-2">
						<Fa icon={faUpRightFromSquare} />
					</span>
				</a>
				<a
					download="AnttoniKoivuResume.pdf"
					target="_blank"
					href="https://github.com/Anttonii"
					class="md:text-xl text-md top-link"
					>Github<span class="inline-flex pl-2">
						<Fa icon={faUpRightFromSquare} />
					</span>
				</a>
			</div>
			<nav class="py-12">
				<ul bind:this={list} class="flex flex-col gap-4 justify-center">
					<li class="justify-start underline centering md:mx-auto flex text-xl">
						<span bind:this={triangle} class="triangle"></span>
						<span bind:this={outerTriangle} class="outertriangle"></span>

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
									software and solving problems. I'm especially interested in everything data
									related and am currently studying Machine Learning and Data Science.
									<br />
									<br />
									Outside of programming, I am also passionate about basketball, weightlifting and video
									games.
									<br />
									<br />
									I've also taken a keen interest in competitive programming, you can view my profiles
									here:
								</p>
								<div class="flex md:flex-row justify-center gap-4 pb-2">
									<div class="align-left md:mx-12">
										<a href="https://leetcode.com/u/Anttoni/" target="_blank"><h2>Leetcode</h2></a>
									</div>
									<div class="align-right md:mx-12">
										<a href="https://codeforces.com/profile/Anttonii" target="_blank"
											><h2>Codeforces</h2></a
										>
									</div>
								</div>
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
										<a
											href="https://github.com/Anttonii/archimago-bot"
											class="link-text"
											target="_blank"
											>Archimago<span class="text-md inline-flex align-baseline pl-2">
												<Fa icon={faUpRightFromSquare} />
											</span></a
										>
									</h2>
									<p class="text-sm tracking-tight">
										A discord chat bot that provides data and images of Sorcery TCG. Built for the
										Sorcery TCG Finland discord group.
									</p>
								</div>
								<div class="divider"></div>
								<div class="content">
									<h2 class="pb-3">
										<a href="https://github.com/Anttonii/jaydee" class="link-text" target="_blank">
											Jaydee<span class="text-md inline-flex align-baseline pl-2">
												<Fa icon={faUpRightFromSquare} />
											</span>
										</a>
									</h2>
									<p class="text-sm tracking-tight">
										Scrape and crawl internet with the use of a .json schema. Built to scrape data
										for machine learning related projects.
									</p>
								</div>
								<div class="divider"></div>
								<div class="content">
									<h2 class="pb-3">
										<a
											href="https://github.com/Anttonii/hullifier"
											class="link-text"
											target="_blank"
											>Hullifier<span class="text-md inline-flex pl-2">
												<Fa icon={faUpRightFromSquare} />
											</span>
										</a>
									</h2>
									<p class="text-sm tracking-tight">
										Visualizes convex hull solving algorithms in 2D. Currently working on extending
										functionality to 3D.
									</p>
								</div>
								<div class="divider"></div>
								<div class="content">
									<h2 class="pb-3">
										<a href="/basketball" class="link-text"
											>NBA Stats<span class="text-md inline-flex align-baseline pl-2">
												<Fa icon={faUpRightFromSquare} />
											</span>
										</a>
									</h2>
									<p class="text-sm tracking-tight">
										An interactivate NBA player data aggregate that gives you visual insight into
										how well individual players shoot the ball.
									</p>
								</div>
								<div class="divider"></div>
								<div class="content">
									<h2 class="pb-3">
										<a href="/neural" class="link-text">
											Neural Network<span class="text-md inline-flex align-baseline pl-2">
												<Fa icon={faUpRightFromSquare} />
											</span>
										</a>
									</h2>
									<p class="text-sm tracking-tight">
										A neural network built on the backend that guesses which number is drawn onto
										the grid.
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
					<div class="m-auto pb-4">
						{#if expanded[3]}
							<div
								transition:slide={{ duration: 1000 }}
								class="transition-div items-start"
								bind:this={expandedDivs[3]}
							>
								<div class="flex md:flex-row flex-wrap">
									<div class="flex contact-item align-middle justify-center contact-icon">
										<span class="text-3xl">
											<Fa icon={faLinkedin} />
										</span>
										<a
											href="https://www.linkedin.com/in/anttoni-koivu-a55070230/"
											target="_blank"
											class="pt-1 pl-2 underline"
											>Anttoni Koivu
										</a>
									</div>
									<div class="flex contact-item align-middle justify-center contact-icon">
										<span class="text-3xl">
											<Fa icon={faGithub} />
										</span>
										<a
											href="https://github.com/Anttonii"
											target="_blank"
											class="pt-1 pl-2 underline"
											>Anttonii
										</a>
									</div>
									<div class="flex contact-item align-middle justify-center contact-icon">
										<span class="text-3xl">
											<Fa icon={faDiscord} />
										</span>
										<span class="pt-1 pl-2">Anttonii</span>
									</div>
									<div class="flex contact-item align-middle justify-center contact-icon">
										<span class="text-3xl">
											<Fa icon={faTelegram} />
										</span>
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
</div>

<style>
	@media (min-device-width: 320px) and (max-device-width: 770px) {
		.transition-div {
			min-width: 320px;
			max-width: 440px;
			box-sizing: border-box;
			border: solid 1px white;
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
		padding: 10px 10px 10px 10px;
	}

	.contact-icon {
		padding: 0.75rem 0px 0.75rem 0px;
		transition: all 0.2s ease-out;
	}

	.contact-icon:hover {
		background-color: rgb(109, 109, 109);
		transition: all 0.2s ease-in;
	}

	div#header > a {
		font-family: 'Press Start 2P', sans-serif;
	}

	div > a:hover {
		color: red;
	}

	a.top-link > span {
		font-size: medium;
		vertical-align: text-bottom;
		padding-bottom: 3px;
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

		-webkit-animation: TextGradientAnimation 5s ease infinite;
		-moz-animation: TextGradientAnimation 5s ease infinite;
		animation: TextGradientAnimation 5s ease infinite;
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
