import Link from "next/link";
import { getPosts } from "@/lib/posts";
import { getAbout, getSocials } from "@/lib/site";
import { SECTIONS, SECTION_LABELS } from "@/lib/post-types";

export default async function AdminHome() {
  const [about, socials, counts] = await Promise.all([
    getAbout(),
    getSocials(),
    Promise.all(SECTIONS.map(async (s) => [s, (await getPosts(s)).length] as const)),
  ]);

  const cards = [
    { href: "/admin/about", title: "about me", info: about.heading, action: "bearbeiten" },
    { href: "/admin/socials", title: "socials", info: `${socials.length} buttons`, action: "bearbeiten" },
    ...counts.map(([section, n]) => ({
      href: `/admin/${section}`,
      title: SECTION_LABELS[section].title.toLowerCase(),
      info: `${n} post${n === 1 ? "" : "s"}`,
      action: "verwalten",
    })),
  ];

  return (
    <div box-="round" shear-="top" className="flex-1 flex flex-col">
      <div><span>übersicht</span></div>
      <div className="content grid grid-cols-1 md:grid-cols-2 auto-rows-min gap-[1ch] py-[1lh]">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} box-="round" shear-="top" className="flex flex-col">
            <div><span>{card.title}</span></div>
            <div className="flex justify-between px-[1ch] py-[0.5lh]">
              <p className="text-[var(--foreground2)] truncate">{card.info}</p>
              <p>{card.action} →</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
