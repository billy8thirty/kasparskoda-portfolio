import { requireAdmin } from "@/lib/auth";
import AdminNav from "@/components/admin/AdminNav";
import { logoutAction } from "@/app/admin/actions";

export default async function AdminPanelLayout({ children }: LayoutProps<"/admin">) {
  await requireAdmin();

  return (
    <main className="flex flex-col sm:flex-row min-h-0">
      <div box-="round" shear-="top" className="flex flex-col sm:w-[28ch] shrink-0">
        <div className="flex justify-between">
          <span>admin</span>
          <form action={logoutAction}>
            <button type="submit" className="link-button">logout</button>
          </form>
        </div>
        <AdminNav />
      </div>
      <div className="flex flex-col flex-1 min-w-0 min-h-0">{children}</div>
    </main>
  );
}
