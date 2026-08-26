export default function SideBarElement({ title, date, type ,summary, link, buttonText}) {
  return (
    <div box-="round" shear-="both" className="w-full sm:max-w-[50ch] flex flex-col mt-[1ch]">
      <div><span>{title}</span></div>
      <div className="flex flex-col md:flex-row justify-between gap-[2ch]">
        <p className="text-pretty ml-[1ch] break-keep hidden sm:block">{summary}</p>
        <button box-="round" className="text-nowrap px-[3ch]">{buttonText}</button>
      </div>
      <div className="flex justify-between"><span>{date}</span><span>{type}</span></div>
    </div>
  );
}
