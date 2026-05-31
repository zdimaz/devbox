/*
  Setup UnoCSS with a custom configuration to enable utility-first styling in the project.
  https://unocss.dev/guide/extracting
  https://medium.com/@cibilex/a-modern-css-engine-all-of-unocss-features-1d2f136ffc4

  Docs classes:
  https://unocss.dev/interactive/
 */

const rem = (px, base = 16) => `${Number(px) / base}rem`;

import {
	defineConfig,
	presetUno,
	// presetAttributify,
	presetIcons,
	transformerDirectives,
	transformerVariantGroup,
} from "unocss";

export default defineConfig({
	transformers: [transformerDirectives(), transformerVariantGroup()],

	safelist: [
		"pb-100",
		// Color classes
		"bg-blue",
		"border-blue",
		"text-blue",
		"bg-teal",
		"border-teal",
		"text-teal",
		"bg-violet",
		"border-violet",
		"text-violet",
		"bg-orange",
		"border-orange",
		"text-orange",
		"bg-yellow",
		"border-yellow",
		"text-yellow",
	],

	presets: [
		presetUno(),
		// presetAttributify(), // trash
		presetIcons({
			scale: 1,
			// warn: true,
			// extraProperties: {
			//   display: 'inline-block',
			//   'vertical-align': 'middle',
			// },
		}),
	],

	shortcuts: {
		// Layout
		"flex-center": "flex items-center justify-center",
		"flex-between": "flex items-center justify-between",
		"flex-col-center": "flex flex-col items-center justify-center",
		// Animation helpers (keyframes defined in keyframes.scss)
		"animate-bg-rainbow": "animate-[bg-rainbow_12s_linear_infinite]",
		"animate-text-rainbow": "animate-[text-rainbow_12s_linear_infinite]",
		// Background patterns
		"bg-grid":
			"[background-image:linear-gradient(var(--bg-line-color)_1px,transparent_1px),linear-gradient(90deg,var(--bg-line-color)_1px,transparent_1px)]",
		"base-rounded": "rounded-6",
		"base-border": "border-2 border-solid",
		"base-bg-dark": "bg-dark-900/50 backdrop-blur-20",
		"base-container": `mx-auto px-4 lg:px-6 xl:max-w-[${rem(1280)}]`,
	},

	theme: {
		breakpoints: {
			sm: rem(480),
			md: rem(768),
			lg: rem(1024),
			// wide: rem(1152),
			xl: rem(1280),
			"2xl": rem(1536),
		},
		// leading-3.5, leading-display, leading-prose, etc. (replaces leading-[1.65] etc.)
		lineHeight: {
			105: "1.05", // large section headings
			165: "1.65", // body / description text
		},
		// tracking-wide, tracking-label, etc. (replaces tracking-[0.08em] etc.)
		letterSpacing: {
			// label: '0.08em', // uppercase labels / mono caps
		},
		// font-sans, font-mono, font-display, font-body (replaces font-[...] etc.)
		fontFamily: {
			mono: "'JetBrains Mono', monospace",
			display: "'Play', sans-serif",
			body: "'Play', sans-serif",
		},
		colors: {
			dark: {
				DEFAULT: "#0c101a",
				950: "#07090f",
				900: "#0c101a",
				800: "#111827",
				700: "#1a2333",
			},
			ink: {
				DEFAULT: "#dde4f0",
				50: "#f0f4ff",
				100: "#dde4f0",
				300: "#9aadc8",
			},
			blue: {
				DEFAULT: "#4d7cfe",
				100: "#c8d8ff",
				700: "#2855d8",
			},
			teal: { DEFAULT: "#00e0bc" },
			orange: { DEFAULT: "#ff6b35" },
			violet: { DEFAULT: "#9d7cfe" },
			red: { DEFAULT: "#ff5f57" },
			pink: { DEFAULT: "#ff3d7f" },
			yellow: { DEFAULT: "#febc2e" },
			amber: { DEFAULT: "#ffb300" },
			green: { DEFAULT: "#28c840" },
		},
	},
});
