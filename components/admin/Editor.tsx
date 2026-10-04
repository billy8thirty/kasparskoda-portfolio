"use client";

import Link from "next/link";
import { useCallback, useRef, useState, useTransition } from "react";
import { useSaveShortcut } from "@/components/admin/useSaveShortcut";
import PostBody from "@/components/PostBody";
import { deletePostAction, savePostAction } from "@/app/admin/actions";
import { LAYOUTS, POST_TYPES, type Post } from "@/lib/post-types";
import { youtubeId } from "@/lib/render";

type Fields = Omit<Post, "slug" | "section">;

const LAYOUT_HINTS: Record<string, string> = {
  article: "Text & Medien in Reihenfolge",
  bento: "Text oben, Medien als Bento-Grid",
  gallery: "Text oben, Medien als Masonry-Galerie",
};

// Videos use image syntax too; the renderer picks <video> by file extension.
function mediaLine(name: string) {
  const alt = name.replace(/\.[^.]+$/, "").replace(/-/g, " ");
  return `![${alt}](${name})`;
}

export default function Editor({ post, media: initialMedia }: { post: Post; media: string[] }) {
  const { slug, section, ...initial } = post;
  const [fields, setFields] = useState<Fields>(initial);
  const [saved, setSaved] = useState<Fields>(initial);
  const [media, setMedia] = useState(initialMedia);
  const [status, setStatus] = useState("");
  const [dragging, setDragging] = useState(false);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [saving, startSaving] = useTransition();
  const textarea = useRef<HTMLTextAreaElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const dirty = JSON.stringify(fields) !== JSON.stringify(saved);
  const set = <K extends keyof Fields>(key: K, value: Fields[K]) => setFields((f) => ({ ...f, [key]: value }));

  // Inserts whole lines at the cursor so media always ends up as its own block.
  const insertLines = useCallback((lines: string[], at?: number) => {
    const el = textarea.current;
    setFields((f) => {
      const pos = at ?? el?.selectionStart ?? f.body.length;
      const before = f.body.slice(0, pos);
      const after = f.body.slice(pos);
      const prefix = before === "" || before.endsWith("\n") ? "" : "\n";
      const suffix = after.startsWith("\n") ? "" : "\n";
      const insert = prefix + lines.join("\n") + suffix;
      requestAnimationFrame(() => {
        if (!el) return;
        el.focus();
        el.selectionStart = el.selectionEnd = pos + insert.length;
      });
      return { ...f, body: before + insert + after };
    });
  }, []);

  const upload = useCallback(
    async (files: File[], at?: number) => {
      if (files.length === 0) return;
      const names: string[] = [];
      for (const [i, file] of files.entries()) {
        setStatus(`lade hoch ${i + 1}/${files.length}: ${file.name}`);
        const form = new FormData();
        form.append("section", section);
        form.append("slug", slug);
        form.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: form });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setStatus(`fehler bei ${file.name}: ${data.error ?? res.status}`);
          continue;
        }
        names.push(data.name);
      }
      if (names.length > 0) {
        setMedia((m) => [...new Set([...m, ...names])].sort());
        insertLines(names.map(mediaLine), at);
        setStatus(`${names.length} datei(en) hochgeladen`);
      }
    },
    [section, slug, insertLines],
  );

  const save = useCallback(() => {
    startSaving(async () => {
      try {
        await savePostAction(section, slug, fields);
        setSaved(fields);
        setStatus(`gespeichert ${new Date().toLocaleTimeString()}`);
      } catch {
        setStatus("speichern fehlgeschlagen");
      }
    });
  }, [section, slug, fields]);

  useSaveShortcut(save, dirty);

  const onDrop = (e: React.DragEvent) => {
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      e.preventDefault();
      upload(files);
      return;
    }
    const url = e.dataTransfer.getData("text/uri-list") || e.dataTransfer.getData("text/plain");
    if (youtubeId(url)) {
      e.preventDefault();
      insertLines([url.trim()]);
    }
  };

  const onPaste = (e: React.ClipboardEvent) => {
    const files = Array.from(e.clipboardData.files);
    if (files.length > 0) {
      e.preventDefault();
      upload(files);
      return;
    }
    const text = e.clipboardData.getData("text/plain");
    if (youtubeId(text)) {
      e.preventDefault();
      insertLines([text.trim()]);
    }
  };

  const addYoutube = () => {
    const url = window.prompt("YouTube-Link:");
    if (!url) return;
    if (!youtubeId(url)) {
      setStatus("kein gültiger YouTube-Link");
      return;
    }
    insertLines([url.trim()]);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div box-="round" shear-="top" className="flex flex-col">
        <div className="flex justify-between">
          <span>
            <Link href={`/admin/${section}`}>{section}</Link> / {slug}
          </span>
          <span>{saving ? "speichert..." : dirty ? "● ungespeichert" : status || `content/${section}/${slug}`}</span>
        </div>
        <div className="content grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-x-[2ch] gap-y-[1ch] pt-[1ch]">
          <label className="flex flex-col">
            title
            <input value={fields.title} onChange={(e) => set("title", e.target.value)} className="w-full" />
          </label>
          <label className="flex flex-col">
            date
            <input type="date" value={fields.date} onChange={(e) => set("date", e.target.value)} className="w-full" />
          </label>
          <label className="flex flex-col">
            type
            <select value={fields.type} onChange={(e) => set("type", e.target.value as Fields["type"])} className="field">
              {POST_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col" title={LAYOUT_HINTS[fields.layout]}>
            layout
            <select value={fields.layout} onChange={(e) => set("layout", e.target.value as Fields["layout"])} className="field">
              {LAYOUTS.map((l) => (
                <option key={l} value={l}>
                  {l} — {LAYOUT_HINTS[l]}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col md:col-span-4">
            summary (Sidebar-Text)
            <input value={fields.summary} onChange={(e) => set("summary", e.target.value)} className="w-full" />
          </label>
        </div>
        <div className="content flex flex-wrap gap-[1ch] py-[1ch]">
          <button box-="round" type="button" onClick={save} disabled={saving || !dirty}>
            speichern (ctrl+s)
          </button>
          <button box-="round" type="button" onClick={() => fileInput.current?.click()}>
            + bild/video
          </button>
          <button box-="round" type="button" onClick={addYoutube}>
            + youtube
          </button>
          <Link box-="round" href={`/${section}/${slug}`} target="_blank" className="px-[2ch] flex items-center">
            live ansehen ↗
          </Link>
          <button
            box-="round"
            type="button"
            className="ml-auto [--button-primary:var(--red)]"
            onClick={() => {
              if (window.confirm(`"${fields.title}" inkl. aller Dateien löschen?`)) deletePostAction(section, slug);
            }}
          >
            löschen
          </button>
          <input
            ref={fileInput}
            type="file"
            multiple
            accept="image/*,video/*"
            hidden
            onChange={(e) => {
              upload(Array.from(e.target.files ?? []));
              e.target.value = "";
            }}
          />
        </div>
      </div>

      <div className="flex md:hidden gap-[2ch] px-[1ch] py-[0.5lh]">
        <button type="button" onClick={() => setTab("write")} className={tab === "write" ? "" : "opacity-50"}>
          schreiben
        </button>
        <button type="button" onClick={() => setTab("preview")} className={tab === "preview" ? "" : "opacity-50"}>
          vorschau
        </button>
      </div>

      <div className="flex flex-col md:flex-row flex-1 min-h-0">
        <div
          box-="round"
          shear-="top"
          className={`flex-col flex-1 min-h-[20lh] md:min-h-0 md:basis-1/2 ${tab === "write" ? "flex" : "hidden md:flex"} ${
            dragging ? "[--box-border-color:var(--green)]" : ""
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          <div className="flex justify-between">
            <span>{dragging ? "loslassen zum hochladen" : "markdown"}</span>
            <span>bilder/videos hier reinziehen</span>
          </div>
          <textarea
            ref={textarea}
            value={fields.body}
            onChange={(e) => set("body", e.target.value)}
            onPaste={onPaste}
            spellCheck={false}
            placeholder={"Schreib hier in Markdown...\n\nBilder/Videos einfach reinziehen oder einfügen.\nYouTube-Link in eine eigene Zeile = Embed."}
            className="flex-1 w-full resize-none py-[1lh]"
          />
          {media.length > 0 && (
            <div className="flex flex-wrap gap-x-[2ch] px-[1ch] pt-[0.5lh] text-[var(--foreground2)]">
              <p>dateien:</p>
              {media.map((name) => (
                <button
                  key={name}
                  type="button"
                  title="an Cursor einfügen"
                  onClick={() => insertLines([mediaLine(name)])}
                  className="link-button"
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div
          box-="round"
          shear-="top"
          className={`flex-col flex-1 min-h-0 md:basis-1/2 ${tab === "preview" ? "flex" : "hidden md:flex"}`}
        >
          <div>
            <span>vorschau · {fields.layout}</span>
          </div>
          <div className="content overflow-y-auto py-[1lh] flex flex-col gap-[1lh]">
            <h2>{fields.title}</h2>
            <PostBody body={fields.body} section={section} slug={slug} layout={fields.layout} />
          </div>
        </div>
      </div>
    </div>
  );
}
