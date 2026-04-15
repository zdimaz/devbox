// Auto-generates nav and sidebar from the templates/ folder structure.
// Add a new folder to templates/ → it appears in the nav automatically.
import { readdirSync, statSync, existsSync, readFileSync } from "fs";
import { join, relative, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "templates");

// Top-level nav sections: defines order and display labels.
// Folders not listed here are appended at the end automatically.
const SECTIONS = [
  { id: "frontend", label: "Frontend" },
  { id: "cms",      label: "CMS"      },
  { id: "tools",    label: "Tools"    },
  { id: "linux",    label: "Linux"    },
];

// Labels for sub-folders whose names can't be auto-derived correctly.
const LABELS = {
  "craft-cms": "Craft CMS",
  wordpress:   "WordPress",
  css:         "CSS",
  js:          "JavaScript",
  php:         "PHP",
};

function toLabel(name) {
  const section = SECTIONS.find((s) => s.id === name);
  if (section) return section.label;
  return LABELS[name] || name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, " ");
}

function findSections() {
  const order = SECTIONS.map((s) => s.id);
  const entries = readdirSync(ROOT).filter((e) => !e.startsWith("."));
  const sections = entries
    .filter((e) => statSync(join(ROOT, e)).isDirectory())
    .filter((e) => collectMarkdown(join(ROOT, e), join(ROOT, e)).length > 0);

  return sections.sort((a, b) => {
    const ai = order.indexOf(a);
    const bi = order.indexOf(b);
    if (ai === -1 && bi === -1) return 0;
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

function collectMarkdown(dir, base) {
  const results = [];
  if (!existsSync(dir)) return results;

  for (const entry of readdirSync(dir).filter((e) => !e.startsWith(".") && e !== "node_modules")) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...collectMarkdown(full, base));
    } else if (entry.endsWith(".md")) {
      results.push(relative(base, full).replace(/\\/g, "/"));
    }
  }
  return results;
}

function extractTitle(filePath) {
  try {
    const content = readFileSync(filePath, "utf-8");
    const fm = content.match(/^---\n([\s\S]*?)\n---/);
    if (fm) {
      const match = fm[1].match(/^title:\s*["']?([^"'\n]+)["']?/m);
      if (match) return match[1].trim();
    }
  } catch {}
  return null;
}

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
      if (i === parts.length - 1) {
        (node._files ??= []).push(file);
      } else {
        node = (node[parts[i]] ??= {});
      }
    }
  }

  function nodeToItems(node, prefix) {
    const items = [];
    for (const [key, child] of Object.entries(node)) {
      if (key === "_files") continue;
      const childItems = nodeToItems(child, `${prefix}/${key}`);
      if (childItems.length > 0) {
        items.push({ text: toLabel(key), collapsed: true, items: childItems });
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

function firstLink(section) {
  const files = collectMarkdown(join(ROOT, section), join(ROOT, section));
  return files.length ? `/${section}/${files[0].replace(/\.md$/, "")}` : null;
}

export function getNav() {
  return findSections()
    .map((section) => ({ text: toLabel(section), link: firstLink(section) }))
    .filter((item) => item.link);
}

export function getSidebar() {
  const sidebar = {};
  for (const section of findSections()) {
    const tree = buildSidebarTree(section);
    if (tree.length > 0) sidebar[`/${section}/`] = tree;
  }
  return sidebar;
}
