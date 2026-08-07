import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { getNav, getSidebar } from "./nav-helper.js";
import UnoCSS from "unocss/vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

const base = process.env.CF_PAGES ? "/" : "/devbox/";

export default {
	lang: "ru-RU",
	title: "DDI/DevBox",
	description: "Personal knowledge base & dev platform",
	base,
	srcDir: resolve(__dirname, "../templates"),

	vite: {
		plugins: [UnoCSS()],
	},

	head: [
		["link", { rel: "icon", href: `${base}favicon.ico` }],
		["link", { rel: "apple-touch-icon", sizes: "180x180", href: `${base}apple-touch-icon.png` }],
		[
			"script",
			{
				type: "module",
				src: "https://static.cloudflareinsights.com/beacon.min.js",
				"data-cf-beacon": JSON.stringify({
					token: "b8cf6ca607384a2daff31cdc3dd02c1",
					spa: true,
				}),
			},
		],
	],

	themeConfig: {
		logo: "📦",

		nav: getNav(),
		sidebar: getSidebar(),

		search: { provider: "local" },

		socialLinks: [{ icon: "github", link: "https://github.com/zdimaz/devbox" }],

		editLink: {
			pattern: "https://github.com/zdimaz/devbox/edit/master/:path",
			text: "Редактировать на GitHub",
		},

		footer: {
			message: "Built with VitePress and ❤️",
			copyright: "© 2026 DDI/DevBox",
		},
		// footer: false, // Отключаем стандартный футер
	},
};
