export default function Sidebar({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div box-="round" shear-="top" className="w-full sm:w-auto h-full flex flex-col min-h-0">
      <div><span className="text-nowrap">{title}</span></div>
      <div className="content flex flex-col gap-[2ch] my-[2ch] overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
