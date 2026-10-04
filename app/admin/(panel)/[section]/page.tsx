import Link from "next/link";
import { notFound } from "next/navigation";
import { getPosts } from "@/lib/posts";
import { SECTION_LABELS, isSection } from "@/lib/post-types";
import { createPostAction } from "@/app/admin/actions";

export default async function AdminSection({ params }: PageProps<"/admin/[section]">) {
  const { section } = await params;
  if (!isSection(section)) notFound();
  const posts = await getPosts(section);
  const create = createPostAction.bind(null, section);

  return (
    <div box-="round" shear-="top" className="flex-1 flex flex-col min-h-0">
      <div className="flex justify-between">
        <span>{SECTION_LABELS[section].title}</span>
        <span>content/{section}/</span>
      </div>

      <div className="content flex flex-col gap-[1lh] py-[1lh] overflow-y-auto">
        <form action={create} className="flex flex-col sm:flex-row sm:items-center gap-[1ch]">
          <input name="title" placeholder="Titel des neuen Posts..." required className="flex-1" />
          <button box-="round" type="submit" className="px-[3ch]">
            + neuer post
          </button>
        </form>

        {posts.length === 0 ? (
          <p className="text-[var(--foreground2)]">Noch keine Posts.</p>
        ) : (
          <ul className="flex flex-col gap-[1ch] list-none">
            {posts.map((post) => (
              <li key={post.slug} box-="round" shear-="both" className="flex flex-col">
                <div className="flex justify-between">
                  <span>{post.title}</span>
                  <span>{post.layout}</span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between gap-[1ch] px-[1ch]">
                  <p className="text-[var(--foreground1)] text-pretty">{post.summary || <em className="text-[var(--foreground2)]">keine summary</em>}</p>
                  <div className="flex gap-[2ch] shrink-0">
                    <Link href={`/${section}/${post.slug}`} target="_blank">ansehen ↗</Link>
                    <Link href={`/admin/${section}/edit/${post.slug}`}>bearbeiten →</Link>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span>{post.date}</span>
                  <span>{post.type}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
