export default function Sidebar({ title, children }) {
  return (
    <div box-="round" shear-="top" className="h-full">
      <div><span>{title}</span></div>
      <div className="content">
        {children}
      </div>
    </div>
  );
}
