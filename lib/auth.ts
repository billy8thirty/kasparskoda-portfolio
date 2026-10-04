import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Single-user admin: the password lives in ADMIN_PASSWORD (.env.local), the cookie holds an HMAC of it.
const COOKIE = "admin_session";
const MAX_AGE = 60 * 60 * 24 * 30;

function sessionToken() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return createHmac("sha256", password).update("kasparskoda-admin-session").digest("hex");
}

function safeEqual(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export async function isAdmin() {
  const token = sessionToken();
  const value = (await cookies()).get(COOKIE)?.value;
  return Boolean(token && value && safeEqual(value, token));
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

export async function login(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  const token = sessionToken();
  if (!expected || !token || !safeEqual(password, expected)) return false;

  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
  return true;
}

export async function logout() {
  (await cookies()).delete(COOKIE);
}
