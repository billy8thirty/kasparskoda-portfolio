"use client";

import { useCallback, useState, useTransition } from "react";
import AboutMe from "@/components/AboutMe";
import { saveAboutAction } from "@/app/admin/actions";
import type { About } from "@/lib/post-types";
import { useSaveShortcut } from "@/components/admin/useSaveShortcut";

export default function AboutEditor({ about: initial }: { about: About }) {
  const [about, setAbout] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [status, setStatus] = useState("");
  const [saving, startSaving] = useTransition();

  const dirty = JSON.stringify(about) !== JSON.stringify(saved);
  const set = <K extends keyof About>(key: K, value: About[K]) => setAbout((a) => ({ ...a, [key]: value }));

  const save = useCallback(() => {
    startSaving(async () => {
      try {
        await saveAboutAction(about);
        setSaved(about);
        setStatus(`gespeichert ${new Date().toLocaleTimeString()}`);
      } catch {
        setStatus("speichern fehlgeschlagen");
      }
    });
  }, [about]);

  useSaveShortcut(save, dirty);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div box-="round" shear-="top" className="flex flex-col">
        <div className="flex justify-between">
          <span>about me</span>
          <span>{saving ? "speichert..." : dirty ? "● ungespeichert" : status || "content/site/about.md"}</span>
        </div>
        <div className="content grid grid-cols-1 md:grid-cols-3 gap-x-[2ch] gap-y-[1ch] pt-[1ch]">
          <label className="flex flex-col">
            überschrift
            <input value={about.heading} onChange={(e) => set("heading", e.target.value)} className="w-full" />
          </label>
          <label className="flex flex-col">
            location
            <input value={about.location} onChange={(e) => set("location", e.target.value)} className="w-full" />
          </label>
          <label className="flex flex-col">
            available
            <input value={about.availability} onChange={(e) => set("availability", e.target.value)} className="w-full" />
          </label>
        </div>
        <div className="content flex gap-[1ch] py-[1ch]">
          <button box-="round" type="button" onClick={save} disabled={saving || !dirty}>
            speichern (ctrl+s)
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1 min-h-0">
        <div box-="round" shear-="top" className="flex flex-col flex-1 min-h-[16lh] md:min-h-0 md:basis-1/2">
          <div><span>markdown</span></div>
          <textarea
            value={about.body}
            onChange={(e) => set("body", e.target.value)}
            spellCheck={false}
            className="flex-1 w-full resize-none py-[1lh]"
          />
        </div>
        <div className="flex flex-1 min-h-0 md:basis-1/2">
          <AboutMe about={about} />
        </div>
      </div>
    </div>
  );
}
