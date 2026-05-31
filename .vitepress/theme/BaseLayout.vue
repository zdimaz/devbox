<script setup>
import { useData } from "vitepress";
import DefaultTheme from "vitepress/theme";

import AmbientGlow from "./components/AmbientGlow.vue";
import BaseFooter from "./components/BaseFooter.vue";

const { Layout } = DefaultTheme;
const { page, frontmatter } = useData(); // ← frontmatter — это сокращение для page.frontmatter
</script>

<template>
	<Layout>
		<!-- 🌍 ГЛОБАЛЬНО (после футера) -->
		<template #layout-bottom>
			<!-- <div class="size-20 bg-green">
				ГЛОБАЛЬНЫЙ БЛОК (показывается на всех страницах, где frontmatter.showGlobalBlock = true)
			</div> -->
			<AmbientGlow />
		</template>

		<!-- 📄 ТОЛЬКО ДОКА (doc — layout по умолчанию) -->
		<template v-if="!frontmatter.layout || frontmatter.layout === 'doc'" #doc-bottom>
			<!-- <div class="size-20 bg-yellow">
				БЛОК ТОЛЬКО ДЛЯ ДОКОВ (показывается на всех страницах с layout: doc или без указания layout)
			</div> -->
			<BaseFooter />
		</template>

		<!-- 🏠 ТОЛЬКО ГЛАВНАЯ -->
		<template v-if="frontmatter.layout === 'home'" #home-features-after>
			<!-- <div class="size-20 bg-red">БЛОК ТОЛЬКО ДЛЯ ГЛАВНОЙ (показывается только на странице с layout: home)</div> -->
			<BaseFooter />
			<div class="bg-grid bg-repeat bg-[length:60px_60px] fixed inset-0 z-[-1] pointer-events-none"></div>
		</template>

		<template #not-found v-if="page.isNotFound">
			<!-- {{ page }} <br />
			{{ frontmatter.layout === "404" }} <br />
			{{ frontmatter.layout }} <br />
			404 - СТРАНИЦА НЕ НАЙДЕНА -->
		</template>
	</Layout>
</template>
