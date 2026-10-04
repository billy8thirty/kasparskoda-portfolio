"use client";

import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";

const ITEMS = [
  { href: "/admin", segment: null, label: "übersicht" },
  { href: "/admin/about", segment: "about", label: "about me" },
  { href: "/admin/socials", segment: "socials", label: "socials" },
  { href: "/admin/photography", segment: "photography", label: "photography" },
  { href: "/admin/projects", segment: "projects", label: "projects" },
];

export default function AdminNav() {
  const segments = useSelectedLayoutSegments();
  // Dynamic [section] routes report the actual value, so match on it directly.
  const current = segments[0] ?? null;

  return (
    <nav className="content flex flex-row flex-wrap sm:flex-col gap-x-[2ch] gap-y-0 py-[0.5lh]">
      {ITEMS.map((item) => {
        const active = current === item.segment;
        return (
          <Link key={item.href} href={item.href} className={active ? "font-bold" : "text-[var(--foreground2)]"}>
            {active ? "> " : "  "}{item.label}
          </Link>
        );
      })}
    </nav>
  );
}
