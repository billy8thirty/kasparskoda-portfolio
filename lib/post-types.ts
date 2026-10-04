export const SECTIONS = ["photography", "projects"] as const;
export const POST_TYPES = ["photo", "video", "other"] as const;
export const LAYOUTS = ["article", "bento", "gallery"] as const;

export type Section = (typeof SECTIONS)[number];
export type PostType = (typeof POST_TYPES)[number];
export type PostLayout = (typeof LAYOUTS)[number];

export const SECTION_LABELS: Record<Section, { title: string; sidebar: string }> = {
  photography: { title: "Photography", sidebar: "Select a Date" },
  projects: { title: "Projects", sidebar: "Select a Project" },
};

export type Post = {
  section: Section;
  slug: string;
  title: string;
  date: string;
  type: PostType;
  layout: PostLayout;
  summary: string;
  body: string;
};

export type PostMeta = Omit<Post, "body">;

// Site-wide content managed from /admin, stored in content/site/.
export type About = {
  heading: string;
  location: string;
  availability: string;
  body: string;
};

export type Social = {
  id: string;
  title: string;
  icon: string;
  buttonText: string;
  link: string;
  handle: string;
};

export const SITE_SECTION = "site";
export const SITE_ASSETS = "assets";

export const VIDEO_EXTENSIONS = ["mp4", "webm", "mov", "m4v"];
export const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp", "avif", "svg"];

export function isSection(value: string): value is Section {
  return (SECTIONS as readonly string[]).includes(value);
}
