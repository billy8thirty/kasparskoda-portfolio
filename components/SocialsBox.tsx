import Icon from "@/components/icon";
import type { Social } from "@/lib/post-types";

export default function SocialsBox({ social }: { social: Social }) {
  return (
    <a box-="round" shear-="both" href={social.link} target="_blank" rel="noreferrer" className="text-nowrap w-full sm:max-w-[50ch] flex flex-col gap-[1ch]">
      <div className="text-start flex justify-between">
        <span className="flex flex-row gap-[1ch] justify-between">
          {social.icon && <Icon src={social.icon} className="text-[var(--fg)]" />}
        </span>
        <span>{social.title}</span>
      </div>
      <div className="px-[1ch] text-center">{social.buttonText}</div>
      <div className="flex justify-center px-[1ch]">
        <span>{social.handle}</span>
      </div>
    </a>
  );
}
