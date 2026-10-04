"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/actions";

export default function LoginForm() {
  const [error, action, pending] = useActionState(loginAction, null);

  return (
    <form action={action} className="flex flex-col gap-[1lh]">
      <label className="flex flex-col">
        password
        <input type="password" name="password" autoFocus required className="w-full" />
      </label>
      {error && <p className="text-[var(--red)]">{error}</p>}
      <button box-="round" type="submit" disabled={pending}>
        {pending ? "..." : "login"}
      </button>
    </form>
  );
}
