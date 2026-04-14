import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { getNav, getSidebar } from "./nav-helper.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  title: "DDI/DevBox",
  description: "Personal knowledge base & dev platform",
  base: "/devbox/",
  srcDir: resolve(__dirname, "../templates"),

  head: [
    ["link", { rel: "icon", href: "/devbox/favicon.ico" }],
    ["link", { rel: "apple-touch-icon", sizes: "180x180", href: "/devbox/apple-touch-icon.png" }],
  ],

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
      copyright: "© 2026 DDI/DevBox",
    },
  },
};
