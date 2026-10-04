export default function EmptyPane({ text = "Select something..." }: { text?: string }) {
  return (
    <div box-="round" className="grayed-out content flex flex-grow justify-center items-center text-nowrap">
      <p className="px-[1ch]">{text}</p>
    </div>
  );
}
