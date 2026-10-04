import { connection } from "next/server";
import type { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import SideBarElement from "@/components/SideBarElement";
import PhotoShell from "@/components/PhotoShell";
import { getPosts } from "@/lib/posts";
import { SECTION_LABELS, type Section } from "@/lib/post-types";

// Shared frame for /photography and /projects: post list on the left, selected post on the right.
export default async function SectionShell({ section, children }: { section: Section; children: ReactNode }) {
  // Posts are read from disk on every request so new ones show up without a rebuild.
  await connection();
  const posts = await getPosts(section);

  return (
    <PhotoShell
      sidebar={
        <Sidebar title={SECTION_LABELS[section].sidebar}>
          {posts.length === 0 && <p className="text-[var(--foreground2)]">Noch nichts hier...</p>}
          {posts.map((post) => (
            <SideBarElement key={post.slug} post={post} />
          ))}
        </Sidebar>
      }
    >
      {children}
    </PhotoShell>
  );
}
