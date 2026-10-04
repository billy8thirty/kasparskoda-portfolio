"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import type { ReactNode } from "react";

// On small screens only one pane fits: the list, or the opened post.
export default function PhotoShell({ sidebar, children }: { sidebar: ReactNode; children: ReactNode }) {
  const open = useSelectedLayoutSegment() !== null;

  return (
    <main className="flex flex-row">
      <div className={`${open ? "hidden sm:flex" : "flex"} w-full sm:w-auto sm:max-w-[54ch] min-h-0`}>{sidebar}</div>
      <div className={`${open ? "flex" : "hidden sm:flex"} flex-1 min-w-0 min-h-0`}>{children}</div>
    </main>
  );
}
