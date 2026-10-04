import { promises as fs, createReadStream } from "fs";
import path from "path";
import { Readable } from "stream";
import { mediaPath } from "@/lib/posts";

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".m4v": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
};

// Serves media straight from content/<section>/<slug>/, with range support so videos can seek.
export async function GET(request: Request, { params }: RouteContext<"/media/[section]/[slug]/[file]">) {
  const { section, slug, file } = await params;
  const name = decodeURIComponent(file);
  const filePath = mediaPath(section, slug, name);
  const type = MIME[path.extname(name).toLowerCase()];
  if (!filePath || !type) return new Response("Not found", { status: 404 });

  let size: number;
  try {
    size = (await fs.stat(filePath)).size;
  } catch {
    return new Response("Not found", { status: 404 });
  }

  const headers: Record<string, string> = {
    "Content-Type": type,
    "Accept-Ranges": "bytes",
    "Cache-Control": "public, max-age=3600",
  };
  if (type === "image/svg+xml") headers["Content-Security-Policy"] = "script-src 'none'";

  const range = request.headers.get("range")?.match(/bytes=(\d*)-(\d*)/);
  if (range && (range[1] || range[2])) {
    const start = range[1] ? Number(range[1]) : Math.max(0, size - Number(range[2]));
    const end = range[1] && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
    if (start >= size || start > end) {
      return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
    }
    const stream = Readable.toWeb(createReadStream(filePath, { start, end })) as ReadableStream;
    return new Response(stream, {
      status: 206,
      headers: { ...headers, "Content-Range": `bytes ${start}-${end}/${size}`, "Content-Length": String(end - start + 1) },
    });
  }

  const stream = Readable.toWeb(createReadStream(filePath)) as ReadableStream;
  return new Response(stream, { headers: { ...headers, "Content-Length": String(size) } });
}
