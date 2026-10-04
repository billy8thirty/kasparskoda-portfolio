"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { login, logout, requireAdmin } from "@/lib/auth";
import { createPost, deletePost, getPost, savePost } from "@/lib/posts";
import { saveAbout, saveSocials } from "@/lib/site";
import {
  LAYOUTS,
  POST_TYPES,
  isSection,
  type About,
  type PostLayout,
  type PostType,
  type Section,
  type Social,
} from "@/lib/post-types";

// Everything lives on disk, so after any write the whole site is re-rendered on next request.
function revalidateSite() {
  revalidatePath("/", "layout");
}

export async function loginAction(_prev: string | null, formData: FormData) {
  const ok = await login(String(formData.get("password") ?? ""));
  if (!ok) return "Falsches Passwort.";
  redirect("/admin");
}

export async function logoutAction() {
  await logout();
  redirect("/admin/login");
}

export async function createPostAction(section: Section, formData: FormData) {
  await requireAdmin();
  if (!isSection(section)) return;
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;
  const slug = await createPost(section, title);
  revalidateSite();
  redirect(`/admin/${section}/edit/${slug}`);
}

export type SaveInput = {
  title: string;
  date: string;
  type: string;
  layout: string;
  summary: string;
  body: string;
};

export async function savePostAction(section: Section, slug: string, input: SaveInput) {
  await requireAdmin();
  if (!isSection(section) || !(await getPost(section, slug))) throw new Error("Post not found");

  await savePost(section, slug, {
    title: input.title.trim() || slug,
    date: /^\d{4}-\d{2}-\d{2}$/.test(input.date) ? input.date : new Date().toISOString().slice(0, 10),
    type: (POST_TYPES as readonly string[]).includes(input.type) ? (input.type as PostType) : "photo",
    layout: (LAYOUTS as readonly string[]).includes(input.layout) ? (input.layout as PostLayout) : "article",
    summary: input.summary.trim(),
    body: input.body,
  });
  revalidateSite();
}

export async function deletePostAction(section: Section, slug: string) {
  await requireAdmin();
  if (!isSection(section)) return;
  await deletePost(section, slug);
  revalidateSite();
  redirect(`/admin/${section}`);
}

export async function saveAboutAction(about: About) {
  await requireAdmin();
  await saveAbout({
    heading: about.heading.trim(),
    location: about.location.trim(),
    availability: about.availability.trim(),
    body: about.body,
  });
  revalidateSite();
}

export async function saveSocialsAction(socials: Social[]) {
  await requireAdmin();
  const clean = socials
    .map((s) => ({
      id: String(s.id || crypto.randomUUID()),
      title: String(s.title ?? "").trim(),
      icon: String(s.icon ?? "").trim(),
      buttonText: String(s.buttonText ?? "").trim(),
      link: String(s.link ?? "").trim(),
      handle: String(s.handle ?? "").trim(),
    }))
    .filter((s) => s.title || s.link);
  await saveSocials(clean);
  revalidateSite();
}
