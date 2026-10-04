"use client";

import { useCallback, useRef, useState, useTransition } from "react";
import SocialsBox from "@/components/SocialsBox";
import Icon from "@/components/icon";
import { saveSocialsAction } from "@/app/admin/actions";
import { SITE_ASSETS, SITE_SECTION, type Social } from "@/lib/post-types";
import { useSaveShortcut } from "@/components/admin/useSaveShortcut";

function iconName(path: string) {
  return path.split("/").pop()?.replace(/\.svg$/, "") ?? path;
}

export default function SocialsEditor({ socials: initial, icons: initialIcons }: { socials: Social[]; icons: string[] }) {
  const [socials, setSocials] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [icons, setIcons] = useState(initialIcons);
  const [status, setStatus] = useState("");
  const [saving, startSaving] = useTransition();
  const iconInput = useRef<HTMLInputElement>(null);
  const iconTarget = useRef<number | null>(null);

  const dirty = JSON.stringify(socials) !== JSON.stringify(saved);

  const update = (i: number, patch: Partial<Social>) =>
    setSocials((list) => list.map((s, j) => (j === i ? { ...s, ...patch } : s)));

  const move = (i: number, dir: -1 | 1) =>
    setSocials((list) => {
      const j = i + dir;
      if (j < 0 || j >= list.length) return list;
      const next = [...list];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const remove = (i: number) => setSocials((list) => list.filter((_, j) => j !== i));

  const add = () =>
    setSocials((list) => [
      ...list,
      { id: crypto.randomUUID(), title: "Neu", icon: icons[0] ?? "", buttonText: "view profile", link: "https://", handle: "" },
    ]);

  const save = useCallback(() => {
    startSaving(async () => {
      try {
        await saveSocialsAction(socials);
        setSaved(socials);
        setStatus(`gespeichert ${new Date().toLocaleTimeString()}`);
      } catch {
        setStatus("speichern fehlgeschlagen");
      }
    });
  }, [socials]);

  useSaveShortcut(save, dirty);

  // Custom svg icons go to content/site/assets and become selectable right away.
  const uploadIcon = async (file: File) => {
    const form = new FormData();
    form.append("section", SITE_SECTION);
    form.append("slug", SITE_ASSETS);
    form.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setStatus(`fehler: ${data.error ?? res.status}`);
      return;
    }
    setIcons((list) => [...new Set([...list, data.url])]);
    if (iconTarget.current !== null) update(iconTarget.current, { icon: data.url });
    setStatus(`icon ${data.name} hochgeladen`);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div box-="round" shear-="top" className="flex flex-col">
        <div className="flex justify-between">
          <span>socials</span>
          <span>{saving ? "speichert..." : dirty ? "● ungespeichert" : status || "content/site/socials.json"}</span>
        </div>
        <div className="content flex gap-[1ch] py-[1ch]">
          <button box-="round" type="button" onClick={save} disabled={saving || !dirty}>
            speichern (ctrl+s)
          </button>
          <button box-="round" type="button" onClick={add}>
            + button
          </button>
          <input
            ref={iconInput}
            type="file"
            accept=".svg,image/svg+xml"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) uploadIcon(file);
              e.target.value = "";
            }}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row flex-1 min-h-0">
        <div box-="round" shear-="top" className="flex flex-col flex-1 min-h-0 md:basis-2/3">
          <div><span>buttons</span></div>
          <div className="content flex flex-col gap-[1ch] py-[1lh] overflow-y-auto">
            {socials.length === 0 && <p className="text-[var(--foreground2)]">Keine Buttons. Füge einen hinzu.</p>}
            {socials.map((s, i) => (
              <div key={s.id} box-="round" shear-="top" className="flex flex-col">
                <div className="flex justify-between">
                  <span>{s.title || "…"}</span>
                  <span className="flex gap-[1ch]">
                    <button type="button" className="link-button" onClick={() => move(i, -1)} disabled={i === 0} title="hoch">↑</button>
                    <button type="button" className="link-button" onClick={() => move(i, 1)} disabled={i === socials.length - 1} title="runter">↓</button>
                    <button type="button" className="link-button [--foreground2:var(--red)]" onClick={() => remove(i)} title="entfernen">✕</button>
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[2ch] gap-y-[0.5lh] px-[1ch] py-[0.5lh]">
                  <label className="flex flex-col">
                    titel
                    <input value={s.title} onChange={(e) => update(i, { title: e.target.value })} className="w-full" />
                  </label>
                  <label className="flex flex-col">
                    icon
                    <span className="flex gap-[1ch] items-center !bg-transparent !p-0">
                      {s.icon && <Icon src={s.icon} size={16} className="shrink-0" />}
                      <select value={s.icon} onChange={(e) => update(i, { icon: e.target.value })} className="field flex-1">
                        <option value="">kein icon</option>
                        {icons.map((icon) => (
                          <option key={icon} value={icon}>{iconName(icon)}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        className="link-button"
                        title="svg hochladen"
                        onClick={() => {
                          iconTarget.current = i;
                          iconInput.current?.click();
                        }}
                      >
                        + svg
                      </button>
                    </span>
                  </label>
                  <label className="flex flex-col">
                    button-text
                    <input value={s.buttonText} onChange={(e) => update(i, { buttonText: e.target.value })} className="w-full" />
                  </label>
                  <label className="flex flex-col">
                    handle / untertitel
                    <input value={s.handle} onChange={(e) => update(i, { handle: e.target.value })} className="w-full" />
                  </label>
                  <label className="flex flex-col md:col-span-2">
                    link
                    <input value={s.link} onChange={(e) => update(i, { link: e.target.value })} className="w-full" placeholder="https://… oder mailto:…" />
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div box-="round" shear-="top" className="flex flex-col flex-1 min-h-0 md:basis-1/3">
          <div><span>vorschau</span></div>
          <div className="content flex flex-col gap-[2ch] py-[1lh] overflow-y-auto">
            {socials.map((s) => (
              <SocialsBox key={s.id} social={s} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
