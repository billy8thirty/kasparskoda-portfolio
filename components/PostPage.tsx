import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import PostBody from "@/components/PostBody";
import { getPost } from "@/lib/posts";
import type { Section } from "@/lib/post-types";

export async function postMetadata(section: Section, slug: string) {
  const post = await getPost(section, slug);
  return { title: post ? `${post.title} · Kaspar Skoda` : "Kaspar Skoda", description: post?.summary };
}

export default async function PostPage({ section, slug }: { section: Section; slug: string }) {
  await connection();
  const post = await getPost(section, slug);
  if (!post) notFound();

  return (
    <article box-="round" shear-="top" className="flex flex-col flex-1 min-w-0 min-h-0">
      <div className="flex justify-between">
        <span>{post.title}</span>
        <span>
          {post.date} · {post.type}
        </span>
      </div>
      <div className="content overflow-y-auto py-[1lh] flex flex-col gap-[1lh]">
        <Link href={`/${section}`} className="sm:hidden text-[var(--foreground2)]">
          ← zurück
        </Link>
        <h2>{post.title}</h2>
        <PostBody body={post.body} section={section} slug={post.slug} layout={post.layout} />
      </div>
    </article>
  );
}
