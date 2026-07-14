import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const srcPath = path.join(root, "themes/pehtheme-hugo/assets/css/main.css");
const outPath = path.join(root, "themes/pehtheme-hugo/assets/css/critical-home.css");

const css = fs.readFileSync(srcPath, "utf8");

const KEEP = new Set([
  "insert-link",
  "relative",
  "mx-2",
  "mx-auto",
  "my-2",
  "my-4",
  "my-8",
  "mb-16",
  "mb-6",
  "mr-auto",
  "mt-3",
  "ml-auto",
  "line-clamp-2",
  "block",
  "flex",
  "grid",
  "aspect-video",
  "w-full",
  "max-w-7xl",
  "cursor-pointer",
  "grid-cols-1",
  "flex-col",
  "flex-nowrap",
  "items-center",
  "gap-x-6",
  "gap-y-10",
  "space-x-2",
  "space-x-4",
  "overflow-hidden",
  "overflow-x-auto",
  "whitespace-nowrap",
  "rounded-3xl",
  "rounded-full",
  "border",
  "border-b",
  "border-zinc-400",
  "bg-blue-500",
  "bg-zinc-100",
  "fill-white",
  "object-cover",
  "p-1.5",
  "p-3",
  "p-6",
  "px-4",
  "px-6",
  "py-1",
  "py-1.5",
  "py-2",
  "py-6",
  "pl-3",
  "pr-[5px]",
  "before:content-['']",
  "before:absolute",
  "before:top-0",
  "before:right-0",
  "before:left-0",
  "before:bottom-0",
  "before:z-10",
  "before:pointer-events-auto",
  "text-2xl",
  "text-3xl",
  "text-xl",
  "font-bold",
  "uppercase",
  "leading-normal",
  "text-zinc-500",
  "transition",
  "duration-500",
  "close",
  "open",
  "hover:bg-blue-100",
  "hover:bg-zinc-200",
  "md:px-6",
  "md:grid-cols-3",
  "md:text-4xl",
  "lg:px-8",
]);

const PREFLIGHT_TAGS = new Set([
  "html",
  "body",
  "hr",
  "a",
  "h1",
  "h2",
  "h3",
  "img",
  "button",
  "ul",
  "ol",
  "menu",
  "li",
  "time",
  "p",
  "figure",
  "article",
  "header",
  "main",
  "nav",
  "svg",
  "*",
]);

function tailwindClassToSelectorPart(name) {
  let result = "";
  for (const ch of name) {
    if (ch === ":") result += "\\:";
    else if (ch === "/") result += "\\/";
    else if (ch === ".") result += "\\.";
    else if (ch === "[") result += "\\[";
    else if (ch === "]") result += "\\]";
    else if (ch === "'") result += "\\'";
    else result += ch;
  }
  return result;
}

function classInSelector(name, selector) {
  let cssClass = "";
  for (const ch of name) {
    if (ch === ":") cssClass += "\\:";
    else if (ch === "/") cssClass += "\\/";
    else if (ch === ".") cssClass += "\\.";
    else if (ch === "[") cssClass += "\\[";
    else if (ch === "]") cssClass += "\\]";
    else if (ch === "'") cssClass += "\\'";
    else cssClass += ch;
  }
  const escaped = cssClass.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\.${escaped}(?![\\w-]|\\\\\\.)`).test(selector);
}

const GROUP_HOVER_KEEP = new Set([
  "group-hover:scale-105",
  "group-hover:animate-spin",
]);

function selectorMatches(selector) {
  const normalized = selector.trim();
  if (normalized.includes("insert-link")) {
    return true;
  }

  for (const name of GROUP_HOVER_KEEP) {
    if (classInSelector(name, normalized)) {
      return true;
    }
  }

  const tag = normalized.split(/[.:#\s[]>+~[]/)[0];
  if (PREFLIGHT_TAGS.has(tag)) {
    return true;
  }

  for (const name of KEEP) {
    if (classInSelector(name, normalized)) {
      return true;
    }
  }

  return false;
}

function parseBlocks(input) {
  const blocks = [];
  let i = 0;

  while (i < input.length) {
    while (i < input.length && /\s/.test(input[i])) i++;
    if (i >= input.length) break;

    if (input[i] === "@") {
      const start = i;
      const brace = input.indexOf("{", i);
      if (brace === -1) break;
      let depth = 0;
      let j = brace;
      for (; j < input.length; j++) {
        if (input[j] === "{") depth++;
        if (input[j] === "}") {
          depth--;
          if (depth === 0) {
            j++;
            break;
          }
        }
      }
      const header = input.slice(start, brace).trim();
      const body = input.slice(brace + 1, j - 1);
      blocks.push({ type: "at", header, body });
      i = j;
      continue;
    }

    const brace = input.indexOf("{", i);
    if (brace === -1) break;
    const selector = input.slice(i, brace).trim();
    let depth = 0;
    let j = brace;
    for (; j < input.length; j++) {
      if (input[j] === "{") depth++;
      if (input[j] === "}") {
        depth--;
        if (depth === 0) {
          j++;
          break;
        }
      }
    }
    const body = input.slice(brace + 1, j - 1);
    blocks.push({ type: "rule", selector, body });
    i = j;
  }

  return blocks;
}

function extractFromBlocks(blocks) {
  const kept = [];

  for (const block of blocks) {
    if (block.type === "at") {
      if (!block.header.startsWith("@media")) continue;
      const inner = extractFromBlocks(parseBlocks(block.body));
      if (inner.length > 0) {
        kept.push(`${block.header}{${inner.join("")}}`);
      }
      continue;
    }

    const selectors = block.selector.split(",").map((s) => s.trim());
    if (selectors.some(selectorMatches)) {
      kept.push(`${block.selector}{${block.body}}`);
    }
  }

  return kept;
}

const hiddenIndex = css.indexOf("[hidden]");
const preflightEnd = css.indexOf("}", hiddenIndex) + 1;
const varsStart = css.indexOf("*, ::before, ::after {", preflightEnd);
let depth = 0;
let varsEnd = varsStart;
for (let i = varsStart; i < css.length; i++) {
  if (css[i] === "{") depth++;
  if (css[i] === "}") {
    depth--;
    if (depth === 0) {
      varsEnd = i + 1;
      break;
    }
  }
}

const preflight = css.slice(0, varsEnd).trim();
const utilities = extractFromBlocks(parseBlocks(css.slice(varsEnd))).join("\n");
const critical = `${preflight}\n${utilities}\n`;

fs.writeFileSync(outPath, critical);
console.log(`Wrote ${outPath} (${critical.length} bytes)`);
