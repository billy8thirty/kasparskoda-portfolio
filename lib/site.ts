import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { CONTENT_DIR, listMedia, parseFrontmatter, serializeFrontmatter } from "@/lib/posts";
import { SITE_ASSETS, SITE_SECTION, type About, type Social } from "@/lib/post-types";

// Site-wide content: content/site/about.md and content/site/socials.json.
const SITE_DIR = path.join(CONTENT_DIR, SITE_SECTION);
const ABOUT_FILE = path.join(SITE_DIR, "about.md");
const SOCIALS_FILE = path.join(SITE_DIR, "socials.json");

// Defaults mirror what the site shipped with before the admin existed.
const DEFAULT_ABOUT: About = {
  heading: "I'm Kaspar",
  location: "Essen, Germany",
  availability: "Available to Work",
  body: [
    "an aspiring maker and videographer, with knowledge and experience in many fields across film making, photography, web development, and more.",
    "",
    "<sub>I got plenty of passion and want to make my little corner of the world a better place.</sub>",
  ].join("\n"),
};

const DEFAULT_SOCIALS: Social[] = [
  { id: "instagram", title: "Instagram", icon: "/icons/instagram.svg", buttonText: "view profile", link: "https://www.instagram.com/billy8thirty/", handle: "@billy8thirty" },
  { id: "github", title: "GitHub", icon: "/icons/github.svg", buttonText: "view profile", link: "https://www.github.com/billy8thirty/", handle: "@billy8thirty" },
  { id: "mail", title: "Mail", icon: "/icons/protonmail.svg", buttonText: "Write me an e-mail!", link: "mailto:kasparskoda@proton.me", handle: "kasparskoda@proton.me" },
  { id: "linkedin", title: "LinkedIn", icon: "/icons/user-round.svg", buttonText: "view my CV", link: "https://www.linkedin.com/in/kasparskoda/", handle: "Kaspar Skoda" },
];

export async function getAbout(): Promise<About> {
  try {
    const { fields, body } = parseFrontmatter(await fs.readFile(ABOUT_FILE, "utf8"));
    return {
      heading: fields.heading ?? DEFAULT_ABOUT.heading,
      location: fields.location ?? DEFAULT_ABOUT.location,
      availability: fields.availability ?? DEFAULT_ABOUT.availability,
      body,
    };
  } catch {
    return DEFAULT_ABOUT;
  }
}

export async function saveAbout(about: About) {
  await fs.mkdir(SITE_DIR, { recursive: true });
  const { body, ...fields } = about;
  await fs.writeFile(ABOUT_FILE, serializeFrontmatter(fields, body), "utf8");
}

export async function getSocials(): Promise<Social[]> {
  try {
    const parsed = JSON.parse(await fs.readFile(SOCIALS_FILE, "utf8"));
    return Array.isArray(parsed) ? parsed : DEFAULT_SOCIALS;
  } catch {
    return DEFAULT_SOCIALS;
  }
}

export async function saveSocials(socials: Social[]) {
  await fs.mkdir(SITE_DIR, { recursive: true });
  await fs.writeFile(SOCIALS_FILE, JSON.stringify(socials, null, 2) + "\n", "utf8");
}

// Icons the socials editor can pick from: bundled ones in public/icons plus uploaded svgs.
export async function listIcons() {
  let bundled: string[] = [];
  try {
    bundled = (await fs.readdir(path.join(process.cwd(), "public", "icons")))
      .filter((f) => f.endsWith(".svg"))
      .map((f) => `/icons/${f}`);
  } catch {}
  const uploaded = (await listMedia(SITE_SECTION, SITE_ASSETS))
    .filter((f) => f.endsWith(".svg"))
    .map((f) => `/media/${SITE_SECTION}/${SITE_ASSETS}/${f}`);
  return [...bundled, ...uploaded];
}
