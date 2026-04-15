/**
 * Динамическая генерация навигации VitePress из файловой структуры.
 * Работает при запуске — без перезаписи файлов.
 * Добавил новую папку в templates/ → появилась в навигации автоматически.
 */
import { readdirSync, statSync, existsSync, readFileSync } from "fs";
import { join, relative, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "templates");

/**
 * Маппинг имён папок → читаемые лейблы.
 * Если папки нет в MAP — первая буква станет большой, дефисы → пробелы.
 */
const LABEL_MAP = {
  frontend: "Frontend",
  cms: "CMS",
  wordpress: "WordPress",
  "craft-cms": "Craft CMS",
  tools: "Tools",
  linux: "Linux",
  css: "CSS",
  build: "Build",
  assets: "Assets",
  js: "JavaScript",
  php: "PHP",
  arch: "Arch",
};

/**
 * Явный порядок секций в навигации.
 * Секции не из списка добавляются в конец автоматически.
 */
const SECTION_ORDER = ["frontend", "cms", "tools", "linux"];

function toLabel(name) {
  return LABEL_MAP[name] || name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, " ");
}

/**
 * Автоматически находит все папки первого уровня в templates/
 * которые содержат .md файлы.
 */
function findSections() {
  const entries = readdirSync(ROOT).filter((e) => !e.startsWith("."));
  const sections = entries
    .filter((e) => statSync(join(ROOT, e)).isDirectory())
    .filter((e) => collectMarkdown(join(ROOT, e), join(ROOT, e)).length > 0);

  return sections.sort((a, b) => {
    const ai = SECTION_ORDER.indexOf(a);
    const bi = SECTION_ORDER.indexOf(b);
    if (ai === -1 && bi === -1) return 0;
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

/**
 * Рекурсивный сбор .md файлов в папке.
 */
function collectMarkdown(dir, base) {
  const results = [];
  if (!existsSync(dir)) return results;

  const entries = readdirSync(dir).filter((e) => !e.startsWith(".") && e !== "node_modules");

  for (const entry of entries) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      results.push(...collectMarkdown(full, base));
    } else if (entry.endsWith(".md")) {
      results.push(relative(base, full).replace(/\\/g, "/"));
    }
  }
  return results;
}

/**
 * Извлекает title из frontmatter .md файла.
 */
function extractTitle(filePath) {
  try {
    const content = readFileSync(filePath, "utf-8");
    const fm = content.match(/^---\n([\s\S]*?)\n---/);
    if (fm) {
      const titleMatch = fm[1].match(/^title:\s*["']?([^"'\n]+)["']?/m);
      if (titleMatch) return titleMatch[1].trim();
    }
  } catch {}
  return null;
}

/**
 * Строит sidebar-дерево для одной секции.
 */
function buildSidebarTree(section) {
  const sectionPath = join(ROOT, section);
  if (!existsSync(sectionPath)) return [];

  const files = collectMarkdown(sectionPath, sectionPath);
  if (files.length === 0) return [];

  const tree = {};

  for (const file of files) {
    const parts = file.replace(/\.md$/, "").split("/");
    let node = tree;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;
      if (isLast) {
        if (!node._files) node._files = [];
        node._files.push(file);
      } else {
        if (!node[part]) node[part] = {};
        node = node[part];
      }
    }
  }

  function nodeToItems(node, prefix) {
    const items = [];

    for (const [key, child] of Object.entries(node)) {
      if (key === "_files") continue;
      const childItems = nodeToItems(child, `${prefix}/${key}`);
      if (childItems.length > 0) {
        items.push({
          text: toLabel(key),
          collapsed: true,
          items: childItems,
        });
      }
    }

    if (node._files) {
      for (const file of node._files) {
        const absPath = join(ROOT, section, file);
        const linkPath = file.replace(/\.md$/, "");
        const fallback = linkPath.split("/").pop().replace(/-/g, " ");
        items.push({
          text: extractTitle(absPath) || fallback.charAt(0).toUpperCase() + fallback.slice(1),
          link: `/${section}/${linkPath}`,
        });
      }
    }

    return items;
  }

  return nodeToItems(tree, `/${section}`);
}

/**
 * Находит первый .md файл в секции (для nav).
 */
function firstLink(section) {
  const sectionPath = join(ROOT, section);
  const files = collectMarkdown(sectionPath, sectionPath);
  if (files.length === 0) return null;
  return `/${section}/${files[0].replace(/\.md$/, "")}`;
}

/**
 * Генерирует массив nav.
 */
export function getNav() {
  return findSections()
    .map((section) => ({
      text: toLabel(section),
      link: firstLink(section),
    }))
    .filter((item) => item.link);
}

/**
 * Генерирует объект sidebar.
 */
export function getSidebar() {
  const sidebar = {};
  for (const section of findSections()) {
    const tree = buildSidebarTree(section);
    if (tree.length > 0) {
      sidebar[`/${section}/`] = tree;
    }
  }
  return sidebar;
}
