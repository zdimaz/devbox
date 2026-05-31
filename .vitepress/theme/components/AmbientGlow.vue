<script setup>
const blobs = [
	{
		class: `size-50vh top-0 -right-1/2
        sm:size-150 sm:top-10 sm:right-0
        sm:size-150 sm:top-10 sm:right-0
        lg:size-150 lg:top-10 lg:right-0
        2xl:size-50vw 2xl:top-0 2xl:right-10`,
		color: "#4d7cfe",
	},
	{
		class: `size-50vh bottom-0 -right-1/2
        sm:size-150 sm:bottom-10 sm:right-0
        sm:size-150 sm:bottom-10 sm:right-0
        lg:size-150 lg:bottom-10 lg:right-0
        2xl:size-50vw 2xl:bottom-0 2xl:right-10`,
		color: "#00e0bc",
	},
	{
		class: `size-50vh top-1/2 -transform-translate-y-1/2 -right-1/2
        sm:size-150 sm:top-20 sm:right-0 sm:transform-translate-0
        sm:size-150 sm:top-20 sm:right-0 sm:transform-translate-0
        lg:size-150 lg:top-20 lg:right-0
        2xl:size-50vw 2xl:top-20 2xl:right-10`,
		color: "#9d7cfe",
	},
	{
		class: `size-50vh top-0 -left-1/2
        sm:size-150 sm:top-10 sm:left-0
        sm:size-150 sm:top-10 sm:left-0
        lg:size-150 lg:top-10 lg:left-0
        2xl:size-50vw 2xl:top-0 2xl:left-0`,
		color: "#4d7cfe",
	},
	{
		class: `size-50vh bottom-0 -left-1/2
        sm:size-150 sm:bottom-10 sm:left-0
        sm:size-150 sm:bottom-10 sm:left-0
        lg:size-150 lg:bottom-10 lg:left-0
        2xl:size-50vw 2xl:bottom-0 2xl:left-10`,
		color: "#ff6b35",
	},
];
</script>

<template>
	<div id="AmbientGlow" class="fixed inset-0 pointer-events-none z-0 overflow-hidden min-h-screen min-h-dvh">
		<div
			v-for="(blob, i) in blobs"
			:key="i"
			class="ag-blob"
			:class="blob.class"
			:style="{
				'--blob-color': blob.color,
			}"
		/>
	</div>
</template>

<style scoped>
.dark {
	& .ag-blob {
		@apply opacity-15 lg:opacity-30;
	}
}

.ag-blob {
	@apply absolute blur-20 opacity-08 lg:opacity-08;
	background: radial-gradient(ellipse at center, var(--blob-color) 0%, transparent 68%);
	border-radius: 60% 40% 55% 35% / 40% 60% 35% 55%;

	&:nth-child(1) {
		@screen lg {
			animation: blob-a 14s ease-in-out 0s infinite alternate;
		}
	}
	&:nth-child(2) {
		@screen lg {
			animation: blob-b 11s ease-in-out -5s infinite alternate;
		}
	}
	&:nth-child(3) {
		@screen lg {
			animation: blob-c 16s ease-in-out -9s infinite alternate;
		}
	}
	&:nth-child(4) {
		@screen lg {
			animation: blob-d 13s ease-in-out -3s infinite alternate;
		}
	}
	&:nth-child(5) {
		@screen lg {
			animation: blob-e 10s ease-in-out -7s infinite alternate;
		}
	}
}

@keyframes blob-a {
	0% {
		transform: translate(0, 0) scale(0.85);
		border-radius: 60% 40% 55% 35% / 40% 60% 35% 55%;
	}
	50% {
		transform: translate(140px, -100px) scale(1.1);
		border-radius: 50% 50% 45% 55% / 55% 45% 50% 50%;
	}
	100% {
		transform: translate(240px, -200px) scale(1.25);
		border-radius: 40% 60% 35% 65% / 55% 35% 60% 40%;
	}
}
@keyframes blob-b {
	0% {
		transform: translate(0, 0) scale(0.8);
		border-radius: 40% 60% 35% 65% / 55% 35% 60% 40%;
	}
	50% {
		transform: translate(-120px, 80px) scale(1.2);
		border-radius: 50% 50% 50% 50% / 50% 50% 50% 50%;
	}
	100% {
		transform: translate(-220px, 180px) scale(1.5);
		border-radius: 55% 45% 60% 40% / 35% 65% 40% 60%;
	}
}
@keyframes blob-c {
	0% {
		transform: translate(0, 0) scale(0.8);
		border-radius: 50% 50% 40% 60% / 60% 40% 55% 45%;
	}
	40% {
		transform: translate(160px, 40px) scale(1.05);
		border-radius: 45% 55% 50% 50% / 50% 50% 45% 55%;
	}
	100% {
		transform: translate(200px, 160px) scale(1.2);
		border-radius: 35% 65% 55% 45% / 45% 55% 40% 60%;
	}
}
@keyframes blob-d {
	0% {
		transform: translate(0, 0) scale(0.85);
		border-radius: 30% 70% 60% 40% / 45% 55% 35% 65%;
	}
	50% {
		transform: translate(-100px, -140px) scale(1.1);
		border-radius: 50% 50% 45% 55% / 55% 45% 50% 50%;
	}
	100% {
		transform: translate(-200px, -240px) scale(1.3);
		border-radius: 60% 40% 35% 65% / 60% 40% 65% 35%;
	}
}
@keyframes blob-e {
	0% {
		transform: translate(0, 0) scale(0.8);
		border-radius: 65% 35% 45% 55% / 35% 60% 40% 65%;
	}
	45% {
		transform: translate(120px, -120px) scale(1.15);
		border-radius: 50% 50% 55% 45% / 50% 50% 45% 55%;
	}
	100% {
		transform: translate(180px, -260px) scale(1.6);
		border-radius: 45% 55% 65% 35% / 60% 35% 65% 40%;
	}
}
</style>
