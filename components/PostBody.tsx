import { parseBlocks, type Block } from "@/lib/render";
import type { PostLayout } from "@/lib/post-types";

// Repeating span pattern that gives the bento grid its uneven rhythm.
const BENTO_SPANS = [
  "sm:col-span-2 sm:row-span-2",
  "",
  "sm:row-span-2",
  "",
  "sm:col-span-2",
  "",
  "sm:col-span-2 sm:row-span-2",
  "",
];

function Media({ block, fill }: { block: Exclude<Block, { kind: "text" }>; fill?: boolean }) {
  const fit = fill ? "w-full h-full object-cover" : "w-full h-auto";

  switch (block.kind) {
    case "image":
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={block.src} alt={block.alt} title={block.alt || undefined} loading="lazy" className={`block ${fit}`} />;
    case "video":
      return <video src={block.src} title={block.alt || undefined} controls playsInline preload="metadata" className={`block ${fit}`} />;
    case "youtube":
      return (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${block.id}`}
          title="YouTube video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className={`block w-full ${fill ? "h-full" : "aspect-video"}`}
        />
      );
  }
}

function Text({ html }: { html: string }) {
  return <div className="md" dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function PostBody({ body, section, slug, layout }: { body: string; section: string; slug: string; layout: PostLayout }) {
  const blocks = parseBlocks(body, section, slug);
  const text = blocks.filter((b) => b.kind === "text");
  const media = blocks.filter((b) => b.kind !== "text");

  if (layout === "article" || media.length === 0) {
    return (
      <div className="flex flex-col gap-[2ch] max-w-[90ch]">
        {blocks.map((b, i) => (b.kind === "text" ? <Text key={i} html={b.html} /> : <Media key={i} block={b} />))}
      </div>
    );
  }

  if (layout === "gallery") {
    return (
      <div className="flex flex-col gap-[2ch]">
        {text.map((b, i) => (
          <Text key={i} html={b.html} />
        ))}
        <div className="columns-1 sm:columns-2 xl:columns-3 gap-[1ch]">
          {media.map((b, i) => (
            <div key={i} className="mb-[1ch] break-inside-avoid">
              <Media block={b} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // bento
  return (
    <div className="flex flex-col gap-[2ch]">
      {text.length > 0 && (
        <div className="flex flex-col gap-[1ch] max-w-[90ch]">
          {text.map((b, i) => (
            <Text key={i} html={b.html} />
          ))}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[14rem] grid-flow-dense gap-[1ch]">
        {media.map((b, i) => (
          <div
            key={i}
            className={`overflow-hidden bg-[var(--background1)] ${
              b.kind === "youtube" ? "sm:col-span-2 sm:row-span-2" : BENTO_SPANS[i % BENTO_SPANS.length]
            }`}
          >
            <Media block={b} fill />
          </div>
        ))}
      </div>
    </div>
  );
}
