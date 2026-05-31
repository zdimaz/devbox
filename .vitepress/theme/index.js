// .vitepress/theme/index.ts
import DefaultTheme from "vitepress/theme";
import BaseLayout from "./BaseLayout.vue";

import "virtual:uno.css";
import "./styles/theme.css";

export default {
	extends: DefaultTheme,
	Layout: BaseLayout,
};
