import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { getNav, getSidebar } from "./nav-helper.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const base = process.env.CF_PAGES ? "/" : "/devbox/";

export default {
  title: "DDI/DevBox",
  description: "Personal knowledge base & dev platform",
  base,
  srcDir: resolve(__dirname, "../templates"),

  head: [
    ["link", { rel: "icon", href: `${base}favicon.ico` }],
    ["link", { rel: "apple-touch-icon", sizes: "180x180", href: `${base}apple-touch-icon.png` }],
  ],

  themeConfig: {
    logo: "📦",

    nav: getNav(),
    sidebar: getSidebar(),

    search: process.env.ALGOLIA_APP_ID
      ? {
          provider: "algolia",
          options: {
            appId: process.env.ALGOLIA_APP_ID,
            apiKey: process.env.ALGOLIA_SEARCH_KEY,
            indexName: "devbox",
          },
        }
      : { provider: "local" },

    socialLinks: [{ icon: "github", link: "https://github.com/zdimaz/devbox" }],

    editLink: {
      pattern: "https://github.com/zdimaz/devbox/edit/master/:path",
      text: "Редактировать на GitHub",
    },

    footer: {
      message: "Built with VitePress",
      copyright: "© 2026 DDI/DevBox",
    },
  },
};
