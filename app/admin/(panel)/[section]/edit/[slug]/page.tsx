import { notFound } from "next/navigation";
import { getPost, listMedia } from "@/lib/posts";
import { isSection } from "@/lib/post-types";
import Editor from "@/components/admin/Editor";

export default async function EditPost({ params }: PageProps<"/admin/[section]/edit/[slug]">) {
  const { section, slug } = await params;
  if (!isSection(section)) notFound();
  const post = await getPost(section, slug);
  if (!post) notFound();

  return <Editor post={post} media={await listMedia(section, slug)} />;
}
