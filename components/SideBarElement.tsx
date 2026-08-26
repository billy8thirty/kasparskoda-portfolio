export default function SideBarElement({ title, date, type ,summary, link, buttonText}) {
  return (
    <div box-="round" shear-="both" className="max-w-[50ch]">
      <div><span>{title}</span></div>
      <div className="flex justify-between gap-[2ch]">
        <p className="text-pretty">{summary}</p>
        <button box-="round" className="text-nowrap">{buttonText}</button>
      </div>
      <div className="flex justify-between"><span>{date}</span><span>{type}</span></div>
    </div>
  );
}
