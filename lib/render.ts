import { marked } from "marked";
import { VIDEO_EXTENSIONS } from "@/lib/post-types";

// Shared by the public pages and the admin preview, so it must stay free of server-only code.

export type Block =
  | { kind: "text"; html: string }
  | { kind: "image"; src: string; alt: string }
  | { kind: "video"; src: string; alt: string }
  | { kind: "youtube"; id: string };

const MEDIA_LINE = /^!\[([^\]]*)\]\(<?([^)\s>]+)>?(?:\s+"[^"]*")?\)$/;
const YOUTUBE_LINE =
  /^<?https?:\/\/(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:\S*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{11})\S*?>?$/;

export function resolveSrc(src: string, section: string, slug: string) {
  if (/^(https?:|\/|data:|blob:)/.test(src)) return src;
  return `/media/${section}/${slug}/${encodeURIComponent(src)}`;
}

function isVideo(src: string) {
  const ext = src.split("?")[0].split(".").pop()?.toLowerCase() ?? "";
  return VIDEO_EXTENSIONS.includes(ext);
}

export function markdownToHtml(text: string) {
  return marked.parse(text, { async: false, gfm: true, breaks: true });
}

function textToHtml(text: string, section: string, slug: string) {
  // Relative media inside running text also points at the post folder.
  const resolved = text.replace(/(!\[[^\]]*\]\()<?([^)\s>]+)>?/g, (_, head, src) => head + resolveSrc(src, section, slug));
  return markdownToHtml(resolved);
}

// Media on its own line becomes a standalone block; everything else stays markdown.
export function parseBlocks(body: string, section: string, slug: string): Block[] {
  const blocks: Block[] = [];
  let text: string[] = [];
  let inFence = false;

  const flush = () => {
    const chunk = text.join("\n").trim();
    if (chunk) blocks.push({ kind: "text", html: textToHtml(chunk, section, slug) });
    text = [];
  };

  for (const line of body.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed.startsWith("```")) inFence = !inFence;

    if (!inFence) {
      const media = trimmed.match(MEDIA_LINE);
      if (media) {
        flush();
        const src = resolveSrc(media[2], section, slug);
        blocks.push({ kind: isVideo(media[2]) ? "video" : "image", src, alt: media[1] });
        continue;
      }
      const yt = trimmed.match(YOUTUBE_LINE);
      if (yt) {
        flush();
        blocks.push({ kind: "youtube", id: yt[1] });
        continue;
      }
    }
    text.push(line);
  }
  flush();
  return blocks;
}

export function youtubeId(url: string) {
  return url.trim().match(YOUTUBE_LINE)?.[1] ?? null;
}
