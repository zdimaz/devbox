<!-- .vitepress/theme/MyLayout.vue -->
<script setup>
import { VPTeamMembers } from "vitepress/theme";

const members = [
	{
		avatar: "https://avatars.githubusercontent.com/u/34910295?v=4&size=64",
		name: "Dmitrii Dudko",
		title: "Frontend Developer",
		links: [
			{ icon: "github", link: "https://github.com/zdimaz" },
			{ icon: "gmail", link: "mailto:zdimaz.dudko@gmail.com" },
			{ icon: "minutemailer", link: "https://t.me/PRO100SHEKEL" },
		],
	},
];

const navGroups = [
	{
		title: "Справочники",
		links: [
			{
				text: "web.dev (HTML,CSS,JS)",
				link: "https://web.dev/",
				target: "_blank",
			},
			{
				text: "learn.javascript",
				link: "https://learn.javascript.ru/",
				target: "_blank",
			},
			{
				text: "HTML, CSS, JavaScript, Доступность, Рецепты",
				link: "https://learn.javascript.ru/",
				target: "_blank",
			},
		],
	},
];
</script>

<template>
	<footer class="py-10 lg:py-20">
		<div class="base-container">
			<div class="flex flex-col items-start gap-y-6 gap-x-6 lg:gap-x-8 md:flex-row">
				<div class="flex flex-col gap-y-4">
					<VPTeamMembers size="small" :members />
					<Badge type="tip" class="text-center p-0 transition-property-opacity duration-300 hover:(opacity-80)">
						<a href="https://ddi-portfolio.vercel.app/" target="_blank" rel="noreferrer" class="block">
							Портфолио (new)</a
						>
					</Badge>
				</div>

				<nav v-if="navGroups.length > 0" class="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<template v-for="group in navGroups" :key="group.title">
						<div class="c-footer__nav-group">
							<div class="font-bold text-5 mb-4 lg:text-5" v-if="group.title">{{ group.title }}</div>
							<ul class="flex flex-col gap-y-2" v-if="group.links">
								<li v-for="link in group.links" :key="link.link">
									<a
										:href="link.link"
										:target="link.target || '_self'"
										:rel="link.target == '_blank' ? 'noreferrer' : undefined"
										class="inline-flex items-center gap-x-2 text-3 text-[var(--vp-c-brand-1)] hover:(underline opacity-80) lg:text-4"
									>
										{{ link.text }}
									</a>
								</li>
							</ul>
						</div>
					</template>
				</nav>
			</div>
			<!-- <Badge type="info" text="по умолчанию" />
			<Badge type="tip" text="^1.9.0" />
			<Badge type="warning" text="beta" />
			<Badge type="danger" text="осторожно" />
			<p class="message text-center">Built with VitePress and ❤️</p>
			<p class="copyright text-center">© 2026 DDI/DevBox</p> -->
		</div>
	</footer>
</template>
