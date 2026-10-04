import { isAdmin } from "@/lib/auth";
import { getPost, isMediaFolder, saveMedia } from "@/lib/posts";
import { IMAGE_EXTENSIONS, SITE_SECTION, VIDEO_EXTENSIONS, isSection } from "@/lib/post-types";

const ALLOWED = new Set([...IMAGE_EXTENSIONS, ...VIDEO_EXTENSIONS]);

// Receives drag & drop uploads from the admin and stores them in content/<section>/<slug>/.
export async function POST(request: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const form = await request.formData();
  const section = String(form.get("section") ?? "");
  const slug = String(form.get("slug") ?? "");
  const file = form.get("file");

  if (!(file instanceof File)) return Response.json({ error: "No file" }, { status: 400 });
  if (!isMediaFolder(section, slug)) return Response.json({ error: "Unknown folder" }, { status: 404 });
  if (section !== SITE_SECTION && (!isSection(section) || !(await getPost(section, slug)))) {
    return Response.json({ error: "Unknown post" }, { status: 404 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED.has(ext)) return Response.json({ error: `.${ext} wird nicht unterstützt` }, { status: 415 });

  const name = await saveMedia(section, slug, file.name, Buffer.from(await file.arrayBuffer()));
  return Response.json({ name, url: `/media/${section}/${slug}/${encodeURIComponent(name)}` });
}
