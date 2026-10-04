import { markdownToHtml } from "@/lib/render";
import type { About } from "@/lib/post-types";

export default function AboutMe({ about }: { about: About }) {
  return (
    <div box-="round" shear-="top" className="w-full flex flex-col">
      <div><span>About me</span></div>
      <div className="content w-full flex flex-col gap-[3ch] overflow-y-auto">
        <h3 className="mt-[1ch]">{about.heading}</h3>

        <div className="md text-pretty mr-[5ch] max-w-[60ch]" dangerouslySetInnerHTML={{ __html: markdownToHtml(about.body) }} />

        <div className="flex flex-col">
          <em>location.......{about.location}</em>
          <em>Available......<strong>{about.availability}</strong></em>
        </div>
      </div>
    </div>
  );
}
