export default {
  title: 'DevBox',
  description: 'Personal knowledge base & dev platform',

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],

  themeConfig: {
    logo: '📦',

    nav: [
      { text: 'Frontend', link: '/frontend/vite' },
      { text: 'Craft CMS', link: '/craft/structure' },
      { text: 'Snippets', link: '/snippets/js' },
      { text: 'Linux', link: '/linux/arch-setup' },
    ],

    sidebar: {
      '/frontend/': [
        { text: 'Vite Config', link: '/frontend/vite' },
        { text: 'Изображения', link: '/frontend/images' },
        { text: 'Шрифты', link: '/frontend/fonts' },
        { text: 'Производительность', link: '/frontend/performance' },
      ],
      '/craft/': [
        { text: 'Структура', link: '/craft/structure' },
        { text: 'Twig Best Practices', link: '/craft/twig' },
        { text: 'Компоненты', link: '/craft/components' },
      ],
      '/snippets/': [
        { text: 'JavaScript', link: '/snippets/js' },
        { text: 'PHP', link: '/snippets/php' },
        { text: 'Twig', link: '/snippets/twig' },
      ],
      '/linux/': [
        { text: 'Arch Setup', link: '/linux/arch-setup' },
        { text: 'Оптимизация', link: '/linux/optimization' },
      ],
    },

    search: {
      provider: 'local'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/yourusername/devbox' }
    ],

    editLink: {
      pattern: 'https://github.com/yourusername/devbox/edit/main/docs/:path',
      text: 'Редактировать на GitHub'
    },

    footer: {
      message: 'Built with VitePress',
      copyright: '© 2026 DevBox'
    }
  }
}
