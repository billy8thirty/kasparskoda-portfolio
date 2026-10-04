import { redirect } from "next/navigation";
import { isAdmin, isAdminConfigured } from "@/lib/auth";
import LoginForm from "@/components/admin/LoginForm";

export default async function AdminLogin() {
  if (await isAdmin()) redirect("/admin");

  return (
    <main className="flex items-center justify-center">
      <div box-="round" shear-="top" className="w-full max-w-[50ch]">
        <div>
          <span>Admin</span>
        </div>
        <div className="content py-[1lh]">
          {isAdminConfigured() ? (
            <LoginForm />
          ) : (
            <p>
              Kein Passwort gesetzt. Lege <code>ADMIN_PASSWORD</code> in <code>.env.local</code> an und starte den
              Server neu.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
