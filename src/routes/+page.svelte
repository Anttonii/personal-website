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
	<h1 class="font-bold text-5xl text-center tracking-wider text-white">Anttoni Koivu</h1>
	<nav>
		<ul bind:this={list} class="flex flex-col gap-4 text-xl justify-center list-container">
			<li>
				<button>About Me</button>
			</li>
			<div class="wrapper-div">
				{#if expanded[0]}
					<div transition:slide={{duration: 1000}} class="transition-div items-start text-white text-lg">
						<p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse velit orci, pulvinar iaculis erat ut, placerat consectetur ligula. Quisque enim nulla, facilisis in sollicitudin et, vehicula mattis est. Praesent pulvinar ipsum eu consectetur consequat. Quisque a nibh dolor. Vivamus tortor libero, maximus vel ex quis, consectetur tempus dui. Cras tristique sapien diam, in blandit libero sagittis a. Curabitur cursus viverra magna non semper.
	
							Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum urna lectus, molestie eu sapien nec, fermentum suscipit est. Cras tincidunt a quam vel ultrices. Integer lacinia lacus in ex fermentum auctor. Duis urna felis, viverra id rhoncus eu, interdum nec elit. Vestibulum nulla dolor, pharetra vel nibh quis, ultricies hendrerit diam. Aenean ultricies lacus tortor, at vehicula leo vestibulum id. Aenean sit amet finibus ante. Quisque scelerisque elit ac turpis sodales, vitae convallis magna malesuada. Aliquam varius sem nisl, aliquam tincidunt ipsum scelerisque nec. Quisque luctus venenatis felis sit amet posuere. Proin ac magna sed ante dictum maximus. Curabitur non dolor nibh. </p>
						</div>
						{/if}
					</div>
					<li>
						<button>Projects</button>
					</li>
					<div class="wrapper-div">
						{#if expanded[1]}
						<div transition:slide={{duration: 1000}} class="transition-div items-start text-white text-lg">
							<p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse velit orci, pulvinar iaculis erat ut, placerat consectetur ligula. Quisque enim nulla, facilisis in sollicitudin et, vehicula mattis est. Praesent pulvinar ipsum eu consectetur consequat. Quisque a nibh dolor. Vivamus tortor libero, maximus vel ex quis, consectetur tempus dui. Cras tristique sapien diam, in blandit libero sagittis a. Curabitur cursus viverra magna non semper.
			
								Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum urna lectus, molestie eu sapien nec, fermentum suscipit est. Cras tincidunt a quam vel ultrices. Integer lacinia lacus in ex fermentum auctor. Duis urna felis, viverra id rhoncus eu, interdum nec elit. Vestibulum nulla dolor, pharetra vel nibh quis, ultricies hendrerit diam. Aenean ultricies lacus tortor, at vehicula leo vestibulum id. Aenean sit amet finibus ante. Quisque scelerisque elit ac turpis sodales, vitae convallis magna malesuada. Aliquam varius sem nisl, aliquam tincidunt ipsum scelerisque nec. Quisque luctus venenatis felis sit amet posuere. Proin ac magna sed ante dictum maximus. Curabitur non dolor nibh. </p>
					</div>
				{/if}
			</div>
			<li>
				<button>Contact</button>
			</li>
			<div class="wrapper-div">
				{#if expanded[2]}
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
	li {
		color: white;
		display: flex;
		position: relative;
	}

	li:hover {
		color: red;
	}

	nav {
		max-height: 90%;
		width:600px;
	}

	.transition-div {
		width: 600px;
		max-height: 400px;
		height: calc(100% + 20px);
		box-sizing: border-box;
		border: solid 1px white;
		border-radius: 4px;
	}

	.wrapper-div {
		margin: auto;
		padding: auto;
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

	div > p {
		padding: 10px 20px 10px 20px;
	}

	.icon-container {
		padding: 10px 20px 10px 20px;
		position: relative;
	}

	.icon-text {
		margin: 0px 0px 0px 12px;
		position: absolute;
		transform: translateY(10%);
	}

	a > span:hover {
		text-decoration: underline;
	}
	
</style>