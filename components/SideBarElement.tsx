"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import type { PostMeta } from "@/lib/post-types";

// Sidebar card: title on top, summary, select button, date + type in the bottom shear.
export default function SideBarElement({ post }: { post: PostMeta }) {
  const selected = useSelectedLayoutSegment();
  const active = selected === post.slug;
  const dimmed = selected !== null && !active;

  return (
    <div box-="round" shear-="both" className={`w-full sm:max-w-[50ch] flex flex-col mt-[1ch] ${dimmed ? "grayed-out" : ""}`}>
      <div>
        <span>{post.title}</span>
      </div>
      <div className="flex flex-col gap-[1ch] px-[1ch]">
        {post.summary && <p className="text-pretty text-[var(--foreground1)]">{post.summary}</p>}
        <Link box-="round" href={`/${post.section}/${post.slug}`} className="text-nowrap px-[3ch] text-center self-end" aria-current={active ? "page" : undefined}>
          {active ? "viewing" : "select"}
        </Link>
      </div>
      <div className="flex justify-between">
        <span>{post.date}</span>
        <span>{post.type}</span>
      </div>
    </div>
  );
}
