import "server-only";
import { promises as fs } from "fs";
import path from "path";
import {
  LAYOUTS,
  POST_TYPES,
  SITE_ASSETS,
  SITE_SECTION,
  isSection,
  type Post,
  type PostLayout,
  type PostMeta,
  type PostType,
  type Section,
} from "@/lib/post-types";

// Every post lives in its own folder: content/<section>/<slug>/index.md plus its media files.
// Site-wide uploads (icons etc.) live in content/site/assets/.
export const CONTENT_DIR = path.join(process.cwd(), "content");
const POST_FILE = "index.md";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidSlug(slug: string) {
  return SLUG_RE.test(slug);
}

export function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

// Keeps only a safe basename so uploads can never escape their folder.
export function sanitizeFileName(name: string) {
  const base = path.basename(name).toLowerCase();
  const ext = path.extname(base);
  const stem = slugify(base.slice(0, base.length - ext.length)) || "file";
  const cleanExt = ext.replace(/[^a-z0-9.]/g, "");
  return stem + cleanExt;
}

// A media folder is either a post folder or the site assets folder.
export function isMediaFolder(section: string, slug: string) {
  if (section === SITE_SECTION) return slug === SITE_ASSETS;
  return isSection(section) && isValidSlug(slug);
}

function folder(section: string, slug: string) {
  if (!isMediaFolder(section, slug)) throw new Error(`Invalid folder: ${section}/${slug}`);
  return path.join(CONTENT_DIR, section, slug);
}

export function mediaPath(section: string, slug: string, file: string) {
  const safe = path.basename(file);
  if (!isMediaFolder(section, slug) || safe !== file || safe === POST_FILE || safe.startsWith(".")) return null;
  return path.join(folder(section, slug), safe);
}

function parseValue(raw: string) {
  const value = raw.trim();
  if (value.startsWith('"')) {
    try {
      return JSON.parse(value) as string;
    } catch {
      return value.slice(1, -1);
    }
  }
  return value;
}

export function parseFrontmatter(source: string) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  const fields: Record<string, string> = {};
  if (match) {
    for (const line of match[1].split(/\r?\n/)) {
      const i = line.indexOf(":");
      if (i > 0) fields[line.slice(0, i).trim()] = parseValue(line.slice(i + 1));
    }
  }
  return { fields, body: match ? source.slice(match[0].length) : source };
}

export function serializeFrontmatter(fields: Record<string, string>, body: string) {
  const lines = Object.entries(fields).map(([k, v]) => `${k}: ${JSON.stringify(v)}`);
  return ["---", ...lines, "---", "", body.replace(/\r\n/g, "\n").trimEnd(), ""].join("\n");
}

function parsePost(section: Section, slug: string, source: string): Post {
  const { fields, body } = parseFrontmatter(source);
  return {
    section,
    slug,
    title: fields.title || slug,
    date: fields.date || "",
    type: (POST_TYPES as readonly string[]).includes(fields.type) ? (fields.type as PostType) : "photo",
    layout: (LAYOUTS as readonly string[]).includes(fields.layout) ? (fields.layout as PostLayout) : "article",
    summary: fields.summary || "",
    body,
  };
}

export async function getPost(section: Section, slug: string): Promise<Post | null> {
  if (!isValidSlug(slug)) return null;
  try {
    return parsePost(section, slug, await fs.readFile(path.join(folder(section, slug), POST_FILE), "utf8"));
  } catch {
    return null;
  }
}

export async function getPosts(section: Section): Promise<PostMeta[]> {
  let entries: string[];
  try {
    entries = await fs.readdir(path.join(CONTENT_DIR, section));
  } catch {
    return [];
  }
  const posts = await Promise.all(entries.filter(isValidSlug).map((slug) => getPost(section, slug)));
  return posts
    .filter((p): p is Post => p !== null)
    .map(({ body: _body, ...meta }) => meta)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function createPost(section: Section, title: string) {
  const base = slugify(title) || "post";
  let slug = base;
  for (let n = 2; await getPost(section, slug); n++) slug = `${base}-${n}`;

  await fs.mkdir(folder(section, slug), { recursive: true });
  await savePost(section, slug, {
    title,
    date: new Date().toISOString().slice(0, 10),
    type: section === "projects" ? "other" : "photo",
    layout: section === "projects" ? "article" : "bento",
    summary: "",
    body: "",
  });
  return slug;
}

export async function savePost(section: Section, slug: string, post: Omit<Post, "slug" | "section">) {
  const source = serializeFrontmatter(
    { title: post.title, date: post.date, type: post.type, layout: post.layout, summary: post.summary },
    post.body,
  );
  await fs.writeFile(path.join(folder(section, slug), POST_FILE), source, "utf8");
}

export async function deletePost(section: Section, slug: string) {
  await fs.rm(folder(section, slug), { recursive: true, force: true });
}

export async function listMedia(section: string, slug: string) {
  try {
    const files = await fs.readdir(folder(section, slug));
    return files.filter((f) => f !== POST_FILE && !f.startsWith(".")).sort();
  } catch {
    return [];
  }
}

export async function saveMedia(section: string, slug: string, fileName: string, data: Buffer) {
  const clean = sanitizeFileName(fileName);
  const ext = path.extname(clean);
  const stem = clean.slice(0, clean.length - ext.length);
  const dir = folder(section, slug);
  await fs.mkdir(dir, { recursive: true });
  const existing = new Set(await listMedia(section, slug));

  let name = clean;
  for (let n = 2; existing.has(name); n++) name = `${stem}-${n}${ext}`;

  await fs.writeFile(path.join(dir, name), data);
  return name;
}
