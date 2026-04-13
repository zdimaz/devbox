import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { getNav, getSidebar } from "./nav-helper.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  title: "DevBox",
  description: "Personal knowledge base & dev platform",
  srcDir: resolve(__dirname, "../templates"),
  base: "/devbox/",

  head: [["link", { rel: "icon", href: "/devbox/favicon.ico" }]],

  themeConfig: {
    logo: "📦",

    nav: getNav(),
    sidebar: getSidebar(),

    search: {
      provider: "local",
    },

    socialLinks: [{ icon: "github", link: "https://github.com/zdimaz/devbox" }],

    editLink: {
      pattern: "https://github.com/zdimaz/devbox/edit/master/:path",
      text: "Редактировать на GitHub",
    },

    footer: {
      message: "Built with VitePress",
      copyright: "© 2026 DevBox",
    },
  },
};
