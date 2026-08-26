export default function Sidebar({ title, children }) {
  return (
    <div box-="round" shear-="top" className="w-full sm:w-auto h-full">
      <div><span className="text-nowrap">{title}</span></div>
      <div className="content flex flex-col gap-[2ch] my-[2ch]">
        {children}
      </div>
    </div>
  );
}
