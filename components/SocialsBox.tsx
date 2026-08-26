import Link from "next/link";
import Icon from "@/components/icon.tsx";


export default function SideBarElement({ title, iconPath, handle, link, buttonText}) {
  return (
    <a box-="round" shear-="both" href={link} target="_blank" className="text-nowrap w-full sm:max-w-[50ch] flex flex-col gap-[1ch]">
      <div className="text-start flex justify-between">
        <span className="flex flex-row gap-[1ch] justify-between">
          <Icon src={iconPath} className="text-[var(--fg)]" />
        </span>
        <span>
          {title}
        </span>
      </div>
      <div className="px-[1ch] text-center">
        {buttonText}
      </div>
      <div className="flex justify-center px-[1ch]">
        <span>{handle}</span>
      </div>
    </a>
  );
}
